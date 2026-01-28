import type * as v from 'valibot';
import type { HttpMethods } from 'oas/types';
export type { HttpMethods };
import type { operations } from '../openapi/paths';

export type ValiSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

export type Operation = {
  path: string;
  method: HttpMethods;
  tags: readonly string[];
  parameters: Record<string, ValiSchema>;
  response: Record<string, Record<string, ValiSchema>>;
};

type RemoveMethodFromOperationKey<
  O extends Record<string, Operation>,
  K extends keyof O,
> = K extends `${O[K]['method']}${infer U}` ? U : K;

type CamelCase<T extends string> = T extends `${infer P}${infer U}`
  ? `${Lowercase<P>}${U}`
  : T;

type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type LastOfUnion<T> =
  UnionToIntersection<T extends unknown ? () => T : never> extends () => infer R
    ? R
    : never;

type ObjectValuesToTuple<O, K = keyof O, Acc extends unknown[] = []> = [
  K,
] extends [never]
  ? Acc
  : LastOfUnion<K> extends infer L
    ? L extends keyof O
      ? ObjectValuesToTuple<O, Exclude<K, L>, [O[L], ...Acc]>
      : Acc
    : never;

// Split camelCase string into terms
// e.g., "userProfile" -> ["user", "Profile"]
type SplitCamelCase<
  S extends string,
  CurrentTerm extends string = '',
> = S extends `${infer First}${infer Rest}`
  ? First extends Uppercase<First>
    ? First extends Lowercase<First>
      ? // Not a cased letter (number, etc.) - continue current term
        SplitCamelCase<Rest, `${CurrentTerm}${First}`>
      : // Uppercase letter - start new term
        CurrentTerm extends ''
        ? SplitCamelCase<Rest, First>
        : [CurrentTerm, ...SplitCamelCase<Rest, First>]
    : // Lowercase letter - continue current term
      SplitCamelCase<Rest, `${CurrentTerm}${First}`>
  : CurrentTerm extends ''
    ? []
    : [CurrentTerm];

// Get processed key for an operation (method removed, first char lowercased)
type ProcessedKey<
  O extends Record<string, Operation>,
  K extends keyof O,
> = CamelCase<RemoveMethodFromOperationKey<O, K> & string>;

// Get all terms from a processed key (lowercased)
type AllTermsOfKey<S extends string> =
  SplitCamelCase<S> extends infer Terms
    ? Terms extends string[]
      ? Lowercase<Terms[number]>
      : never
    : never;

// Get all terms from an operation's processed key (lowercased)
type AllTermsOfOperation<
  O extends Record<string, Operation>,
  K extends keyof O,
> = AllTermsOfKey<ProcessedKey<O, K>>;

// Check if an operation contains a specific term (case insensitive)
type OperationHasTerm<
  O extends Record<string, Operation>,
  K extends keyof O,
  Term extends string,
> = Term extends AllTermsOfOperation<O, K> ? true : false;

// Check if two tag arrays share at least one common tag
type TagsShareCommon<
  T1 extends readonly string[],
  T2 extends readonly string[],
> = T1[number] & T2[number] extends never ? false : true;

// Get all unique terms across all operations (lowercased)
type AllTerms<O extends Record<string, Operation>> = {
  [K in keyof O]: AllTermsOfOperation<O, K>;
}[keyof O];

// Check if an operation has non-empty parameters
type HasNonEmptyParameters<Op extends Operation> =
  Op['parameters'] extends Record<string, ValiSchema>
    ? keyof Op['parameters'] extends never
      ? false
      : true
    : false;

// Check if two operations share at least one common parameter key
type SharesParameterKey<
  Op1 extends Operation,
  Op2 extends Operation,
> = keyof Op1['parameters'] & keyof Op2['parameters'] extends never
  ? false
  : true;

// Count the number of parameter keys in an operation
type ParamKeyCount<Op extends Operation> =
  ObjectValuesToTuple<Op['parameters']> extends infer T
    ? T extends readonly unknown[]
      ? T['length']
      : 0
    : 0;

