import * as groupedPaths from '../openapi/paths';
import * as o from '../openapi';
import type { Api, Path } from './declaration';
import { findKeyWithSingleOccurrence, removeCommonPrefix } from '../util';
import * as v from 'valibot';

export const createApi = (
  {
    accessToken,
    baseUrl,
    ...init
  }: {
    accessToken?: string;
    baseUrl?: (typeof o.SERVERS)[number]['url'];
  } & RequestInit = {
    baseUrl: 'https://api.are.na',
  },
) => {
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

  if (accessToken) {
    init.headers ??= {};
    init.headers = new Headers(init.headers);
    init.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const fetch = createFetch(new URL(baseUrl!), init);

  return Object.fromEntries(
    Object.entries(groupedPaths).map(([group, value]) => {
      const singleKey = findKeyWithSingleOccurrence(value, '$parameters');

      const makeMethod =
        (data: Path) => async (query?: Record<string, any>) => {
          const nextQuery =
            query != null
              ? Object.fromEntries(
                  Object.entries(query).map(([key, value]) => [
                    key,
                    data.parameters['query']?.[key]
                      ? v.parse(data.parameters['query']?.[key], value)
                      : value,
                  ]),
                )
              : null;
          const res = await fetch(
            data.path,
            {
              method: data.method,
            },
            nextQuery != null && Object.keys(nextQuery).length > 0
              ? (u) => {
                  for (const key in nextQuery) {
                    const value = nextQuery[key];
                    if (value == null) continue;
                    u.searchParams.set(key, value);
                  }
                  return u;
                }
              : undefined,
          );

          const media = Object.keys(data.responses[res.status] ?? {});

          return media.includes('application/json') ? res.json() : res.text();
        };

      const makeMethods = (
        value: object,
        parameters: {
          path?: Record<string, string>;
          query?: Record<string, string>;
        } = {
          path: {},
          query: {},
        },
      ) => {
        const replacePathPart = Object.fromEntries(
          Object.entries(parameters.path ?? {}).map(([key, value]) => [
            `{${key}}`,
            value,
          ]),
        );

        return Object.fromEntries(
          Object.entries(
            Object.keys(value).length > 1
              ? removeCommonPrefix(value, 'self')
              : value,
          ).map(([key, value]) => [
            key,
            makeMethod(
              Object.assign({}, value, {
                path: value.path
                  .split('/')
                  .map((p) => replacePathPart[p] ?? p)
                  .join('/'),
              }),
            ),
          ]),
        );
      };

      return [
        group.toLowerCase(),
        singleKey
          ? Object.assign(
              (param: any) => {
                const { $parameters, ...methods } =
                  groupedPaths[group as keyof typeof groupedPaths][singleKey];

                return makeMethods(methods, {
                  path: {
                    [`${Object.keys($parameters).at(0)}`]: `${param}`,
                  },
                });
              },
              makeMethods(
                Object.fromEntries(
                  Object.entries(value).filter(([key]) => key !== singleKey),
                ),
              ),
            )
          : (() => {
                const keys = Object.keys(value);
                return (
                  keys.length === 1 &&
                  keys.map((k) => k.toLowerCase()).includes(group.toLowerCase())
                );
              })()
            ? makeMethod(value[group.toLowerCase()])
            : makeMethods(value),
      ];
    }),
  ) as unknown as Api;
};
