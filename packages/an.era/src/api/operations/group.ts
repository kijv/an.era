import type { MaybeValiSchema, ObjectValuesToTuple } from '../../declaration';
import type { HttpMethods } from 'oas/types';
import type { Operation } from '.';

export type TransformedOperation = Operation & { id: string };

export type GroupedOperation<
  TParams extends Record<string, MaybeValiSchema> = Record<
    string,
    MaybeValiSchema
  >,
  TOps extends Record<string, Operation> = Record<string, Operation>,
> = {
  parameters: TParams;
  operations: TOps;
};

type CamelCase<T extends string> = T extends `${infer P}${infer U}`
  ? `${Lowercase<P>}${U}`
  : T;

type RemoveMethodFromOperationKey<
  O extends Record<string, Operation>,
  K extends keyof O,
> = K extends `${O[K]['method']}${infer U}` ? U : K;

type SplitCamelCase<
  S extends string,
  CurrentTerm extends string = '',
> = S extends `${infer First}${infer Rest}`
  ? First extends Uppercase<First>
    ? First extends Lowercase<First>
      ? SplitCamelCase<Rest, `${CurrentTerm}${First}`>
      : CurrentTerm extends ''
        ? SplitCamelCase<Rest, First>
        : [CurrentTerm, ...SplitCamelCase<Rest, First>]
    : SplitCamelCase<Rest, `${CurrentTerm}${First}`>
  : CurrentTerm extends ''
    ? []
    : [CurrentTerm];

type ProcessedKey<
  O extends Record<string, Operation>,
  K extends keyof O,
> = CamelCase<RemoveMethodFromOperationKey<O, K> & string>;

type AllTermsOfKey<S extends string> =
  SplitCamelCase<S> extends infer Terms
    ? Terms extends string[]
      ? Lowercase<Terms[number]>
      : never
    : never;

type AllTermsOfOperation<
  O extends Record<string, Operation>,
  K extends keyof O,
> = AllTermsOfKey<ProcessedKey<O, K>>;

type OperationHasTerm<
  O extends Record<string, Operation>,
  K extends keyof O,
  Term extends string,
> = Term extends AllTermsOfOperation<O, K> ? true : false;

type TagsShareCommon<
  T1 extends readonly string[],
  T2 extends readonly string[],
> = T1[number] & T2[number] extends never ? false : true;

type ExtractResourcePath<
  Path extends string,
  Acc extends string = '',
> = Path extends `${infer Segment}/${infer Rest}`
  ? Segment extends `{${string}}`
    ? `${Acc}${Segment}`
    : ExtractResourcePath<Rest, `${Acc}${Segment}/`>
  : Path extends `{${string}}`
    ? `${Acc}${Path}`
    : `${Acc}${Path}`;

type PathsShareResourcePrefix<Path1 extends string, Path2 extends string> =
  ExtractResourcePath<Path1> extends ExtractResourcePath<Path2> ? true : false;

type AllTerms<O extends Record<string, Operation>> = {
  [K in keyof O]: AllTermsOfOperation<O, K>;
}[keyof O];

type HasNonEmptyParameters<Op extends Operation> =
  Op['parameters'] extends Record<string, MaybeValiSchema>
    ? keyof Op['parameters'] extends never
      ? false
      : true
    : false;

type SharesParameterKey<
  Op1 extends Operation,
  Op2 extends Operation,
> = keyof Op1['parameters'] & keyof Op2['parameters'] extends never
  ? false
  : true;

type ParamKeyCount<Op extends Operation> =
  ObjectValuesToTuple<Op['parameters']> extends infer T
    ? T extends readonly unknown[]
      ? T['length']
      : 0
    : 0;

type OpsWithTermAndSharedTag<
  O extends Record<string, Operation>,
  K extends keyof O,
  Term extends string,
