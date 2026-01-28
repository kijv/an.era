import * as v from 'valibot';
import type {
  CreateEndpoints,
  Endpoint,
  GroupedEndpoint,
  HttpMethods,
  Operation,
  ValiSchema,
} from './declaration';
import contentTypeParser from 'fast-content-type-parse';

// Split camelCase string into terms
// e.g., "userProfile" -> ["user", "Profile"]
function splitCamelCase(str: string): string[] {
  const terms: string[] = [];
  let currentTerm = '';

  for (const char of str) {
    const isUppercase =
      char === char.toUpperCase() && char !== char.toLowerCase();

    if (isUppercase) {
      if (currentTerm) {
        terms.push(currentTerm);
      }
      currentTerm = char;
    } else {
      currentTerm += char;
    }
  }

  if (currentTerm) {
    terms.push(currentTerm);
  }

  return terms;
}

// Remove HTTP method prefix from operation key and lowercase first char
function getProcessedKey(key: string, method: HttpMethods): string {
  const methodUpper = method.toUpperCase();
  const keyUpper = key.slice(0, method.length).toUpperCase();

  if (keyUpper === methodUpper) {
    const rest = key.slice(method.length);
    return rest.charAt(0).toLowerCase() + rest.slice(1);
  }

  return key.charAt(0).toLowerCase() + key.slice(1);
}

// Get all terms from a processed key (lowercased)
function getAllTerms(processedKey: string): string[] {
  return splitCamelCase(processedKey).map((t) => t.toLowerCase());
}

// Check if operation has non-empty parameters
function hasNonEmptyParameters(op: Operation): boolean {
  return Object.keys(op.parameters).length > 0;
}

// Check if two tag arrays share at least one common tag
function tagsShareCommon(
  tags1: readonly string[],
  tags2: readonly string[],
): boolean {
  return tags1.some((t) => tags2.includes(t));
}

// Extract path up to and including the first path parameter (e.g., {id})
// "/v3/channels/{id}/contents" -> "/v3/channels/{id}"
// "/v3/channels" -> "/v3/channels"
function extractResourcePath(path: string): string {
  const segments = path.split('/');
  let result = '';

  for (const segment of segments) {
    if (segment.startsWith('{') && segment.endsWith('}')) {
      // Found a path param, include it and stop
      result += (result ? '/' : '') + segment;
      return result;
    }
    result += (result ? '/' : '') + segment;
  }

  // No path param found, return full path
  return result;
}

// Check if two paths share the same resource path prefix
function pathsShareResourcePrefix(path1: string, path2: string): boolean {
  return extractResourcePath(path1) === extractResourcePath(path2);
}

// Check if two operations share at least one parameter key
function sharesParameterKey(op1: Operation, op2: Operation): boolean {
  const keys1 = Object.keys(op1.parameters);
  const keys2 = Object.keys(op2.parameters);
  return keys1.some((k) => keys2.includes(k));
}

// Get the number of parameter keys in an operation
function getParamKeyCount(op: Operation): number {
  return Object.keys(op.parameters).length;
}

// Get all operations with the term, non-empty params, shared tag, and shared path prefix with currentOp
function getOpsWithTermAndSharedTag(
  operations: Record<string, Operation>,
  currentKey: string,
  term: string,
): Operation[] {
  const currentOp = operations[currentKey];
  if (!currentOp) return [];

  const result: Operation[] = [];

  for (const [key, op] of Object.entries(operations)) {
    if (!hasNonEmptyParameters(op)) continue;

    const processedKey = getProcessedKey(key, op.method);
    const terms = getAllTerms(processedKey);

    if (
      terms.includes(term) &&
      tagsShareCommon(currentOp.tags, op.tags) &&
      pathsShareResourcePrefix(currentOp.path, op.path)
    ) {
      result.push(op);
    }
  }

  return result;
}

// Check if an operation can be grouped: it must share a parameter key with ALL
// operations that have more parameters than it (among ops with same term and tag)
// This matches the type-level logic in declaration.ts
function hasSharedTagWithSameTermOp(
  operations: Record<string, Operation>,
  currentKey: string,
  term: string,
): boolean {
  const currentOp = operations[currentKey];
  if (!currentOp) return false;

  // Get all operations with the term and shared tag (including current)
  const allOps = getOpsWithTermAndSharedTag(operations, currentKey, term);

  // Get operations OTHER than current
  const otherOps = allOps.filter((op) => op !== currentOp);

  // Must have at least one other operation
  if (otherOps.length === 0) return false;

  const currentParamCount = getParamKeyCount(currentOp);

  // Get operations with MORE params than current
  const opsWithMoreParams = otherOps.filter(
    (op) => getParamKeyCount(op) > currentParamCount,
  );

  // If no operations have more params, current has the most - just needs other ops to exist
  if (opsWithMoreParams.length === 0) {
    return true;
  }

  // Current must share at least one param key with ALL operations that have more params
  for (const op of opsWithMoreParams) {
    if (!sharesParameterKey(currentOp, op)) {
      return false;
    }
  }

  return true;
}