// Get all operations that have the term, non-empty params, and share a tag with K
type OpsWithTermAndSharedTag<
  O extends Record<string, Operation>,
  K extends keyof O,
  Term extends string,
> = {
  [L in keyof O as OperationHasTerm<O, L, Term> extends true
    ? HasNonEmptyParameters<O[L]> extends true
      ? TagsShareCommon<O[K]['tags'], O[L]['tags']> extends true
        ? L
        : never
      : never
    : never]: O[L];
};

// Get all OTHER operations (excluding K) that have the term, non-empty params, and share a tag with K
type OtherOpsWithTermAndSharedTag<
  O extends Record<string, Operation>,
  K extends keyof O,
  Term extends string,
> = {
  [L in keyof O as L extends K
    ? never
    : OperationHasTerm<O, L, Term> extends true
      ? HasNonEmptyParameters<O[L]> extends true
        ? TagsShareCommon<O[K]['tags'], O[L]['tags']> extends true
          ? L
          : never
        : never
      : never]: O[L];
};

// Check if A > B for small numbers (0-10 should be enough for param counts)
type GreaterThan<A extends number, B extends number> = A extends B
  ? false
  : [A, B] extends [0, number]
    ? false
    : [A, B] extends [number, 0]
      ? true
      : A extends 1
        ? false
        : B extends 1
          ? true
          : A extends 2
            ? false
            : B extends 2
              ? true
              : A extends 3
                ? false
                : B extends 3
                  ? true
                  : A extends 4
                    ? false
                    : B extends 4
                      ? true
                      : false;

// Filter to operations that have STRICTLY MORE params than the given count
type OpsWithMoreParams<
  Ops extends Record<string, Operation>,
  Count extends number,
> = {
  [K in keyof Ops as GreaterThan<ParamKeyCount<Ops[K]>, Count> extends true
    ? K
    : never]: Ops[K];
};

// Check if operation K shares at least one parameter key with ALL operations
// that have MORE params than K (among ops with term and shared tag)
// If no ops have more params, check if K shares with at least one other op
type SharesParamWithMoreParamOps<
  O extends Record<string, Operation>,
  K extends keyof O,
  Term extends string,
  AllOps extends Record<string, Operation> = OpsWithTermAndSharedTag<
    O,
    K,
    Term
  >,
  MoreParamOps extends Record<string, Operation> = OpsWithMoreParams<
    AllOps,
    ParamKeyCount<O[K]>
  >,
> = keyof MoreParamOps extends never
  ? // No ops with more params - K has the most params, just needs to share with at least one
    keyof OtherOpsWithTermAndSharedTag<O, K, Term> extends never
    ? false
    : true
  : // There are ops with more params - K must share with ALL of them
    {
        [L in keyof MoreParamOps]: MoreParamOps[L] extends Operation
          ? SharesParameterKey<O[K], MoreParamOps[L]> extends true
            ? true
            : false
          : false;
      } extends infer Result
    ? false extends Result[keyof Result]
      ? false // At least one more-param operation doesn't share params
      : true
    : false;

// Check if an operation can be grouped: it must share a parameter key with ALL
// operations that have more parameters than it (among ops with same term and tag)
type HasSharedTagWithSameTermOp<
  O extends Record<string, Operation>,
  K extends keyof O,
  Term extends string,
> =
  OtherOpsWithTermAndSharedTag<O, K, Term> extends infer OtherOps
    ? keyof OtherOps extends never
      ? false // No other ops
      : SharesParamWithMoreParamOps<O, K, Term>
    : false;

// Filter operations that contain a term and share tags with at least one other op with that term
// Only considers operations with non-empty parameters
type OperationsWithTermAndSharedTags<
  O extends Record<string, Operation>,
  Term extends string,
> = {
  [K in keyof O as OperationHasTerm<O, K, Term> extends true
    ? HasNonEmptyParameters<O[K]> extends true
      ? HasSharedTagWithSameTermOp<O, K, Term> extends true
        ? K
        : never
      : never
    : never]: O[K];
};

// Join remaining terms back to camelCase (first term lowercased, rest keep original casing)
type JoinTermsAsCamelCase<T extends string[]> = T extends [
  infer First extends string,
  ...infer Rest extends string[],
]
  ? `${Lowercase<First>}${JoinTermsCapitalized<Rest>}`
  : '';

