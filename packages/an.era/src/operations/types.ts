import type { PrettifyMany } from '../types';

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type DeepOptionalParentsChild<T> = T extends object
  ? DeepOptionalParents<T>
  : T;

/**
 * Inner implementation: do not use on union `T` — `keyof T` would be the
 * intersection of keys across members and would drop properties.
 */
type DeepOptionalParentsImpl<T extends object> =
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

/**
 * Apply `DeepOptionalParentsImpl` per union member so keys that only exist on
 * some members (e.g. `json` on one endpoint but not another) are preserved.
 */
export type DeepOptionalParents<T> = T extends object
  ? T extends any
    ? DeepOptionalParentsImpl<Extract<T, object>>
    : never
  : T;

/**
 * Make `T[K][V]` optional without losing keys when `T` is a union (e.g.
 * `Parameters<FnUnion>[0]`): distribute over each member of `T`.
 */
export type OptionalProperty<
  T,
  K extends PropertyKey,
  V extends PropertyKey,
> = T extends any
  ? K extends keyof T
    ? V extends keyof T[K]
      ? Omit<T, K> & {
          [P in K]: Omit<T[K], V> & Partial<Pick<T[K], V>>;
        }
      : T
    : T
  : never;

export type HasRequiredKeys<T> = RequiredKeys<T> extends never ? false : true;

export type OptionalPropertyForFirstArgumentOfFunction<
  T extends (...args: any[]) => any,
<<<<<<< HEAD
  K extends PropertyKey,
  V extends PropertyKey,
=======
  K extends keyof Parameters<T>[0],
  V extends keyof Parameters<T>[0][K],
>>>>>>> main
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