// Get the stripped key for a grouped operation
function getStrippedKey(
  processedKey: string,
  term: string,
  method: HttpMethods,
): string {
  const terms = splitCamelCase(processedKey);
  const termIndex = terms.findIndex((t) => t.toLowerCase() === term);

  if (termIndex === -1) {
    return method;
  }

  const before = terms.slice(0, termIndex);
  const after = terms.slice(termIndex + 1);

  const firstBefore = before[0];
  if (firstBefore) {
    return (
      firstBefore.toLowerCase() +
      before
        .slice(1)
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
        .join('')
    );
  }

  const firstAfter = after[0];
  if (firstAfter) {
    return (
      firstAfter.toLowerCase() +
      after
        .slice(1)
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
        .join('')
    );
  }

  return method;
}

// Get common parameter types from a group of operations (intersection, not union)
function getCommonParamTypes(ops: Operation[]): string[] {
  if (ops.length === 0) return [];

  // Start with the parameter types from the first operation
  const firstOp = ops[0];
  if (!firstOp) return [];

  let commonTypes = new Set<string>(Object.keys(firstOp.parameters));

  // Intersect with parameter types from remaining operations
  for (let i = 1; i < ops.length; i++) {
    const op = ops[i];
    if (!op) continue;

    const opParamTypes = new Set<string>(Object.keys(op.parameters));
    commonTypes = new Set([...commonTypes].filter((t) => opParamTypes.has(t)));
  }

  return Array.from(commonTypes);
}

// Build group parameters object from operations
function buildGroupParameters(ops: Operation[]): Record<string, ValiSchema> {
  const paramTypes = getCommonParamTypes(ops);
  const result: Record<string, ValiSchema> = {};

  for (const paramType of paramTypes) {
    // Get the schema from the first operation that has this param type
    for (const op of ops) {
      const schema = op.parameters[paramType];
      if (schema) {
        result[paramType] = schema;
        break;
      }
    }
  }

  return result;
}

// Remove common parameter types from an operation
function removeCommonParams(
  op: Operation,
  commonParamTypes: string[],
): Operation {
  const filteredParams: Record<string, ValiSchema> = {};

  for (const [key, value] of Object.entries(op.parameters)) {
    if (!commonParamTypes.includes(key)) {
      filteredParams[key] = value;
    }
  }

  return {
    ...op,
    parameters: filteredParams,
  };
}

type GroupedOperation = {
  parameters: Record<string, ValiSchema>;
  operations: Record<string, Operation>;
};

type TransformedOperations = Record<string, Operation | GroupedOperation>;

/**
 * Transform an operations object into the Endpoints structure.
 * Groups operations by term and shared tags, extracting common parameters.
 */
function transformOperations<O extends Record<string, Operation>>(
  operations: O,
): TransformedOperations {
  const result: TransformedOperations = {};
  const groupedOperationKeys = new Set<string>();

  // Collect all unique terms across all operations
  const allTerms = new Set<string>();
  for (const [key, op] of Object.entries(operations)) {
    const processedKey = getProcessedKey(key, op.method);
    for (const term of getAllTerms(processedKey)) {
      allTerms.add(term);
    }
  }

  // For each term, find operations that share tags and have non-empty parameters
  for (const term of allTerms) {
    const matchingOps: Array<{
      key: string;
      op: Operation;
      processedKey: string;
    }> = [];

    for (const [key, op] of Object.entries(operations)) {
      if (!hasNonEmptyParameters(op)) continue;

      const processedKey = getProcessedKey(key, op.method);
      const terms = getAllTerms(processedKey);

      if (
        terms.includes(term) &&
        hasSharedTagWithSameTermOp(operations, key, term)
      ) {
        matchingOps.push({ key, op, processedKey });
      }
    }

    // If we have grouped operations for this term
    if (matchingOps.length > 0) {
      const groupParams = buildGroupParameters(matchingOps.map((m) => m.op));
      const commonParamTypes = Object.keys(groupParams);

      const groupOperations: Record<string, Operation> = {};

      for (const { key, op, processedKey } of matchingOps) {
        const strippedKey = getStrippedKey(processedKey, term, op.method);
        groupOperations[strippedKey] = removeCommonParams(op, commonParamTypes);
        groupedOperationKeys.add(key);
      }

      result[term] = {
        parameters: groupParams,
        operations: groupOperations,
      };
    }
  }

  // Add ungrouped operations
  for (const [key, op] of Object.entries(operations)) {
    if (groupedOperationKeys.has(key)) continue;

    const processedKey = getProcessedKey(key, op.method);
    result[processedKey] = op;
  }

  return result;
}