type JoinTermsCapitalized<T extends string[]> = T extends [
  infer First extends string,
  ...infer Rest extends string[],
]
  ? `${Capitalize<First>}${JoinTermsCapitalized<Rest>}`
  : '';

// Get terms before a matching term (case insensitive)
type TermsBeforeTerm<
  Terms extends string[],
  Target extends string,
  Acc extends string[] = [],
> = Terms extends [infer First extends string, ...infer Rest extends string[]]
  ? Lowercase<First> extends Target
    ? Acc // Found the target, return accumulated terms
    : TermsBeforeTerm<Rest, Target, [...Acc, First]>
  : Acc; // Target not found, return all accumulated

// Get terms after a matching term (case insensitive)
type TermsAfterTerm<
  Terms extends string[],
  Target extends string,
> = Terms extends [infer First extends string, ...infer Rest extends string[]]
  ? Lowercase<First> extends Target
    ? Rest // Found the target, return remaining terms
    : TermsAfterTerm<Rest, Target>
  : []; // Target not found, return empty

// Get the stripped key: use terms before the matching term, or after if none before, or method
// e.g., "createChannel" with term "channel" -> "create" (before)
// e.g., "channelContents" with term "channel" -> "contents" (after, since nothing before)
// e.g., "channel" with term "channel" -> method (nothing before or after)
type StrippedOperationKey<
  O extends Record<string, Operation>,
  K extends keyof O,
  Term extends string,
> =
  SplitCamelCase<ProcessedKey<O, K>> extends infer Terms
    ? Terms extends string[]
      ? TermsBeforeTerm<Terms, Term> extends infer Before
        ? Before extends string[]
          ? Before extends []
            ? TermsAfterTerm<Terms, Term> extends infer After
              ? After extends string[]
                ? After extends []
                  ? O[K]['method'] // Nothing before or after, use method
                  : JoinTermsAsCamelCase<After>
                : O[K]['method']
              : O[K]['method']
            : JoinTermsAsCamelCase<Before>
          : O[K]['method']
        : O[K]['method']
      : O[K]['method']
    : O[K]['method'];

// Filter operations with stripped keys and remove common parameters
type OperationsWithTermAndSharedTagsStripped<
  O extends Record<string, Operation>,
  Term extends string,
  Ops extends Record<string, Operation> = OperationsWithTermAndSharedTags<
    O,
    Term
  >,
> = {
  [K in keyof O as OperationHasTerm<O, K, Term> extends true
    ? HasNonEmptyParameters<O[K]> extends true
      ? HasSharedTagWithSameTermOp<O, K, Term> extends true
        ? StrippedOperationKey<O, K, Term>
        : never
      : never
    : never]: OperationWithoutCommonParams<O[K], AllParamTypesFromGroup<Ops>>;
};

// Get all parameter type keys from a group of operations
type AllParamTypesFromGroup<Ops extends Record<string, Operation>> =
  keyof Ops[keyof Ops]['parameters'] & string;

// Get the schema for a param type from any operation (they should be compatible)
type GetParamSchema<
  Ops extends Record<string, Operation>,
  ParamType extends string,
> = {
  [K in keyof Ops]: ParamType extends keyof Ops[K]['parameters']
    ? Ops[K]['parameters'][ParamType]
    : never;
}[keyof Ops];

// Build the parameters object matching Operation['parameters'] structure
// with only the parameter types that are common across operations
type GroupParameters<Ops extends Record<string, Operation>> = {
  [ParamType in AllParamTypesFromGroup<Ops>]: GetParamSchema<Ops, ParamType>;
};

// Create an operation with common parameter types removed
type OperationWithoutCommonParams<
  Op extends Operation,
  CommonParamTypes extends string,
> = {
  path: Op['path'];
  method: Op['method'];
  tags: Op['tags'];
  parameters: Omit<Op['parameters'], CommonParamTypes>;
  response: Op['response'];
};

