import type * as paths from '../openapi/paths';
import type * as v from 'valibot';
import type {
  IsSingleString,
  RemoveCommonPrefix,
  SingleKeyWithSingleOccurrence,
} from '../declaration';

type LowercaseKeys<T> = {
  [K in keyof T as Lowercase<K & string>]: T[K];
};

type LowercasePaths = LowercaseKeys<typeof paths>;

export type Parameters = Record<string, ValibotSchema>;

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
    ? v.InferOutput<T[K]> extends infer U
      ? null extends U
        ? K
        : undefined extends U
          ? K
          : never
      : never
    : never;
}[keyof T] extends infer OptionalKeys
  ? {
      [K in keyof T as K extends OptionalKeys ? never : K]: v.InferOutput<T[K]>;
    } & {
      [K in keyof T as K extends OptionalKeys ? K : never]?: v.InferOutput<
        T[K]
      >;
    }
  : never;

type Body<T extends Path['body']> = T extends RequiredBody
  ? T['content'] extends Record<string, ValibotSchema>
    ? T['content'][keyof T['content']] extends ValibotSchema
      ? v.InferOutput<T['content'][keyof T['content']]> extends infer U
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
        ? v.InferOutput<T['content'][keyof T['content']]> extends infer U
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

export type Api = {
  [K in keyof LowercasePaths]: IsSingleString<
    SingleKeyWithSingleOccurrence<LowercasePaths[K], '$parameters'>
  > extends true
    ? ((
        param: v.InferOutput<
          LowercasePaths[K][SingleKeyWithSingleOccurrence<
            LowercasePaths[K],
            '$parameters'
          >]['$parameters'] extends Record<
            SingleKeyWithSingleOccurrence<LowercasePaths[K], '$parameters'>,
            any
          >
            ? LowercasePaths[K][SingleKeyWithSingleOccurrence<
                LowercasePaths[K],
                '$parameters'
              >]['$parameters'][SingleKeyWithSingleOccurrence<
                LowercasePaths[K],
                '$parameters'
              >]
            : never
        >,
      ) => {
        [L in keyof RemoveCommonPrefix<
          Omit<
            LowercasePaths[K][SingleKeyWithSingleOccurrence<
              LowercasePaths[K],
              '$parameters'
            >],
            '$parameters'
          >,
          'self'
        >]: RemoveCommonPrefix<
          Omit<
            LowercasePaths[K][SingleKeyWithSingleOccurrence<
              LowercasePaths[K],
              '$parameters'
            >],
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
          LowercasePaths[K],
          SingleKeyWithSingleOccurrence<LowercasePaths[K], '$parameters'>
        >]: Method<
          Omit<
            LowercasePaths[K],
            SingleKeyWithSingleOccurrence<LowercasePaths[K], '$parameters'>
          >[L]
        >;
      }
    : [keyof LowercasePaths[K]] extends [K]
      ? Method<LowercasePaths[K][K]>
      : {
          [L in keyof RemoveCommonPrefix<LowercasePaths[K]>]: Method<
            RemoveCommonPrefix<LowercasePaths[K]>[L]
          >;
        };
};