// Type guard to check if a value is a grouped operation
export function isGroupedOperation(
  value: Operation | GroupedOperation,
): value is GroupedOperation {
  return 'operations' in value && 'parameters' in value && !('method' in value);
}

// Fetcher function type - returns a Response object
export type Fetcher = (
  op: Operation,
  params: Record<string, unknown>,
) => Promise<Response>;

// Options for createEndpoints
export type CreateEndpointsOptions = {
  /**
   * If true, missing response schemas will not throw an error.
   * Instead, the response body will be returned without validation.
   */
  ignoreMissingSchema?: boolean;
  /**
   * If true, disables all parsing and validation.
   * Arguments are passed through without validation.
   * Response body is returned without parsing or validation.
   */
  disableParsing?: boolean;
};

/**
 * Validate arguments against parameter schemas using valibot.
 * Throws a ValiError if validation fails.
 * Returns empty object if no parameters are defined.
 * If disableParsing is true, returns args mapped to param keys without validation.
 */
function validateParams(
  params: Record<string, ValiSchema>,
  args: unknown[],
  options: CreateEndpointsOptions = {},
): Record<string, unknown> {
  const paramKeys = Object.keys(params);

  // Skip validation if no parameters are defined
  if (paramKeys.length === 0) {
    // If disableParsing is true and we have args, pass the first arg through directly
    // This handles cases where the operation expects content but has no schema
    if (options.disableParsing && args.length > 0) {
      return args[0] as Record<string, unknown>;
    }
    return {};
  }

  const result: Record<string, unknown> = {};

  for (let i = 0; i < paramKeys.length; i++) {
    const key = paramKeys[i];
    if (key) {
      const value = args[i];

      if (options.disableParsing) {
        // Pass through without validation, preserving undefined
        if (value !== undefined) {
          result[key] = value;
        }
      } else {
        const schema = params[key];
        if (schema) {
          // Parse and validate the argument against the schema
          // Default to empty object for optional params
          const next = v.safeParse(schema, value ?? {}, {
            abortEarly: true,
          });
          if (next.success) {
            result[key] = next.output;
          } else {
            throw new Error(v.summarize(next.issues));
          }
        }
      }
    }
  }

  return result;
}

/**
 * Parse the response body based on content type header.
 */
async function parseResponseBody(
  response: Response,
  mimeType: string,
): Promise<unknown> {
  if (mimeType === 'application/json' || mimeType.endsWith('+json')) {
    return response.json();
  } else if (
    mimeType.startsWith('text/') ||
    mimeType === 'application/xml' ||
    mimeType === 'application/xhtml+xml' ||
    mimeType.endsWith('+xml') ||
    mimeType === 'application/javascript' ||
    mimeType === 'application/ecmascript' ||
    mimeType === 'application/x-www-form-urlencoded' ||
    mimeType === 'application/yaml'
  ) {
    return response.text();
  } else if (
    mimeType.startsWith('image/') ||
    mimeType.startsWith('audio/') ||
    mimeType.startsWith('video/') ||
    mimeType === 'application/pdf' ||
    mimeType === 'application/octet-stream'
  ) {
    return response.blob();
  } else {
    return response.text();
  }
}

/**
 * Parse and validate the response based on status code and content type.
 * Uses the operation's response schemas to validate the response body.
 */
async function parseResponse(
  response: Response,
  op: Operation,
  options: CreateEndpointsOptions = {},
): Promise<unknown> {
  const statusCode = response.status.toString();
  const rawContentType = response.headers.get('content-type');
  const mimeType =
    typeof rawContentType === 'string'
      ? contentTypeParser.safeParse(rawContentType).type
      : '';

  // Find the response schema for this status code
  const statusSchemas = op.response[statusCode] ?? op.response['default'];

  if (!statusSchemas) {
    if (options.ignoreMissingSchema) {
      return parseResponseBody(response, mimeType);
    }
    throw new Error(
      `No response schema defined for status ${statusCode} in operation ${op.method.toUpperCase()} ${op.path}`,
    );
  }

  // Find the schema for this content type
  let schema: ValiSchema | undefined;
  let matchedMimeType: string | undefined;

  for (const [schemaContentType, schemaValue] of Object.entries(
    statusSchemas,
  )) {
    // Check for exact match or prefix match (e.g., "application/json" matches "application/json; charset=utf-8")
    if (
      mimeType === schemaContentType ||
      mimeType.startsWith(schemaContentType.split(';')[0] ?? '')
    ) {
      schema = schemaValue;
      matchedMimeType = schemaContentType;
      break;
    }
  }

  // If no content type match, try to use the first available schema
  if (!schema) {
    const firstEntry = Object.entries(statusSchemas)[0];
    if (firstEntry) {
      [matchedMimeType, schema] = firstEntry;
    }
  }

  if (!schema) {
    if (options.ignoreMissingSchema) {
      return parseResponseBody(response, mimeType);
    }
    throw new Error(
      `No response schema found for media "${mimeType}" in operation ${op.method.toUpperCase()} ${op.path}`,
    );
  }

  // Parse the response body based on content type
  const body = await parseResponseBody(response, matchedMimeType ?? mimeType);

  // Validate the response body against the schema
  return v
    .parseAsync(schema, body, {
      abortEarly: true,
    })
    .catch((e) => (v.isValiError(e) ? v.summarize(e.issues) : e));
}

