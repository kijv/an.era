import type * as v from 'valibot';
import type {
  IsSingleString,
  RemoveCommonPrefix,
  SingleKeyWithSingleOccurrence,
} from '../declaration';

type LowercaseKeys<T> = {
  [K in keyof T as Lowercase<K & string>]: T[K];
};

export type Parameters = Record<string, ValibotSchema>;

export type GroupedPaths = Record<
  string,
  Record<string, Path | Record<string, Path | Parameters>>
>;

type ValibotSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

type BodyContent = Record<string, ValibotSchema>;
type RequiredBody = {
  required: boolean;
  content: BodyContent;
};
type OptionalBody = {
  required: boolean;
  content?: BodyContent;
};

export type Path = {
  method: string;
  path: string;
  parameters: Record<string, Parameters>;
  responses: Record<string, Record<string, ValibotSchema>>;
  body?: OptionalBody | RequiredBody;
};

type CollectResponseSchemas<
  T extends Record<string, Record<string, ValibotSchema>>,
> = {
  [K in keyof T]: T[K] extends Record<string, ValibotSchema>
    ? T[K][keyof T[K]]
    : never;
}[keyof T];

type Query<T extends Record<string, ValibotSchema>> = {
  [K in keyof T]: T[K] extends ValibotSchema
    ? v.InferInput<T[K]> extends infer U
      ? null extends U
        ? K
        : undefined extends U
          ? K
          : never
      : never
    : never;
}[keyof T] extends infer OptionalKeys
  ? {
      [K in keyof T as K extends OptionalKeys ? never : K]: v.InferInput<T[K]>;
    } & {
      [K in keyof T as K extends OptionalKeys ? K : never]?: v.InferInput<T[K]>;
    }
  : never;

type Body<T extends Path['body']> = T extends RequiredBody
  ? T['content'] extends Record<string, ValibotSchema>
    ? T['content'][keyof T['content']] extends ValibotSchema
      ? v.InferInput<T['content'][keyof T['content']]> extends infer U
        ? {
            [K in keyof U]: U[K] extends infer V
              ? null extends V
                ? K
                : undefined extends V
                  ? K
                  : never
              : never;
          }[keyof U] extends infer OptionalKeys
          ? {
              [K in keyof U as K extends OptionalKeys ? never : K]: U[K];
            } & {
              [K in keyof U as K extends OptionalKeys ? K : never]?: U[K];
            }
          : never
        : never
      : never
    : never
  : T extends OptionalBody
    ? T['content'] extends Record<string, ValibotSchema>
      ? T['content'][keyof T['content']] extends ValibotSchema
        ? v.InferInput<T['content'][keyof T['content']]> extends infer U
          ? {
              [K in keyof U]: U[K] extends infer V
                ? null extends V
                  ? K
                  : undefined extends V
                    ? K
                    : never
                : never;
            }[keyof U] extends infer OptionalKeys
            ? {
                [K in keyof U as K extends OptionalKeys ? never : K]: U[K];
              } & {
                [K in keyof U as K extends OptionalKeys ? K : never]?: U[K];
              }
            : never
          : never
        : never
      : never
    : never;

type IsEmptyObject<T> = T extends Record<string, never> ? true : false;

type Method<T extends Path> =
  v.InferOutput<CollectResponseSchemas<T['responses']>> extends infer R
    ? IsEmptyObject<Query<T['parameters']['query']>> extends true
      ? IsEmptyObject<Body<T['body']>> extends true
        ? () => Promise<R>
        : T['body'] extends RequiredBody
          ? (body: Body<T['body']>) => Promise<R>
          : (body?: Body<T['body']>) => Promise<R>
      : (query?: Query<T['parameters']['query']>) => Promise<R>
    : never;

export type Api<T extends GroupedPaths> =
  LowercaseKeys<T> extends infer P
    ? {
        [K in keyof P]: IsSingleString<
          SingleKeyWithSingleOccurrence<P[K], '$parameters'>
        > extends true
          ? ((
              param: v.InferOutput<
                P[K][SingleKeyWithSingleOccurrence<
                  P[K],
                  '$parameters'
                >]['$parameters'] extends Record<
                  SingleKeyWithSingleOccurrence<P[K], '$parameters'>,
                  any
                >
                  ? P[K][SingleKeyWithSingleOccurrence<
                      P[K],
                      '$parameters'
                    >]['$parameters'][SingleKeyWithSingleOccurrence<
                      P[K],
                      '$parameters'
                    >]
                  : never
              >,
            ) => {
              [L in keyof RemoveCommonPrefix<
                Omit<
                  P[K][SingleKeyWithSingleOccurrence<P[K], '$parameters'>],
                  '$parameters'
                >,
                'self'
              >]: RemoveCommonPrefix<
                Omit<
                  P[K][SingleKeyWithSingleOccurrence<P[K], '$parameters'>],
                  '$parameters'
                >,
                'self'
              >[L] extends infer P
                ? P extends Path
                  ? Method<P>
                  : never
                : never;
            }) & {
              [L in keyof Omit<
                P[K],
                SingleKeyWithSingleOccurrence<P[K], '$parameters'>
              >]: Method<
                Omit<
                  P[K],
                  SingleKeyWithSingleOccurrence<P[K], '$parameters'>
                >[L]
              >;
            }
          : [keyof P[K]] extends [K]
            ? Method<P[K][K]>
            : {
                [L in keyof RemoveCommonPrefix<P[K]>]: Method<
                  RemoveCommonPrefix<P[K]>[L]
                >;
              };
      }
    : never;