> = {
  [L in keyof O as OperationHasTerm<O, L, Term> extends true
    ? HasNonEmptyParameters<O[L]> extends true
      ? TagsShareCommon<O[K]['tags'], O[L]['tags']> extends true
        ? PathsShareResourcePrefix<O[K]['path'], O[L]['path']> extends true
          ? L
          : never
        : never
      : never
    : never]: O[L];
};

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
          ? PathsShareResourcePrefix<O[K]['path'], O[L]['path']> extends true
            ? L
            : never
          : never
        : never
      : never]: O[L];
};

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

type OpsWithMoreParams<
  Ops extends Record<string, Operation>,
  Count extends number,
> = {
  [K in keyof Ops as GreaterThan<ParamKeyCount<Ops[K]>, Count> extends true
    ? K
    : never]: Ops[K];
};

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
  ? keyof OtherOpsWithTermAndSharedTag<O, K, Term> extends never
    ? false
    : true
  : {
        [L in keyof MoreParamOps]: MoreParamOps[L] extends Operation
          ? SharesParameterKey<O[K], MoreParamOps[L]> extends true
            ? true
            : false
          : false;
      } extends infer Result
    ? false extends Result[keyof Result]
      ? false
      : true
    : false;

type HasSharedTagWithSameTermOp<
  O extends Record<string, Operation>,
  K extends keyof O,
  Term extends string,
> =
  OtherOpsWithTermAndSharedTag<O, K, Term> extends infer OtherOps
    ? keyof OtherOps extends never
      ? false
      : SharesParamWithMoreParamOps<O, K, Term>
    : false;

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

type TermsBeforeTerm<
  Terms extends string[],
  Target extends string,
  Acc extends string[] = [],
> = Terms extends [infer First extends string, ...infer Rest extends string[]]
  ? Lowercase<First> extends Target
    ? Acc
    : TermsBeforeTerm<Rest, Target, [...Acc, First]>
  : Acc;

type TermsAfterTerm<
  Terms extends string[],
  Target extends string,
> = Terms extends [infer First extends string, ...infer Rest extends string[]]
  ? Lowercase<First> extends Target
    ? Rest
    : TermsAfterTerm<Rest, Target>
  : [];

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
                  ? O[K]['method']
                  : JoinTermsAsCamelCase<After>
                : O[K]['method']
              : O[K]['method']
            : JoinTermsAsCamelCase<Before>
          : O[K]['method']
        : O[K]['method']
      : O[K]['method']
    : O[K]['method'];

type AllParamTypesFromGroup<Ops extends Record<string, Operation>> =
  keyof Ops[keyof Ops]['parameters'] & string;

type GetParamSchema<
  Ops extends Record<string, Operation>,
  ParamType extends string,
> = {
  [K in keyof Ops]: ParamType extends keyof Ops[K]['parameters']
    ? Ops[K]['parameters'][ParamType]
    : never;
}[keyof Ops];

type GroupParameters<Ops extends Record<string, Operation>> = {
  [ParamType in AllParamTypesFromGroup<Ops>]: GetParamSchema<Ops, ParamType>;
};

type OperationWithId<
  Op extends Operation = Operation,
  Id extends string = string,
> = {
  id: Id;
} & Op;

type OperationWithoutCommonParams<
  Op extends Operation,
  CommonParamTypes extends string,
  Id extends string,
> = {
  id: Id;
  path: Op['path'];
  method: Op['method'];
  tags: Op['tags'];
  parameters: Omit<Op['parameters'], CommonParamTypes>;
  response: Op['response'];
};

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
    : never]: OperationWithoutCommonParams<
    O[K],
    AllParamTypesFromGroup<Ops>,
    K & string
  >;
};

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
      ? GroupedOperation<
          GroupParameters<Ops>,
          OperationsWithTermAndSharedTagsStripped<O, Term>
        >
      : never
    : never;
};

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

type UngroupedOperations<O extends Record<string, Operation>> = {
  [K in keyof O as IsOperationGrouped<O, K> extends true
    ? never
    : ProcessedKey<O, K> & string]: OperationWithId<O[K], K & string>;
};

export type TransformOperations<O extends Record<string, Operation>> =
  GroupedOperations<O> & UngroupedOperations<O>;

