import * as openApiOperations from '@/openapi/operations';
import * as v from 'valibot';
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
  ObjectValuesToTuple,
  Prettify,
  PrettifyTuple,
  ValiSchema,
} from '@/declaration';
import { type Operation, routeOperations } from './operations';
import {
  createExpandTemplatePath,
  createFetch,
  parseParameters,
  parseResponseBody,
} from './util';
import type { MapResponseToUnion } from './declaration';
import type { SERVERS } from '@/openapi';
import contentTypeParser from 'fast-content-type-parse';
// import { LinksSchema } from '@/openapi/components/schemas';
//
type DefaultOperations = typeof openApiOperations.operations;

export interface ApiOptions<TOperations extends Record<string, Operation>> {
  baseUrl?: (typeof SERVERS)[number]['url'];
  requestInit?: RequestInit;
  accessToken?: string;
  // useHateoas?: boolean;
  operations?: TOperations;
  ignoreValidation?: boolean;
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
  TParams extends Record<string, ValiSchema>,
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

export const createApi = <
  const TOperations extends Record<string, Operation> = DefaultOperations,
>({
  baseUrl = 'https://api.are.na',
  requestInit = {},
  accessToken,
  // useHateoas = false,
  operations = openApiOperations.operations as unknown as TOperations,
  ignoreValidation = false,
}: ApiOptions<TOperations> = {}): CreateApiReturn<TOperations> => {
  if (accessToken) {
    requestInit.headers ??= {};
    requestInit.headers = new Headers(requestInit.headers);
    requestInit.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const f = createFetch(new URL(baseUrl), requestInit);

  const pathnameCache = new Map<string, string>();
  const expandTemplatePath = createExpandTemplatePath(pathnameCache);

  const routedOperations = routeOperations(
    operations,
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
      const statusCode = response.status.toString();
      const rawContentType = response.headers.get('content-type');
      const mimeType =
        typeof rawContentType === 'string'
          ? contentTypeParser.safeParse(rawContentType).type
          : '';

      const body = await parseResponseBody(response, mimeType);

      const result = !ignoreValidation
        ? (async () => {
            const statusSchemas =
              operation.response[statusCode] ?? operation.response['default'];

            if (!statusSchemas) {
              throw new Error(
                `No response schema defined for status ${statusCode} in operation ${operation.method.toUpperCase()} ${operation.path}`,
              );
            }

            const schema = statusSchemas[mimeType];

            if (!schema) {
              throw new Error(
                `No response schema found for media "${mimeType}" in operation ${operation.method.toUpperCase()} ${operation.path}`,
              );
            }

            return v
              .parseAsync(schema, body, {
                abortEarly: true,
              })
              .catch((e) => (v.isValiError(e) ? v.summarize(e.issues) : e));
          })()
        : body;

      // if (useHateoas && result != null && typeof result === "object" && "_links" in result && v.is(LinksSchema, result._links)) {
      //   const hateos = result._links;
      // }

      return result;
    },
  );
  const transformedOperations = transformOperations(operations);

  return Object.fromEntries(
    Object.entries(transformedOperations).map(([k, v]) => [
      k,
      (...args: any[]) => {
        const parameters = !ignoreValidation
          ? parseParameters(v.parameters, args)
          : args;

        return 'operations' in v
          ? Object.fromEntries(
              Object.entries(v.operations).map(([opk, opv]) => [
                opk,
                (...args1: any[]) =>
                  routedOperations[opv.id](
                    ...parameters.concat(
                      !ignoreValidation
                        ? parseParameters(opv.parameters, args1)
                        : args,
                    ),
                  ),
              ]),
            )
          : routedOperations[v.id]!(...parameters);
      },
    ]),
  ) as CreateApiReturn<TOperations>;
};
