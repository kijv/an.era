import * as defaultGroupedPaths from '../openapi/paths';
import * as o from '../openapi';
import * as v from 'valibot';
import type { Api, GroupedPaths, Path } from './declaration';
import { findKeyWithSingleOccurrence, removeCommonPrefix } from '../util';
import formUrlencoded from 'form-urlencoded';
import { getPathsFromOpenApi } from '../openapi/runtime';

const getMethodArgKind = (method: Path): 'body' | 'query' | null =>
  'query' in method.parameters
    ? 'query'
    : method.body != null && 'content' in method.body
      ? 'body'
      : null;

export const createApi = <
  O extends any,
  C extends {
    accessToken?: string;
    baseUrl?: (typeof o.SERVERS)[number]['url'];
    openApi?: O;
  } & RequestInit = {},
  P extends GroupedPaths = typeof import('../openapi/paths'),
>(
  options?: C,
): C['openApi'] extends {} ? Promise<Api<P>> : Api<P> => {
  const {
    accessToken,
    baseUrl = 'https://api.are.na',
    openApi,
    ...init
  } = options ?? {};

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

  if (accessToken && 'headers' in init) {
    init.headers ??= {};
    init.headers = new Headers(init.headers);
    init.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const fetch = createFetch(new URL(baseUrl!), init);

  const groupedPaths =
    openApi != null ? getPathsFromOpenApi(openApi) : defaultGroupedPaths;

  return Object.fromEntries(
    Object.entries(groupedPaths).map(([group, value]) => {
      const singleKey = findKeyWithSingleOccurrence(value, '$parameters');

      const makeMethod = (method: Path) => {
        const argKind = getMethodArgKind(method);
        const localFetch = (
          init: RequestInit = {},
          modifyUrl: (url: URL) => URL = (u) => u,
        ) =>
          fetch(
            method.path,
            Object.assign(
              {},
              {
                method: method.method,
              },
              init ?? {},
            ),
            modifyUrl ?? ((u) => u),
          );

        return async (arg: Record<string, any> | undefined) => {
          const res = await localFetch(
            argKind === 'body' && arg != null
              ? (() => {
                  const content = method.body?.content;

                  let contentType: string | undefined;
                  let body: any;

                  for (const media in content) {
                    const schema = content[media];
                    if (schema == null) continue;
                    const maybeBody = v.safeParse(schema, arg);
                    if (maybeBody.success) {
                      contentType = media;
                      body = maybeBody.output;
                    }
                  }

                  if (!contentType) return {};

                  return {
                    headers: {
                      'Content-Type': contentType,
                    },
                    body: contentType.endsWith('x-www-form-urlencoded')
                      ? formUrlencoded(body)
                      : body,
                  };
                })()
              : undefined,
            argKind === 'query' && arg != null
              ? (() => {
                  const nextQuery = Object.fromEntries(
                    Object.entries(arg).map(([key, value]) => [
                      key,
                      method.parameters['query']?.[key]
                        ? v.parse(method.parameters['query']?.[key], value)
                        : value,
                    ]),
                  );

                  return (u) => {
                    for (const key in nextQuery) {
                      const value = nextQuery[key];
                      if (value == null) continue;
                      u.searchParams.set(key, value);
                    }
                    return u;
                  };
                })()
              : undefined,
          );

          const statusCodeResponseData = method.responses[res.status] ?? {};
          const contentTypeResponseData = res.headers.has('content-type')
            ? statusCodeResponseData?.[
                res.headers.get('content-type')?.split(';').at(0)!
              ]
            : null;

          const media = Object.keys(statusCodeResponseData);
          const result = await (media.includes('application/json')
            ? res.json()
            : res.text());

          return contentTypeResponseData != null
            ? v.parse(contentTypeResponseData, result)
            : result;
        };
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
  ) as unknown as Api<P>;
};