export const splitCamelCase = (str: string): string[] => {
  const terms: string[] = [];
  let currentTerm = '';

  for (const char of str) {
    const isUppercase =
      char === char.toUpperCase() && char !== char.toLowerCase();

    if (isUppercase) {
      if (currentTerm) {
        terms.push(currentTerm);
      }
      currentTerm = char;
    } else {
      currentTerm += char;
    }
  }

  if (currentTerm) {
    terms.push(currentTerm);
  }

  return terms;
};

export const getProcessedKey = (key: string, method: HttpMethods): string => {
  const methodUpper = method.toUpperCase();
  const keyUpper = key.slice(0, method.length).toUpperCase();

  if (keyUpper === methodUpper) {
    const rest = key.slice(method.length);
    return rest.charAt(0).toLowerCase() + rest.slice(1);
  }

  return key.charAt(0).toLowerCase() + key.slice(1);
};

export const getAllTerms = (processedKey: string): string[] =>
  splitCamelCase(processedKey).map((t) => t.toLowerCase());

export const getStrippedKey = (
  processedKey: string,
  term: string,
  method: HttpMethods,
): string => {
  const terms = splitCamelCase(processedKey);
  const termIndex = terms.findIndex((t) => t.toLowerCase() === term);

  if (termIndex === -1) {
    return method;
  }

  const before = terms.slice(0, termIndex);
  const after = terms.slice(termIndex + 1);

  const firstBefore = before[0];
  if (firstBefore) {
    return (
      firstBefore.toLowerCase() +
      before
        .slice(1)
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
        .join('')
    );
  }

  const firstAfter = after[0];
  if (firstAfter) {
    return (
      firstAfter.toLowerCase() +
      after
        .slice(1)
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
        .join('')
    );
  }

  return method;
};

export const extractResourcePath = (path: string): string => {
  const segments = path.split('/');
  let result = '';

  for (const segment of segments) {
    if (segment.startsWith('{') && segment.endsWith('}')) {
      result += (result ? '/' : '') + segment;
      return result;
    }
    result += (result ? '/' : '') + segment;
  }

  return result;
};

export const pathsShareResourcePrefix = (
  path1: string,
  path2: string,
): boolean => extractResourcePath(path1) === extractResourcePath(path2);

export const hasNonEmptyParameters = (op: Operation): boolean =>
  Object.keys(op.parameters).length > 0;

export const getParamKeyCount = (op: Operation): number =>
  Object.keys(op.parameters).length;

export const tagsShareCommon = (
  tags1: readonly string[],
  tags2: readonly string[],
): boolean => tags1.some((t) => tags2.includes(t));

export const sharesParameterKey = (op1: Operation, op2: Operation): boolean => {
  const keys1 = Object.keys(op1.parameters);
  const keys2 = Object.keys(op2.parameters);
  return keys1.some((k) => keys2.includes(k));
};

export const getOpsWithTermAndSharedTag = (
  operations: Record<string, Operation>,
  currentKey: string,
  term: string,
): Operation[] => {
  const currentOp = operations[currentKey];
  if (!currentOp) return [];

  const result: Operation[] = [];

  for (const [key, op] of Object.entries(operations)) {
    if (!hasNonEmptyParameters(op)) continue;

    const processedKey = getProcessedKey(key, op.method);
    const terms = getAllTerms(processedKey);

    if (
      terms.includes(term) &&
      tagsShareCommon(currentOp.tags, op.tags) &&
      pathsShareResourcePrefix(currentOp.path, op.path)
    ) {
      result.push(op);
    }
  }

  return result;
};

export const hasSharedTagWithSameTermOp = (
  operations: Record<string, Operation>,
  currentKey: string,
  term: string,
): boolean => {
  const currentOp = operations[currentKey];
  if (!currentOp) return false;

  const allOps = getOpsWithTermAndSharedTag(operations, currentKey, term);
  const otherOps = allOps.filter((op) => op !== currentOp);

  if (otherOps.length === 0) return false;

  const currentParamCount = getParamKeyCount(currentOp);
  const opsWithMoreParams = otherOps.filter(
    (op) => getParamKeyCount(op) > currentParamCount,
  );

  if (opsWithMoreParams.length === 0) {
    return true;
  }

  for (const op of opsWithMoreParams) {
    if (!sharesParameterKey(currentOp, op)) {
      return false;
    }
  }

  return true;
};

