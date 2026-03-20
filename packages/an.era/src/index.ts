import type * as openapi from './schema';
import type { ClientRequestOptions, Hono } from 'hono';
import { hc } from 'hono/client';

type RemoveUndefinedProps<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

type Responses<
  T extends {
    [statusCode: number]: {
      content: {
        [outputFormat: string]: unknown;
      };
    };
  },
  Extend extends {},
> = {
  [S in keyof T]: {
    // @ts-expect-error Object is valid
    [F in keyof T[S]['content']]: {
      // @ts-expect-error Ditto
      output: T[S]['content'][F];
      status: S;
      outputFormat: 'json';
    } & Extend;
    // @ts-expect-error Ditto
  }[keyof T[S]['content']];
}[keyof T];

type RequestBody<T extends { [inputFormat: string]: unknown }> = {
  [F in keyof T]: {
    [K in F extends 'application/x-www-form-urlencoded'
      ? 'form'
      : 'json']: T[F];
  };
}[keyof T];

type ReplaceParams<S extends string> =
  S extends `${infer Before}{${infer Param}}${infer After}`
    ? `${Before}:${Param}${ReplaceParams<After>}`
    : S;

type App = Hono<
  {},
  {
    [K in keyof openapi.paths as ReplaceParams<K>]: {
      [M in keyof RemoveUndefinedProps<
        Omit<openapi.paths[K], 'parameters'>
      > as `$${M}`]: Responses<
        // @ts-expect-error Object is valid
        openapi.paths[K][M]['responses'],
        {
          // @ts-expect-error Object is valid
          input: (openapi.paths[K][M]['requestBody'] extends {}
            ? // @ts-expect-error Object is valid
              RequestBody<openapi.paths[K][M]['requestBody']['content']>
            : {}) &
            // @ts-expect-error Object is valid
            (openapi.paths[K][M]['parameters']['path'] extends {}
              ? // @ts-expect-error Object is valid
                { param: openapi.paths[K][M]['parameters']['path'] }
              : {});
        }
      >;
    };
  }
>;

export type ArenaClientOptions = {
  baseUrl?: string;
};

export function arenaClient<Client extends Hono = App>(
  options: ArenaClientOptions & ClientRequestOptions = {},
) {
  const { baseUrl = 'https://api.are.na', ...clientRequestOptions } = options;

  return hc<Client>(baseUrl, clientRequestOptions);
}

export { parseResponse } from 'hono/client';
