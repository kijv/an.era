import type { Fetcher, MapResponseToUnion } from '@/api/declaration';
import type {
  MakeTrailingOptional,
  MapSchemaTupleToInput,
  MapUniqueUnion,
  ObjectValuesToTuple,
  Prettify,
  PrettifyTuple,
  ValiSchema,
  ValiSchemaWithType,
} from '@/declaration';
import contentTypeParser from 'fast-content-type-parse';
import { parseResponseBody } from '@/api/util';

export type Operation = {
  path: string;
  method:
    | 'delete'
    | 'get'
    | 'head'
    | 'options'
    | 'patch'
    | 'post'
    | 'put'
    | 'trace';
  tags: readonly string[];
  parameters: Record<string, ValiSchema | ValiSchemaWithType>;
  response: Record<string, Record<string, ValiSchema | ValiSchemaWithType>>;
};

type OperationFunction<TOperation extends Operation> = (
  ...args: MakeTrailingOptional<
    PrettifyTuple<
      MapUniqueUnion<
        MapSchemaTupleToInput<ObjectValuesToTuple<TOperation['parameters']>>
      >
    >
  >
) => Promise<Prettify<MapResponseToUnion<TOperation['response']>>>;

export const routeOperations = <TOperations extends Record<string, Operation>>(
  operations: TOperations,
  fetcher: Fetcher<Operation>,
  parseResBody: (operation: Operation, response: Response) => unknown = (
    _operation,
    response,
  ) => {
    const rawContentType = response.headers.get('content-type');
    const mimeType =
      typeof rawContentType === 'string'
        ? contentTypeParser.safeParse(rawContentType).type
        : '';
    return parseResponseBody(response, mimeType);
  },
): {
  [K in keyof TOperations]: OperationFunction<TOperations[K]>;
} => {
  return Object.fromEntries(
    Object.entries(operations).map(([name, operation]) => [
      name,
      async (...args: unknown[]) => {
        const params = Object.fromEntries(
          Object.keys(operation.parameters).map((key, i) => [key, args[i]]),
        );
        const response = await fetcher(operation, params);
        return parseResBody(operation, response);
      },
    ]),
  ) as unknown as {
    [K in keyof typeof operations]: OperationFunction<(typeof operations)[K]>;
  };
};
