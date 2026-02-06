import {
  type GroupedOperation,
  type TransformOperations,
  type TransformedOperation,
  transformOperations,
} from './operations/group';
import type {
  MakeTrailingOptional,
  MapSchemaTupleToInput,
  MapUniqueUnion,
  MaybeValiSchema,
  ObjectValuesToTuple,
  Prettify,
  PrettifyTuple,
  ValiSchema,
} from '@/declaration';
import {
  type Operation,
  type OperationFunction,
  routeOperations,
} from './operations';
import {
  createExpandTemplatePath,
  createFetch,
  parseParameters,
  parseResponseBody,
} from './util';
import { getDefaultOperations, getValibot } from '@/util';
import type { MapResponseToUnion } from './declaration';
import type { SERVERS } from '@/openapi';
import contentTypeParser from 'fast-content-type-parse';
//
type DefaultOperations =
  /* oxlint-disable consistent-type-imports */ typeof import('@/openapi/operations').operations;

export interface ApiOptions<
  TOperations extends Record<string, Operation>,
  TPlain extends boolean,
> {
  baseUrl?: (typeof SERVERS)[number]['url'];
  requestInit?: RequestInit;
  accessToken?: string;
  operations?: TOperations;
  ignoreValidation?: boolean;
  plain?: TPlain;
}

type OperationFn<TOperation extends Operation> = (
  ...args: MakeTrailingOptional<
    PrettifyTuple<
      MapUniqueUnion<
        MapSchemaTupleToInput<ObjectValuesToTuple<TOperation['parameters']>>
      >
    >
  >
) => Promise<Prettify<MapResponseToUnion<TOperation['response']>>>;

type GroupedOperationFn<
  TParams extends Record<string, MaybeValiSchema>,
  TOps extends Record<string, TransformedOperation>,
> = (
  ...args: MakeTrailingOptional<
    PrettifyTuple<
      MapUniqueUnion<MapSchemaTupleToInput<ObjectValuesToTuple<TParams>>>
    >
  >
) => {
  [K in keyof TOps]: OperationFn<TOps[K]>;
};

type CreateApiReturn<TOperations extends Record<string, Operation>> = {
  [K in keyof TransformOperations<TOperations>]: TransformOperations<TOperations>[K] extends GroupedOperation<
    infer TParams,
    infer TOps
  >
    ? TOps extends Record<string, TransformedOperation>
      ? GroupedOperationFn<TParams, TOps>
      : never
    : TransformOperations<TOperations>[K] extends TransformedOperation
      ? OperationFn<TransformOperations<TOperations>[K]>
      : never;
};

export const createApi = async <
  const TOperations extends Record<string, Operation> = DefaultOperations,
  const TPlain extends boolean = false,
>({
  baseUrl = 'https://api.are.na',
  requestInit = {},
  accessToken,
  operations,
  ignoreValidation = false,
  plain,
}: ApiOptions<TOperations, TPlain> = {}): Promise<
  TPlain extends true
    ? {
        [K in keyof TOperations]: OperationFunction<TOperations[K]>;
      }
    : CreateApiReturn<TOperations>
> => {
  const resolvedOperations =
    (operations as TOperations | undefined) ??
    ((await getDefaultOperations()) as unknown as TOperations);

  type Return = TPlain extends true
    ? {
        [K in keyof TOperations]: OperationFunction<TOperations[K]>;
      }
    : CreateApiReturn<TOperations>;

  if (accessToken) {
    requestInit.headers ??= {};
    requestInit.headers = new Headers(requestInit.headers);
    requestInit.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const f = createFetch(new URL(baseUrl), requestInit);

  const pathnameCache = new Map<string, string>();
  const expandTemplatePath = createExpandTemplatePath(pathnameCache);

  const routedOperations = routeOperations(
    resolvedOperations,
    (data, params) => {
      const pathname = expandTemplatePath(
        data.path,
        typeof params.path === 'object' ? params.path : {},
      );

      const searchParams = Object.assign(
        {},
        params.query ?? {},
        params.formData ?? {},
      );

      return f(
        pathname,
        {
          method: data.method,
          body: 'body' in params ? JSON.stringify(params.body) : undefined,
          headers:
            data.method === 'post' || data.method === 'put'
              ? {
                  'Content-Type': 'application/json',
                }
              : undefined,
        },
        searchParams
          ? (url) => {
              if (typeof searchParams === 'object') {
                for (const key in searchParams) {
                  const value = (searchParams as Record<string, unknown>)[key];
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
    async (operation, response) => {
      const rawContentType = response.headers.get('content-type');
      const mimeType =
        typeof rawContentType === 'string'
          ? contentTypeParser.safeParse(rawContentType).type
          : '';

      const body = await parseResponseBody(response, mimeType);

      if (!ignoreValidation) return body;

      const statusCode = response.status.toString();

      const statusSchemas =
        operation.response[statusCode] ?? operation.response['default'];

      if (!statusSchemas) {
        throw new Error(
          `No response schema defined for status ${statusCode} in operation ${operation.method.toUpperCase()} ${operation.path}`,
        );
      }

      const schema = statusSchemas[mimeType] as ValiSchema | undefined;

      if (!schema) {
        throw new Error(
          `No response schema found for media "${mimeType}" in operation ${operation.method.toUpperCase()} ${operation.path}`,
        );
      }

      const v = await getValibot();

      return v
        .parseAsync(schema, body, {
          abortEarly: true,
        })
        .catch((e) => (v.isValiError(e) ? v.summarize(e.issues) : e));
    },
  );

  if (plain)
    return routedOperations satisfies {
      [K in keyof TOperations]: OperationFunction<TOperations[K]>;
    } as Return;

  const transformedOperations = transformOperations(resolvedOperations);

  type TransformedEntry =
    | GroupedOperation<
        Record<string, MaybeValiSchema>,
        Record<string, TransformedOperation>
      >
    | TransformedOperation;

  return Object.fromEntries(
    (Object.entries(transformedOperations) as [string, TransformedEntry][]).map(
      ([k, v]) => [
        k,
        (...args: any[]) => {
          const parameters = !ignoreValidation
            ? parseParameters(v.parameters, args)
            : args;

          return 'operations' in v
            ? Object.fromEntries(
                (
                  Object.entries(v.operations) as [
                    string,
                    TransformedOperation,
                  ][]
                ).map(([opk, opv]) => [
                  opk,
                  (...args: any[]) =>
                    routedOperations[opv.id]!(
                      ...(parameters.concat(
                        !ignoreValidation
                          ? parseParameters(opv.parameters, args)
                          : args,
                      ) as any),
                    ),
                ]),
              )
            : routedOperations[v.id]!(...(parameters as any));
        },
      ],
    ),
  ) as Return;
};
