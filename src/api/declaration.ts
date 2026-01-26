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

export type Path = {
  method: string;
  path: string;
  parameters: Record<string, Parameters>;
  responses: Record<string, Record<string, ValibotSchema>>;
};

type CollectResponseSchemas<T extends Path['responses']> = {
  [K in keyof T]: T[K] extends Record<string, ValibotSchema>
    ? T[K][keyof T[K]]
    : never;
}[keyof T];
/*
export type Api = {
  [K in keyof LowercasePaths]: {
    [L in keyof LowercasePaths[K]]: LowercasePaths[K][L] extends Path
      ? () => Promise<{}>
      : LowercasePaths[K][L] extends Record<string, Path | Parameters>
        ? (
            param: v.InferOutput<
              LowercasePaths[K][L]["$parameters"] extends Record<L, any>
                ? LowercasePaths[K][L]["$parameters"][L]
                : never
            >,
          ) => Promise<{
            [M in keyof RemoveCommonPrefix<
              Omit<LowercasePaths[K][L], "$parameters">,
              "self"
            >]: RemoveCommonPrefix<
              Omit<LowercasePaths[K][L], "$parameters">,
              "self"
            >[M] extends Path
              ? (query?: {
                  [N in keyof RemoveCommonPrefix<
                    Omit<LowercasePaths[K][L], "$parameters">,
                    "self"
                  >[M]["parameters"]["query"]]: v.InferOutput<
                    RemoveCommonPrefix<
                      Omit<LowercasePaths[K][L], "$parameters">,
                      "self"
                    >[M]["parameters"]["query"][N]
                  >;
                }) => Promise<{}>
              : never;
          }>
        : never;
  };
};*/

type Query<T extends Path['parameters']['query']> = {
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

type IsEmptyObject<T> = T extends Record<string, never> ? true : false;

type MakeMethod<T extends Path> =
  v.InferOutput<CollectResponseSchemas<T['responses']>> extends infer R
    ? IsEmptyObject<Query<T['parameters']['query']>> extends true
      ? () => Promise<R>
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
            ? MakeMethod<P>
            : never
          : never;
      }) & {
        [L in keyof Omit<
          LowercasePaths[K],
          SingleKeyWithSingleOccurrence<LowercasePaths[K], '$parameters'>
        >]: MakeMethod<
          Omit<
            LowercasePaths[K],
            SingleKeyWithSingleOccurrence<LowercasePaths[K], '$parameters'>
          >[L]
        >;
      }
    : [keyof LowercasePaths[K]] extends [K]
      ? MakeMethod<LowercasePaths[K][K]>
      : {
          [L in keyof RemoveCommonPrefix<LowercasePaths[K]>]: MakeMethod<
            RemoveCommonPrefix<LowercasePaths[K]>[L]
          >;
        };
};