/**
 * Create an endpoint function from an Operation.
 * The returned function accepts parameter values and makes the API call.
 * Arguments are validated against the operation's parameter schemas.
 * Response is parsed and validated based on status code and content type.
 * If disableParsing is true, skips all validation and returns parsed body without schema validation.
 */
function createEndpointFn<O extends Operation>(
  op: O,
  fetcher: Fetcher,
  options: CreateEndpointsOptions = {},
): Endpoint<O> {
  const fn = async (...args: unknown[]) => {
    // Validate and convert args to params object
    const params = validateParams(op.parameters, args, options);
    const response = await fetcher(op, params);

    if (options.disableParsing) {
      // Parse body based on content type but skip schema validation
      const contentType = response.headers.get('content-type') ?? '';
      return parseResponseBody(response, contentType);
    }

    return parseResponse(response, op, options);
  };

  return fn as Endpoint<O>;
}

/**
 * Create a grouped endpoint function.
 * Returns a function that accepts group parameters and returns an object of endpoint functions.
 * Both group parameters and operation-specific parameters are validated.
 * Responses are parsed and validated based on status code and content type.
 * If disableParsing is true, skips all validation.
 */
function createGroupedEndpointFn<
  TParams extends Record<string, ValiSchema>,
  TOps extends Record<string, Operation>,
>(
  group: { parameters: TParams; operations: TOps },
  fetcher: Fetcher,
  options: CreateEndpointsOptions = {},
): GroupedEndpoint<TParams, TOps> {
  // Capture everything we need at creation time to avoid closure issues
  // Make defensive copies of the group's parameters and operations
  const groupParameters: Record<string, ValiSchema> = { ...group.parameters };
  const groupParamKeys = Object.keys(groupParameters);

  // Pre-process operations: remove group param keys and store with their keys
  const processedOperations: Array<{ key: string; op: Operation }> = [];
  for (const [key, op] of Object.entries(group.operations)) {
    // Remove group parameter keys from operation parameters
    // so validateParams doesn't look for params already supplied by the group
    const opWithoutGroupParams: Operation = {
      ...op,
      parameters: Object.fromEntries(
        Object.entries(op.parameters).filter(
          ([paramKey]) => !groupParamKeys.includes(paramKey),
        ),
      ),
    };
    processedOperations.push({ key, op: opWithoutGroupParams });
  }

  const fn = (...groupArgs: unknown[]) => {
    // Validate and convert group args to params object
    const groupParams = validateParams(groupParameters, groupArgs, options);

    // Create endpoint functions for each operation in the group
    const endpoints: Record<string, Endpoint<Operation>> = {};

    for (const { key, op } of processedOperations) {
      // Create a wrapped fetcher that merges group params with operation params
      const wrappedFetcher: Fetcher = (operation, opParams) => {
        const allParams = { ...groupParams, ...opParams };
        return fetcher(operation, allParams);
      };

      endpoints[key] = createEndpointFn(op, wrappedFetcher, options);
    }

    return endpoints;
  };

  return fn as unknown as GroupedEndpoint<TParams, TOps>;
}

/**
 * Create an Endpoints object from an operations object.
 * Transforms operations, groups them by term and shared tags,
 * and creates callable endpoint functions.
 *
 * @param operations - The operations object from the OpenAPI spec
 * @param fetcher - Function that makes the HTTP request and returns a Response
 * @param options - Optional configuration
 * @param options.ignoreMissingSchema - If true, missing response schemas won't throw errors
 */
export function createEndpoints<O extends Record<string, Operation>>(
  operations: O,
  fetcher: Fetcher,
  options: CreateEndpointsOptions = {},
): CreateEndpoints<O> {
  const transformed = transformOperations(operations);
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(transformed)) {
    if (isGroupedOperation(value)) {
      result[key] = createGroupedEndpointFn(value, fetcher, options);
    } else {
      result[key] = createEndpointFn(value, fetcher, options);
    }
  }

  return result as CreateEndpoints<O>;
}
