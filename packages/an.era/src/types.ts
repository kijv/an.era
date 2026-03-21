export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type PrettifyMany<T> = {
  [K in keyof T]: Prettify<T[K]>;
} & {};
