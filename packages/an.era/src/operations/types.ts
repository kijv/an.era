import type { PrettifyMany } from '../types';

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type DeepOptionalParentsChild<T> = T extends object
  ? DeepOptionalParents<T>
  : T;

export type DeepOptionalParents<T> =
  // Properties whose (transformed) child has *no* required keys → parent is optional
  {
    [K in keyof T as RequiredKeys<DeepOptionalParentsChild<T[K]>> extends never
      ? K
      : never]?: DeepOptionalParentsChild<T[K]>;
  } &
    // Properties whose (transformed) child has *some* required keys → parent is required
    {
      [K in keyof T as RequiredKeys<
        DeepOptionalParentsChild<T[K]>
      > extends never
        ? never
        : K]-?: DeepOptionalParentsChild<T[K]>;
    };

export type OptionalProperty<T, K extends keyof T, V extends keyof T[K]> =
  // keep all other top-level properties as-is
  Omit<T, K> & {
    // for the chosen top-level property K:
    [P in K]: Omit<T[P], V> & // keep all nested properties except V required
      // make nested property V optional
      Partial<Pick<T[P], V>>;
  };

export type HasRequiredKeys<T> = RequiredKeys<T> extends never ? false : true;

export type OptionalPropertyForFirstArgumentOfFunction<
  T extends (...args: any[]) => any,
  K extends keyof Parameters<T>[0],
  V extends keyof Parameters<T>[0][K],
> = (
  ...args: DeepOptionalParents<
    OptionalProperty<Parameters<T>[0], K, V>
  > extends infer A
    ? A extends object
      ? HasRequiredKeys<A> extends false
        ? // all properties of A are optional → make the whole arg optional
          [
            arg?: PrettifyMany<A>,
            ...rest: Parameters<T> extends [any, ...infer R] ? R : [],
          ]
        : // some required properties remain → arg required
          [
            arg: PrettifyMany<A>,
            ...rest: Parameters<T> extends [any, ...infer R] ? R : [],
          ]
      : // non-object first arg → keep it required
        [
          arg: PrettifyMany<A>,
          ...rest: Parameters<T> extends [any, ...infer R] ? R : [],
        ]
    : never
) => ReturnType<T>;