// Clean version that removes empty groups, with stripped operation keys
type GroupedOperations<O extends Record<string, Operation>> = {
  [Term in AllTerms<O> & string as OperationsWithTermAndSharedTags<
    O,
    Term
  > extends infer Ops
    ? Ops extends Record<string, Operation>
      ? keyof Ops extends never
        ? never
        : Term
      : never
    : never]: OperationsWithTermAndSharedTags<O, Term> extends infer Ops
    ? Ops extends Record<string, Operation>
      ? {
          parameters: GroupParameters<Ops>;
          operations: OperationsWithTermAndSharedTagsStripped<O, Term>;
        }
      : never
    : never;
};

// Check if an operation is part of any group (checks all terms, returns true if ANY term matches)
type IsOperationGrouped<
  O extends Record<string, Operation>,
  K extends keyof O,
> =
  HasNonEmptyParameters<O[K]> extends true
    ? true extends (
        AllTermsOfOperation<O, K> extends infer Term
          ? Term extends string
            ? HasSharedTagWithSameTermOp<O, K, Term> extends true
              ? true
              : never
            : never
          : never
      )
      ? true
      : false
    : false;

// Ungrouped operations with method removed from key
type UngroupedOperations<O extends Record<string, Operation>> = {
  [K in keyof O as IsOperationGrouped<O, K> extends true
    ? never
    : ProcessedKey<O, K> & string]: O[K];
};

// Combined type: grouped operations + ungrouped operations as top-level
type GroupOperationsByTermAndTagsClean<O extends Record<string, Operation>> =
  GroupedOperations<O> & UngroupedOperations<O>;

// Forces TypeScript to fully evaluate/expand object types
type Prettify<T> = { [K in keyof T]: T[K] } & {};

// Expands each element in a tuple
type PrettifyTuple<T> = T extends [infer First, ...infer Rest]
  ? [Prettify<First>, ...PrettifyTuple<Rest>]
  : [];

// Tuple of ValiSchema to Tuple of v.InferInput<ValiSchema>
type MapSchemaTupleToInput<T extends ValiSchema[]> = T extends [
  infer First extends ValiSchema,
  ...infer Rest extends ValiSchema[],
]
  ? Rest extends []
    ? [v.InferInput<First>]
    : [v.InferInput<First>, ...MapSchemaTupleToInput<Rest>]
  : [];

// Operation['response']] (Record<string, Record<string, ValiSchema>>) to Union of v.InferOutput<ValiSchema>
type MapResponseToUnion<T> = {
  [K in keyof T]: {
    [M in keyof T[K]]: T[K][M] extends ValiSchema
      ? v.InferOutput<T[K][M]>
      : never;
  }[keyof T[K]];
}[keyof T];

// Single endpoint function type
export type Endpoint<O extends Operation> = (
  ...args: PrettifyTuple<
    MapSchemaTupleToInput<ObjectValuesToTuple<O['parameters']>>
  >
) => Promise<Prettify<MapResponseToUnion<O['response']>>>;

// Grouped endpoint function type - takes group params and returns object of endpoints
export type GroupedEndpoint<
  TParams extends Record<string, ValiSchema>,
  TOps extends Record<string, Operation>,
> = (
  ...args: PrettifyTuple<MapSchemaTupleToInput<ObjectValuesToTuple<TParams>>>
) => Prettify<{
  [K in keyof TOps]: Endpoint<TOps[K]>;
}>;

// Generic type to create Endpoints from any operations object
export type CreateEndpoints<O extends Record<string, Operation>> = {
  [K in keyof GroupOperationsByTermAndTagsClean<O>]: GroupOperationsByTermAndTagsClean<O>[K] extends infer TMaybeGroupedOperation
    ? TMaybeGroupedOperation extends {
        parameters: infer TParams extends Record<string, ValiSchema>;
        operations: infer TOps extends Record<string, Operation>;
      }
      ? GroupedEndpoint<TParams, TOps>
      : TMaybeGroupedOperation extends Operation
        ? Endpoint<TMaybeGroupedOperation>
        : never
    : never;
};

// Endpoints type for the specific operations from openapi
export type Endpoints = CreateEndpoints<typeof operations>;
