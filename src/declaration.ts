// Convert union of keys to tuple
type UnionToTuple<U extends string, Last = LastInUnion<U>> = [U] extends [never]
  ? []
  : [...UnionToTuple<Exclude<U, Last>>, Last];

type LastInUnion<U> =
  UnionToIntersection<U extends unknown ? (x: U) => void : never> extends (
    x: infer L,
  ) => void
    ? L
    : never;

type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

// Find the longest common prefix among all strings in a tuple
type CommonPrefix<T extends readonly string[]> = T extends readonly [
  infer First extends string,
  ...infer Rest extends string[],
]
  ? Rest extends readonly []
    ? First
    : CommonPrefixTwo<First, CommonPrefix<Rest>>
  : '';

type CommonPrefixTwo<
  A extends string,
  B extends string,
> = A extends `${infer AFirst}${infer ARest}`
  ? B extends `${infer BFirst}${infer BRest}`
    ? AFirst extends BFirst
      ? `${AFirst}${CommonPrefixTwo<ARest, BRest>}`
      : ''
    : ''
  : '';

// Remove prefix from a single string
type RemovePrefix<
  S extends string,
  Prefix extends string,
  Default extends string = never,
> = S extends `${Prefix}${infer Rest}`
  ? Rest extends ''
    ? [Default] extends [never]
      ? S
      : Default
    : Uncapitalize<Rest>
  : S;

// Main type: removes common prefix from all keys
type RemoveCommonPrefix<
  T extends Record<string, any>,
  Default extends string = never,
> = {
  [K in keyof T as RemovePrefix<
    K & string,
    CommonPrefix<UnionToTuple<Extract<keyof T, string>>>,
    Default
  >]: T[K];
};

// Get all keys from parent object where child has key K directly and count is exactly 1
type KeysWithOccurrence<T, K extends PropertyKey> = {
  [P in keyof T]: T[P] extends object
    ? K extends keyof T[P]
      ? P
      : never
    : never;
}[keyof T];

// Helper: Check if we have exactly one key
type SingleKey<Keys> = Keys extends never
  ? never
  : Keys extends infer U
    ? U extends Keys
      ? [Exclude<Keys, U>] extends [never]
        ? U
        : never
      : never
    : never;

// Check if there's exactly one key with the target key K
type SingleKeyWithSingleOccurrence<T, K extends PropertyKey> = SingleKey<
  KeysWithOccurrence<T, K>
>;

// Helper to check if type is a single string (not a union, not never)
type IsSingleString<T> = [T] extends [never]
  ? false
  : T extends string
    ? [T] extends [string]
      ? string extends T
        ? false // T is the generic 'string' type
        : [Exclude<T, T>] extends [never]
          ? true // Single literal string
          : false // Union of strings
      : false
    : false;

export type {
  RemoveCommonPrefix,
  SingleKeyWithSingleOccurrence,
  IsSingleString,
};
