import type * as v from 'valibot';

type ValiSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

export type FakeValiSchema = {
  __TYPE__: {};
};

export type MaybeValiSchema = ValiSchema | FakeValiSchema;

export type ValiSchemaInferInput<T extends MaybeValiSchema> =
  T extends FakeValiSchema
    ? T['__TYPE__']
    : T extends ValiSchema
      ? v.InferInput<T>
      : T;

export type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type PrettifyTuple<T> = T extends [infer First, ...infer Rest]
  ? [Prettify<First>, ...PrettifyTuple<Rest>]
  : [];

type UnionToTuple<T> =
  UnionToIntersection<T extends any ? (t: T) => T : never> extends (
    _: any,
  ) => infer W
    ? [...UnionToTuple<Exclude<T, W>>, W]
    : [];

type IsEqual<T, U> =
  (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2
    ? true
    : false;

type FilterDuplicates<
  Tuple extends any[],
  Acc extends any[] = [],
> = Tuple extends [infer First, ...infer Rest]
  ? First extends Acc[number]
    ? IsEqual<First, Acc[number]> extends true
      ? FilterDuplicates<Rest, Acc>
      : FilterDuplicates<Rest, [...Acc, First]>
    : FilterDuplicates<Rest, [...Acc, First]>
  : Acc;

type TupleToUnion<T extends any[]> = T[number];

export type UniqueUnion<T> = TupleToUnion<FilterDuplicates<UnionToTuple<T>>>;

export type MapUniqueUnion<T extends any[]> = T extends [
  infer First,
  ...infer Rest,
]
  ? [UniqueUnion<First>, ...MapUniqueUnion<Rest>]
  : [];

type HasAllOptionalProps<T> = [T] extends [never]
  ? false
  : T extends object
    ? keyof T extends never
      ? true // empty object
      : {} extends T
        ? true
        : false
    : false;

export type MakeTrailingOptional<T extends unknown[]> = T extends []
  ? []
  : T extends [...infer Init, infer Last]
    ? HasAllOptionalProps<Last> extends true
      ? [...MakeTrailingOptional<Init>, Last?]
      : T
    : T;

export type MapSchemaTupleToInput<T extends MaybeValiSchema[]> = T extends [
  infer First extends MaybeValiSchema,
  ...infer Rest extends MaybeValiSchema[],
]
  ? Rest extends []
    ? [ValiSchemaInferInput<First>]
    : [ValiSchemaInferInput<First>, ...MapSchemaTupleToInput<Rest>]
  : [];

type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type LastOfUnion<T> =
  UnionToIntersection<T extends unknown ? () => T : never> extends () => infer R
    ? R
    : never;

export type ObjectValuesToTuple<O, K = keyof O, Acc extends unknown[] = []> = [
  K,
] extends [never]
  ? Acc
  : LastOfUnion<K> extends infer L
    ? L extends keyof O
      ? ObjectValuesToTuple<O, Exclude<K, L>, [O[L], ...Acc]>
      : Acc
    : never;
