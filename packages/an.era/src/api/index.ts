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
import type { MapResponseToUnion } from './declaration';
import type { SERVERS } from '@/openapi';
import contentTypeParser from 'fast-content-type-parse';
import { operations as defaultOperations } from '@/openapi/operations';
import { getValibot } from '@/util';

type DefaultOperations = typeof defaultOperations;

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

/** Find a key in obj that matches prop when compared case-insensitively. */
function getKeyIgnoreCase(obj: object, prop: string): string | undefined {
  const lower = prop.toLowerCase();
  for (const k of Reflect.ownKeys(obj)) {
    if (typeof k === 'string' && k.toLowerCase() === lower) return k;
  }
  return undefined;
}

/** Proxy that makes tag-level access case-insensitive using Reflect. */
function caseInsensitiveTagProxy<T extends Record<string, unknown>>(
  target: T,
): T {
  return new Proxy(target, {
    get(target, prop, receiver) {
      if (typeof prop === 'string') {
        if (Reflect.has(target, prop))
          return Reflect.get(target, prop, receiver);
        const key = getKeyIgnoreCase(target, prop);
        if (key !== undefined) return Reflect.get(target, key, receiver);
      }
      return Reflect.get(target, prop, receiver);
    },
    has(target, prop) {
      if (typeof prop === 'string') {
        const key = getKeyIgnoreCase(target, prop);
        if (key !== undefined) return true;
      }
      return Reflect.has(target, prop);
    },
    getOwnPropertyDescriptor(target, prop) {
      if (typeof prop === 'string') {
        const key = getKeyIgnoreCase(target, prop);
        if (key !== undefined)
          return Reflect.getOwnPropertyDescriptor(target, key);
      }
      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
    ownKeys(target) {
      return Reflect.ownKeys(target);
    },
  }) as T;
}

/** Per-tag group: each key is either a term (GroupedOperation) or processed key (TransformedOperation) */
type CreateApiReturn<TOperations extends Record<string, Operation>> = {
  [Tag in keyof TransformOperations<TOperations>]: {
    [K in keyof TransformOperations<TOperations>[Tag]]: TransformOperations<TOperations>[Tag][K] extends GroupedOperation<
      infer TParams,
      infer TOps
    >
      ? TOps extends Record<string, TransformedOperation>
        ? GroupedOperationFn<TParams, TOps>
        : never
      : TransformOperations<TOperations>[Tag][K] extends TransformedOperation
        ? OperationFn<TransformOperations<TOperations>[Tag][K]>
        : never;
  };
};

export const createApi = <
  const TOperations extends Record<string, Operation> = DefaultOperations,
  const TPlain extends boolean = false,
>({
  baseUrl = 'https://api.are.na',
  requestInit = {},
  accessToken,
  operations = defaultOperations as unknown as TOperations,
  ignoreValidation = false,
  plain,
}: ApiOptions<TOperations, TPlain> = {}): TPlain extends true
  ? { [K in keyof TOperations]: OperationFunction<TOperations[K]> }
  : CreateApiReturn<TOperations> => {
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

      if (statusSchemas != null && Object.keys(statusSchemas).length === 0)
        return body;

      if (!statusSchemas) {
        throw new Error(
          `No response schema defined for status ${statusCode} in operation ${operation.method.toUpperCase()} ${operation.path}`,
        );
      }

      const schema =
        (statusSchemas[mimeType] as ValiSchema | undefined) ??
        (statusSchemas['application/json'] as ValiSchema | undefined);

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

  const transformedOperations = transformOperations(operations);

  type TransformedEntry =
    | GroupedOperation<
        Record<string, MaybeValiSchema>,
        Record<string, TransformedOperation>
      >
    | TransformedOperation;

  const mapEntryToFn =
    (v: TransformedEntry) =>
    (...args: any[]) => {
      const parameters = !ignoreValidation
        ? parseParameters(v.parameters, args)
        : args;

      return 'operations' in v
        ? Object.fromEntries(
            (
              Object.entries(v.operations) as [string, TransformedOperation][]
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
    };

  const tagGrouped = Object.fromEntries(
    (
      Object.entries(transformedOperations) as [
        string,
        Record<string, TransformedEntry>,
      ][]
    ).map(([tag, tagGroup]) => [
      tag,
      Object.fromEntries(
        (Object.entries(tagGroup) as [string, TransformedEntry][]).map(
          ([k, v]) => [k, mapEntryToFn(v)],
        ),
      ),
    ]),
  );
  return caseInsensitiveTagProxy(tagGrouped) as Return;
};
