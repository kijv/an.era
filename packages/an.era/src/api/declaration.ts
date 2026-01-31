import type { MaybeValiSchema, ValiSchemaInferInput } from '@/declaration';

export type Fetcher<TData> = (
  data: TData,
  params: Record<string, unknown>,
) => Promise<Response>;

export type MapResponseToUnion<T> = {
  [K in keyof T]: {
    [M in keyof T[K]]: T[K][M] extends MaybeValiSchema
      ? ValiSchemaInferInput<T[K][M]>
      : never;
  }[keyof T[K]];
}[keyof T];
