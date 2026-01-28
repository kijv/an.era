import * as o from './openapi';
import * as v from 'valibot';
import { type CreateEndpointsOptions, createEndpoints } from './endpoints';
import { operations } from './openapi/paths';

export type * from './openapi/components/schemas';

const createFetch =
  (baseUrl: URL, baseInit?: RequestInit) =>
  (
    url: string | URL,
    init: RequestInit = {},
    modifyUrl: (url: URL) => URL = (u) => u,
  ) =>
    global.fetch(
      modifyUrl(new URL(url.toString(), baseUrl)),
      Object.assign({}, baseInit, init),
    );

export const createArena = (
  options: {
    accessToken?: string;
    baseUrl?: (typeof o.SERVERS)[number]['url'];
  } & CreateEndpointsOptions &
    RequestInit = {},
) => {
  const {
    accessToken,
    baseUrl = 'https://api.are.na',
    ignoreMissingSchema,
    disableParsing,
    ...init
  } = options ?? {};

  if (accessToken && 'headers' in init) {
    init.headers ??= {};
    init.headers = new Headers(init.headers);
    init.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const next = createFetch(new URL(baseUrl!), init);

  return createEndpoints(
    operations,
    (operation, params) => {
      const pathname =
        'path' in params &&
        typeof params.path === 'object' &&
        v.is(v.record(v.string(), v.unknown()), params.path)
          ? operation.path
              .split('/')
              .map((part) => {
                if (/{.*}/.test(part)) {
                  const resolved: unknown = (
                    params.path as Record<string, unknown>
                  )[part.slice(1, part.length - 1)];
                  if (resolved != null) return String(resolved);
                }

                return part;
              })
              .join('/')
          : operation.path;

      return next(
        pathname,
        {},
        'query' in params
          ? (url) => {
              const queryParams = params.query;
              if (v.is(v.record(v.string(), v.unknown()), queryParams)) {
                for (const key in queryParams) {
                  const value = queryParams[key];
                  url.searchParams.set(
                    key,
                    typeof value !== 'string' ? String(value) : value,
                  );
                }
              }

              return url;
            }
          : undefined,
      );
    },
    {
      ignoreMissingSchema,
      disableParsing,
    },
  );
};