export const getCommonParamTypes = (ops: Operation[]): string[] => {
  if (ops.length === 0) return [];

  const firstOp = ops[0];
  if (!firstOp) return [];

  let commonTypes = new Set<string>(Object.keys(firstOp.parameters));

  for (let i = 1; i < ops.length; i++) {
    const op = ops[i];
    if (!op) continue;

    const opParamTypes = new Set<string>(Object.keys(op.parameters));
    commonTypes = new Set([...commonTypes].filter((t) => opParamTypes.has(t)));
  }

  return Array.from(commonTypes);
};

export const buildGroupParameters = (
  ops: Operation[],
): Record<string, MaybeValiSchema> => {
  const paramTypes = getCommonParamTypes(ops);
  const result: Record<string, MaybeValiSchema> = {};

  for (const paramType of paramTypes) {
    for (const op of ops) {
      const schema = op.parameters[paramType];
      if (schema) {
        result[paramType] = schema;
        break;
      }
    }
  }

  return result;
};

export const removeCommonParams = (
  op: Operation,
  commonParamTypes: string[],
  id: string,
): TransformedOperation => {
  const filteredParams: Record<string, MaybeValiSchema> = {};

  for (const [key, value] of Object.entries(op.parameters)) {
    if (!commonParamTypes.includes(key)) {
      filteredParams[key] = value;
    }
  }

  return {
    ...op,
    id,
    parameters: filteredParams,
  };
};

export const isGroupedOperation = <
  TParams extends Record<string, MaybeValiSchema>,
  TOps extends Record<string, Operation>,
>(
  value: Operation | GroupedOperation<TParams, TOps>,
): value is GroupedOperation<TParams, TOps> =>
  'operations' in value && 'parameters' in value && !('method' in value);

export const transformOperations = <O extends Record<string, Operation>>(
  operations: O,
): TransformOperations<O> => {
  const result: Record<string, TransformedOperation | GroupedOperation> = {};
  const groupedOperationKeys = new Set<string>();

  const allTerms = new Set<string>();
  for (const [key, op] of Object.entries(operations)) {
    const processedKey = getProcessedKey(key, op.method);
    for (const term of getAllTerms(processedKey)) {
      allTerms.add(term);
    }
  }

  for (const term of allTerms) {
    const matchingOps: Array<{
      key: string;
      op: Operation;
      processedKey: string;
    }> = [];

    for (const [key, op] of Object.entries(operations)) {
      if (!hasNonEmptyParameters(op)) continue;

      const processedKey = getProcessedKey(key, op.method);
      const terms = getAllTerms(processedKey);

      if (
        terms.includes(term) &&
        hasSharedTagWithSameTermOp(operations, key, term)
      ) {
        matchingOps.push({ key, op, processedKey });
      }
    }

    if (matchingOps.length > 0) {
      const groupParams = buildGroupParameters(matchingOps.map((m) => m.op));
      const commonParamTypes = Object.keys(groupParams);

      const groupOperations: Record<string, TransformedOperation> = {};

      for (const { key, op, processedKey } of matchingOps) {
        const strippedKey = getStrippedKey(processedKey, term, op.method);
        groupOperations[strippedKey] = removeCommonParams(
          op,
          commonParamTypes,
          key,
        );
        groupedOperationKeys.add(key);
      }

      result[term] = {
        parameters: groupParams,
        operations: groupOperations,
      };
    }
  }

  for (const [key, op] of Object.entries(operations)) {
    if (groupedOperationKeys.has(key)) continue;

    const processedKey = getProcessedKey(key, op.method);
    result[processedKey] = { ...op, id: key };
  }

  return result as TransformOperations<O>;
};
