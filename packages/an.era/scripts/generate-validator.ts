/**
 * Generate Valibot validation schemas from OpenAPI 3.0/3.1 spec.
 * Reverse-engineered from @valibot/to-json-schema mappings.
 */
import {
  type GlobalContext,
  type OpenAPI3,
  type ReferenceObject,
  type SchemaObject,
  resolveRef,
  scanDiscriminators,
} from 'openapi-typescript';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outPath = path.join(repoRoot, 'src', 'validator', 'generated.ts');

const SOURCE_URL = 'https://api.are.na/v3/openapi.json';

// Format mappings from JSON Schema to Valibot pipe actions
const FORMAT_ACTIONS: Record<string, string | null> = {
  email: 'v.email()',
  'idn-email': 'v.email()',
  uuid: 'v.uuid()',
  uri: 'v.url()',
  'uri-reference': null,
  iri: 'v.url()',
  'iri-reference': null,
  hostname: null,
  'idn-hostname': null,
  ipv4: 'v.ipv4()',
  ipv6: 'v.ipv6()',
  'date-time': 'v.isoTimestamp()',
  date: 'v.isoDate()',
  time: 'v.isoTime()',
  'json-pointer': null,
  'relative-json-pointer': null,
  regex: null,
  'iso-date-time': 'v.isoDateTime()',
  'iso-week': 'v.isoWeek()',
  duration: null,
  binary: 'v.base64()',
  base64: 'v.base64()',
};

// JSON Schema string format patterns to Valibot actions
const PATTERN_ACTIONS: Record<string, string> = {
  '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$': 'v.uuid()',
  '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$': 'v.hexColor()',
  '^[0-9a-fA-F]+$': 'v.hexadecimal()',
  '^[+-]?(?:\\d*\\.)?\\d+$': 'v.decimal()',
  '^\\d+$': 'v.digits()',
  '^[a-z0-9]+(?:-[a-z0-9]+)*$': 'v.slug()',
  '^[0-9A-HJKMNP-TV-Z]{26}$': 'v.ulid()',
  '^[a-z][a-z0-9]+$': 'v.cuid2()',
  '^[A-Za-z0-9_-]{21}$': 'v.nanoid()',
  '^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$': 'v.bic()',
  '^0[0-7]+$': 'v.octal()',
  '^$': 'v.empty()',
};

async function resolveSource(input?: string) {
  const source = input ?? SOURCE_URL;
  if (source.startsWith('http://') || source.startsWith('https://')) {
    const res = await fetch(source);
    if (!res.ok)
      throw new Error(
        `Failed to fetch OpenAPI JSON: ${res.status} ${res.statusText}`,
      );
    return { source, openapiJson: await res.json() };
  }
  const text = await fs.readFile(source, 'utf-8');
  return { source, openapiJson: JSON.parse(text) };
}

function isObject(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === 'object' && !Array.isArray(x);
}

// Check if a schema has actual type constraints (not just metadata like description)
function hasActualConstraints(schema: unknown): boolean {
  if (!isObject(schema)) return false;

  // $ref always points to a real schema
  if ('$ref' in schema) return true;

  // These properties indicate actual type constraints
  const constraintKeys = [
    'type',
    'properties',
    'items',
    'additionalProperties',
    'enum',
    'const',
    'allOf',
    'anyOf',
    'oneOf',
    'nullable',
    'format',
    'pattern',
    'minLength',
    'maxLength',
    'minimum',
    'maximum',
    'multipleOf',
    'minItems',
    'maxItems',
    'required',
    'discriminator',
  ];

  return constraintKeys.some((key) => key in schema);
}

// Convert PascalCase to camelCase (lowercase first letter only)
function toCamelCase(name: string): string {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

// Get raw schema name (for internal use in other schemas)
function getRawSchemaName(name: string): string {
  return toCamelCase(name.replace(/Schema$/, '')) + 'Schema';
}

// Get validator export name (for sValidator wrapped export)
function getValidatorName(name: string): string {
  return toCamelCase(name.replace(/Schema$/, ''));
}

// Convert JSON schema to Valibot schema expression
function jsonSchemaToValibot(
  schema: SchemaObject | ReferenceObject | boolean | undefined,
  ctx: GlobalContext,
  options: {
    propertyPath?: string[];
    schemaName?: string;
    inOneOf?: boolean;
  } = {},
): string {
  if (schema === true) return 'v.any()';
  if (schema === false) return 'v.never()';
  if (!schema) return 'v.unknown()';

  // Handle $ref directly - use raw schema name
  if (isObject(schema) && '$ref' in schema && typeof schema.$ref === 'string') {
    const refName = getRefName(schema.$ref);
    return getRawSchemaName(refName);
  }

  const s = schema as SchemaObject;
  const pipes: string[] = [];

  // Handle nullable (OpenAPI 3.0 style)
  const isNullable = (s as Record<string, unknown>).nullable === true;

  // Handle type or anyOf/oneOf/allOf
  if (s.allOf && Array.isArray(s.allOf)) {
    // allOf -> v.intersect()
    // Filter out schemas that have only metadata (description, title, etc.) and no actual type constraints
    const schemas = s.allOf
      .filter((sub) => hasActualConstraints(sub))
      .map((sub, i) =>
        jsonSchemaToValibot(sub as SchemaObject, ctx, {
          ...options,
          propertyPath: [...(options.propertyPath ?? []), 'allOf', String(i)],
        }),
      );

    // If only one schema remains after filtering, return it directly
    if (schemas.length === 1) {
      let result = schemas[0]!;
      if (isNullable) {
        result = `v.nullable(${result})`;
      }
      return result;
    }

    // If no schemas remain, treat as unknown
    if (schemas.length === 0) {
      return isNullable ? 'v.nullable(v.unknown())' : 'v.unknown()';
    }

    // Remove duplicates (same schema appearing multiple times)
    const uniqueSchemas = [...new Set(schemas)];
    let result = `v.intersect([${uniqueSchemas.join(', ')}])`;
    if (isNullable) {
      result = `v.nullable(${result})`;
    }
    return result;
  }

  if (s.anyOf && Array.isArray(s.anyOf)) {
    // anyOf -> v.union()
    const schemas = s.anyOf.map((sub, i) =>
      jsonSchemaToValibot(sub as SchemaObject, ctx, {
        ...options,
        propertyPath: [...(options.propertyPath ?? []), 'anyOf', String(i)],
      }),
    );
    let result = `v.union([${schemas.join(', ')}])`;
    if (isNullable) {
      result = `v.nullable(${result})`;
    }
    return result;
  }

  if (s.oneOf && Array.isArray(s.oneOf)) {
    // oneOf -> v.union()
    const schemas = s.oneOf.map((sub, i) =>
      jsonSchemaToValibot(sub as SchemaObject, ctx, {
        ...options,
        propertyPath: [...(options.propertyPath ?? []), 'oneOf', String(i)],
      }),
    );
    let result = `v.union([${schemas.join(', ')}])`;
    if (isNullable) {
      result = `v.nullable(${result})`;
    }
    return result;
  }

  // Handle enum
  const enumValues = (s as Record<string, unknown>).enum;
  if (Array.isArray(enumValues)) {
    const values = enumValues as (string | number | boolean | null)[];
    let result: string;

    if (values.every((v) => typeof v === 'string')) {
      // String enum - use v.picklist for better type inference
      if (values.length === 1) {
        result = `v.literal(${JSON.stringify(values[0])})`;
      } else {
        result = `v.picklist([${values.map((v) => JSON.stringify(v)).join(', ')}])`;
      }
    } else if (values.every((v) => typeof v === 'number')) {
      // Number enum
      if (values.length === 1) {
        result = `v.literal(${JSON.stringify(values[0])})`;
      } else {
        result = `v.picklist([${values.map((v) => JSON.stringify(v)).join(', ')}])`;
      }
    } else {
      // Mixed types - use union of literals
      const literals = values.map((v) => `v.literal(${JSON.stringify(v)})`);
      result = `v.union([${literals.join(', ')}])`;
    }

    if (isNullable) {
      result = `v.nullable(${result})`;
    }
    return result;
  }

  // Handle const
  const constValue = (s as Record<string, unknown>).const;
  if (constValue !== undefined) {
    let result = `v.literal(${JSON.stringify(constValue)})`;
    if (isNullable) {
      result = `v.nullable(${result})`;
    }
    return result;
  }

  // Handle by type
  const type = s.type;
  let baseSchema = '';

  switch (type) {
    case 'string': {
      baseSchema = 'v.string()';
      const ss = s as SchemaObject & Record<string, unknown>;

      // Format-based validation
      if (typeof ss.format === 'string' && FORMAT_ACTIONS[ss.format]) {
        const action = FORMAT_ACTIONS[ss.format];
        if (action) pipes.push(action);
      }

      // Pattern-based validation
      if (typeof ss.pattern === 'string') {
        const patternAction = PATTERN_ACTIONS[ss.pattern];
        if (patternAction) {
          pipes.push(patternAction);
        } else {
          pipes.push(`v.regex(/${ss.pattern.replace(/\//g, '\\/')}/)`);
        }
      }

      // Length validations
      if (typeof ss.minLength === 'number') {
        if (ss.minLength === 0) {
          pipes.push('v.nonEmpty()');
        } else {
          pipes.push(`v.minLength(${ss.minLength})`);
        }
      }
      if (typeof ss.maxLength === 'number') {
        pipes.push(`v.maxLength(${ss.maxLength})`);
      }

      // Content encoding
      if (ss.contentEncoding === 'base64') {
        pipes.push('v.base64()');
      }
      break;
    }

    case 'number':
    case 'integer': {
      baseSchema = 'v.number()';
      const ns = s as SchemaObject & Record<string, unknown>;

      // Integer validation
      if (type === 'integer' || ns.format === 'int64') {
        pipes.push('v.integer()');
      }

      // Range validations
      if (typeof ns.minimum === 'number') {
        pipes.push(`v.minValue(${ns.minimum})`);
      }
      if (typeof ns.maximum === 'number') {
        pipes.push(`v.maxValue(${ns.maximum})`);
      }
      if (typeof ns.exclusiveMinimum === 'number') {
        pipes.push(`v.gtValue(${ns.exclusiveMinimum})`);
      }
      if (typeof ns.exclusiveMaximum === 'number') {
        pipes.push(`v.ltValue(${ns.exclusiveMaximum})`);
      }

      // Multiple of
      if (typeof ns.multipleOf === 'number') {
        pipes.push(`v.multipleOf(${ns.multipleOf})`);
      }
      break;
    }

    case 'boolean': {
      baseSchema = 'v.boolean()';
      break;
    }

    case 'array': {
      const arr = s as SchemaObject & Record<string, unknown>;
      const items = arr.items;

      if (items) {
        if (Array.isArray(items)) {
          // Tuple with specific types for each position
          const tupleItems = items.map((item, i) =>
            jsonSchemaToValibot(item as SchemaObject, ctx, {
              ...options,
              propertyPath: [
                ...(options.propertyPath ?? []),
                'items',
                String(i),
              ],
            }),
          );
          baseSchema = `v.tuple([${tupleItems.join(', ')}])`;
        } else {
          // Array with single item type
          const itemSchema = jsonSchemaToValibot(items as SchemaObject, ctx, {
            ...options,
            propertyPath: [...(options.propertyPath ?? []), 'items'],
          });
          baseSchema = `v.array(${itemSchema})`;
        }
      } else {
        baseSchema = 'v.array(v.unknown())';
      }

      // Length validations
      if (typeof arr.minItems === 'number') {
        pipes.push(`v.minLength(${arr.minItems})`);
      }
      if (typeof arr.maxItems === 'number') {
        pipes.push(`v.maxLength(${arr.maxItems})`);
      }
      break;
    }

    case 'object': {
      const obj = s as SchemaObject & Record<string, unknown>;
      const properties = (obj.properties || {}) as Record<
        string,
        SchemaObject | ReferenceObject
      >;
      const required = new Set(Array.isArray(obj.required) ? obj.required : []);

      const propEntries: string[] = [];
      for (const [propName, propSchema] of Object.entries(properties)) {
        const isRequired = required.has(propName);

        // Get the raw schema without considering optionality yet
        let propExpr = jsonSchemaToValibot(propSchema, ctx, {
          ...options,
          propertyPath: [
            ...(options.propertyPath ?? []),
            'properties',
            propName,
          ],
        });

        // Check if already nullable (wrapped with v.nullable)
        const isAlreadyNullable = propExpr.startsWith('v.nullable(');

        // Handle nullable references - if property is not required and the schema allows null
        if (!isRequired) {
          // Check if it's a union containing null
          const resolvedProp = resolveMaybeRef(propSchema, ctx) as
            | (SchemaObject & Record<string, unknown>)
            | undefined;
          const hasNullInUnion =
            resolvedProp?.anyOf?.some(
              (s) => (s as { type?: string }).type === 'null',
            ) ??
            resolvedProp?.oneOf?.some(
              (s) => (s as { type?: string }).type === 'null',
            ) ??
            resolvedProp?.nullable === true;

          if (hasNullInUnion && !isAlreadyNullable) {
            propExpr = `v.nullable(${propExpr})`;
          }

          // Wrap with v.optional
          propExpr = `v.optional(${propExpr})`;
        }

        propEntries.push(`${JSON.stringify(propName)}: ${propExpr}`);
      }

      // looseObject keeps unknown keys from the API (forward-compatible with new fields).
      const additionalProps = obj.additionalProperties;
      baseSchema = `v.looseObject({ ${propEntries.join(', ')} })`;

      // Record type (propertyNames + additionalProperties)
      if (obj.propertyNames && isObject(additionalProps)) {
        const valueSchema = jsonSchemaToValibot(
          additionalProps as SchemaObject,
          ctx,
          {
            ...options,
            propertyPath: [
              ...(options.propertyPath ?? []),
              'additionalProperties',
            ],
          },
        );
        baseSchema = `v.record(v.string(), ${valueSchema})`;
      }
      break;
    }

    case 'null': {
      baseSchema = 'v.null()';
      break;
    }

    default: {
      // No type specified or unknown type
      const objWithProps = s as SchemaObject & {
        properties?: unknown;
        additionalProperties?: unknown;
      };
      if (objWithProps.properties || objWithProps.additionalProperties) {
        // Treat as object
        return jsonSchemaToValibot(
          { ...s, type: 'object' } as SchemaObject,
          ctx,
          options,
        );
      }
      baseSchema = 'v.unknown()';
    }
  }

  // Apply pipes if any
  let result = baseSchema;
  if (pipes.length > 0) {
    result = `v.pipe(${baseSchema}, ${pipes.join(', ')})`;
  }

  // Apply nullable wrapper
  if (isNullable) {
    result = `v.nullable(${result})`;
  }

  return result;
}

function resolveMaybeRef(obj: unknown, ctx: GlobalContext): unknown {
  if (isObject(obj) && '$ref' in obj && typeof obj.$ref === 'string') {
    return ctx.resolve(obj.$ref);
  }
  return obj;
}

// Extract $ref name from a reference string
function getRefName($ref: string): string {
  const parts = $ref.split('/');
  return parts[parts.length - 1] ?? 'Unknown';
}

const COMPONENTS_SCHEMAS_PREFIX = '#/components/schemas/';

/** Collect OpenAPI component schema names this schema depends on (via $ref). */
function collectComponentSchemaRefs(
  node: unknown,
  refs: Set<string>,
  ctx: GlobalContext,
  visitedRefs: Set<string>,
): void {
  if (!isObject(node)) return;

  if ('$ref' in node && typeof node.$ref === 'string') {
    const ref = node.$ref;
    if (ref.startsWith(COMPONENTS_SCHEMAS_PREFIX)) {
      const name = getRefName(ref);
      refs.add(name);
      if (!visitedRefs.has(ref)) {
        visitedRefs.add(ref);
        const resolved = ctx.resolve(ref);
        if (resolved) {
          collectComponentSchemaRefs(resolved, refs, ctx, visitedRefs);
        }
      }
    }
    return;
  }

  if ('properties' in node && isObject(node.properties)) {
    for (const prop of Object.values(node.properties)) {
      collectComponentSchemaRefs(prop, refs, ctx, visitedRefs);
    }
  }
  if ('items' in node && node.items) {
    if (Array.isArray(node.items)) {
      for (const item of node.items) {
        collectComponentSchemaRefs(item, refs, ctx, visitedRefs);
      }
    } else {
      collectComponentSchemaRefs(node.items, refs, ctx, visitedRefs);
    }
  }
  if ('allOf' in node && Array.isArray(node.allOf)) {
    for (const sub of node.allOf) {
      collectComponentSchemaRefs(sub, refs, ctx, visitedRefs);
    }
  }
  if ('anyOf' in node && Array.isArray(node.anyOf)) {
    for (const sub of node.anyOf) {
      collectComponentSchemaRefs(sub, refs, ctx, visitedRefs);
    }
  }
  if ('oneOf' in node && Array.isArray(node.oneOf)) {
    for (const sub of node.oneOf) {
      collectComponentSchemaRefs(sub, refs, ctx, visitedRefs);
    }
  }
  if ('additionalProperties' in node && isObject(node.additionalProperties)) {
    collectComponentSchemaRefs(
      node.additionalProperties,
      refs,
      ctx,
      visitedRefs,
    );
  }
}

/** Topological order: dependencies before dependents (OpenAPI component schema keys). */
function analyzeComponentSchemaOrder(
  schemas: Record<string, SchemaObject | ReferenceObject | boolean>,
  ctx: GlobalContext,
): string[] {
  const graph = new Map<string, Set<string>>();
  for (const name of Object.keys(schemas)) {
    const deps = new Set<string>();
    const schemaObj = schemas[name];
    if (schemaObj !== undefined) {
      collectComponentSchemaRefs(schemaObj, deps, ctx, new Set());
    }
    const filtered = new Set<string>();
    for (const d of deps) {
      if (d in schemas) filtered.add(d);
    }
    graph.set(name, filtered);
  }

  const done = new Set<string>();
  const result: string[] = [];

  function visit(name: string, visiting = new Set<string>()) {
    if (done.has(name)) return;
    if (visiting.has(name)) return; // cycle: skip re-entry; will still emit when stack unwinds
    visiting.add(name);
    for (const dep of graph.get(name) ?? []) {
      if (dep !== name) visit(dep, visiting);
    }
    visiting.delete(name);
    done.add(name);
    result.push(name);
  }

  for (const name of Object.keys(schemas)) {
    visit(name);
  }

  return result;
}

// Main generation logic
async function generateValidators() {
  const argv = process.argv.slice(2);
  const argSource = argv.find((a) => a.startsWith('--source='))?.split('=')[1];

  const { openapiJson } = await resolveSource(argSource);
  const schema = openapiJson as OpenAPI3;

  const ctx: GlobalContext = {
    additionalProperties: false,
    alphabetize: true,
    arrayLength: false,
    defaultNonNullable: true,
    discriminators: scanDiscriminators(schema, { silent: false }),
    emptyObjectsUnknown: false,
    enum: false,
    enumValues: false,
    conditionalEnums: false,
    dedupeEnums: false,
    excludeDeprecated: false,
    exportType: false,
    immutable: false,
    rootTypes: false,
    rootTypesNoSchemaPrefix: false,
    rootTypesKeepCasing: false,
    injectFooter: [],
    pathParamsAsTypes: false,
    postTransform: undefined,
    propertiesRequiredByDefault: false,
    redoc: {} as never,
    silent: false,
    inject: undefined,
    transform: undefined,
    transformProperty: undefined,
    makePathsEnum: false,
    generatePathParams: false,
    readWriteMarkers: false,
    resolve($ref: string) {
      return resolveRef(schema, $ref, { silent: ctx.silent });
    },
  };

  // Collect all schema definitions
  const rawSchemas: Array<{ name: string; expr: string }> = [];
  const validatorExports: Array<{
    name: string;
    target: string;
    rawSchemaName: string;
  }> = [];

  // Generate schemas from components/schemas (dependency order: $ref targets first)
  const schemas = schema.components?.schemas || {};
  const sortedSchemaNames = analyzeComponentSchemaOrder(schemas, ctx);
  for (const schemaName of sortedSchemaNames) {
    const schemaObj = schemas[schemaName];
    if (!schemaObj) continue;

    const valibotExpr = jsonSchemaToValibot(schemaObj as SchemaObject, ctx, {
      schemaName,
      propertyPath: ['components', 'schemas', schemaName],
    });

    const rawName = getRawSchemaName(schemaName);
    const validatorName = getValidatorName(schemaName);

    rawSchemas.push({ name: rawName, expr: valibotExpr });
    validatorExports.push({
      name: validatorName,
      target: 'json',
      rawSchemaName: rawName,
    });
  }

  // Generate parameter schemas from components/parameters
  const parameters = schema.components?.parameters || {};
  for (const [paramName, paramObj] of Object.entries(parameters)) {
    if (!paramObj) continue;

    const resolved = resolveMaybeRef(paramObj, ctx) as
      | {
          name?: string;
          in?: string;
          schema?: SchemaObject;
          required?: boolean;
        }
      | undefined;
    if (!resolved?.schema) continue;

    const valibotExpr = jsonSchemaToValibot(resolved.schema, ctx, {
      schemaName: paramName,
      propertyPath: ['components', 'parameters', paramName, 'schema'],
    });

    const rawName = getRawSchemaName(paramName + 'Param');
    const validatorName = getValidatorName(paramName);

    // Determine target based on parameter location
    const paramIn = resolved.in ?? 'query';
    const target =
      paramIn === 'path' ? 'param' : paramIn === 'header' ? 'header' : paramIn;

    rawSchemas.push({ name: rawName, expr: valibotExpr });
    validatorExports.push({
      name: validatorName,
      target,
      rawSchemaName: rawName,
    });
  }

  // Generate request/response body schemas for operations
  const paths = schema.paths || {};

  // First pass: analyze operations to count request/response schemas per operation
  const operationInfo = new Map<
    string,
    {
      requestContentTypes: string[];
      responseStatusCodes: string[];
    }
  >();

  for (const [, pathItemRaw] of Object.entries(paths)) {
    const pathItem = resolveMaybeRef(pathItemRaw, ctx) as
      | Record<string, unknown>
      | undefined;
    if (!pathItem) continue;

    const methods = ['get', 'post', 'put', 'patch', 'delete'] as const;

    for (const method of methods) {
      const operation = pathItem[method] as
        | { operationId?: string; requestBody?: unknown; responses?: unknown }
        | undefined;
      if (!operation?.operationId) continue;

      const operationId = operation.operationId;
      const info: {
        requestContentTypes: string[];
        responseStatusCodes: string[];
      } = {
        requestContentTypes: [],
        responseStatusCodes: [],
      };

      // Count request body content types
      if (operation.requestBody) {
        const requestBody = resolveMaybeRef(operation.requestBody, ctx) as
          | { content?: Record<string, { schema?: SchemaObject }> }
          | undefined;
        if (requestBody?.content) {
          for (const contentType of Object.keys(requestBody.content)) {
            const mediaResolved = resolveMaybeRef(
              requestBody.content[contentType],
              ctx,
            ) as { schema?: SchemaObject } | undefined;
            if (mediaResolved?.schema) {
              info.requestContentTypes.push(contentType);
            }
          }
        }
      }

      // Count 2xx response status codes
      if (operation.responses) {
        const responses = resolveMaybeRef(operation.responses, ctx) as
          | Record<string, unknown>
          | undefined;
        if (responses) {
          for (const [statusCode, response] of Object.entries(responses)) {
            if (!statusCode.startsWith('2')) continue;
            const responseResolved = resolveMaybeRef(response, ctx) as
              | { content?: Record<string, { schema?: SchemaObject }> }
              | undefined;
            if (responseResolved?.content) {
              const hasSchema = Object.values(responseResolved.content).some(
                (mediaType) => {
                  const mediaResolved = resolveMaybeRef(mediaType, ctx) as
                    | { schema?: SchemaObject }
                    | undefined;
                  return !!mediaResolved?.schema;
                },
              );
              if (hasSchema) {
                info.responseStatusCodes.push(statusCode);
              }
            }
          }
        }
      }

      operationInfo.set(operationId, info);
    }
  }

  // Second pass: generate operation request/response schemas
  for (const [, pathItemRaw] of Object.entries(paths)) {
    const pathItem = resolveMaybeRef(pathItemRaw, ctx) as
      | Record<string, unknown>
      | undefined;
    if (!pathItem) continue;

    const methods = ['get', 'post', 'put', 'patch', 'delete'] as const;

    for (const method of methods) {
      const operation = pathItem[method] as
        | { operationId?: string; requestBody?: unknown; responses?: unknown }
        | undefined;
      if (!operation?.operationId) continue;

      const operationId = operation.operationId;
      const info = operationInfo.get(operationId)!;
      const hasSingleRequest = info.requestContentTypes.length === 1;
      const hasSingleResponse = info.responseStatusCodes.length === 1;

      // Request body schema
      if (operation.requestBody) {
        const requestBody = resolveMaybeRef(operation.requestBody, ctx) as
          | { content?: Record<string, { schema?: SchemaObject }> }
          | undefined;
        if (requestBody?.content) {
          for (const [contentType, mediaType] of Object.entries(
            requestBody.content,
          )) {
            const mediaResolved = resolveMaybeRef(mediaType, ctx) as
              | { schema?: SchemaObject }
              | undefined;
            if (mediaResolved?.schema) {
              const valibotExpr = jsonSchemaToValibot(
                mediaResolved.schema,
                ctx,
                {
                  schemaName: `${operationId}Request`,
                  propertyPath: [
                    'paths',
                    '',
                    method,
                    'requestBody',
                    'content',
                    contentType,
                    'schema',
                  ],
                },
              );

              // Determine target based on content type
              const target = contentType.includes('form') ? 'form' : 'json';

              // Determine naming
              let rawName: string;
              let validatorName: string;
              if (hasSingleRequest) {
                rawName = getRawSchemaName(operationId + 'Request');
                validatorName = getValidatorName(operationId + 'Request');
              } else {
                const contentHint = contentType
                  .replace(/[^a-zA-Z0-9]/g, '_')
                  .replace(/_+/g, '_');
                rawName = getRawSchemaName(
                  operationId + contentHint + 'Request',
                );
                validatorName = getValidatorName(
                  operationId + contentHint + 'Request',
                );
              }

              rawSchemas.push({ name: rawName, expr: valibotExpr });
              validatorExports.push({
                name: validatorName,
                target,
                rawSchemaName: rawName,
              });
            }
          }
        }
      }

      // Response schemas - only generate for 2xx success responses
      if (operation.responses) {
        const responses = resolveMaybeRef(operation.responses, ctx) as
          | Record<string, unknown>
          | undefined;
        if (responses) {
          for (const [statusCode, response] of Object.entries(responses)) {
            // Skip non-2xx status codes (4xx/5xx errors)
            if (!statusCode.startsWith('2')) continue;

            const responseResolved = resolveMaybeRef(response, ctx) as
              | { content?: Record<string, { schema?: SchemaObject }> }
              | undefined;
            if (responseResolved?.content) {
              for (const [contentType, mediaType] of Object.entries(
                responseResolved.content,
              )) {
                const mediaResolved = resolveMaybeRef(mediaType, ctx) as
                  | { schema?: SchemaObject }
                  | undefined;
                if (mediaResolved?.schema) {
                  const valibotExpr = jsonSchemaToValibot(
                    mediaResolved.schema,
                    ctx,
                    {
                      schemaName: `${operationId}Response${statusCode}`,
                      propertyPath: [
                        'paths',
                        '',
                        method,
                        'responses',
                        statusCode,
                        'content',
                        contentType,
                        'schema',
                      ],
                    },
                  );

                  // Determine target based on content type
                  const target = contentType.includes('form') ? 'form' : 'json';

                  // Determine naming
                  let rawName: string;
                  let validatorName: string;
                  if (hasSingleResponse) {
                    rawName = getRawSchemaName(operationId + 'Response');
                    validatorName = getValidatorName(operationId + 'Response');
                  } else {
                    rawName = getRawSchemaName(
                      operationId + statusCode + 'Response',
                    );
                    validatorName = getValidatorName(
                      operationId + statusCode + 'Response',
                    );
                  }

                  rawSchemas.push({ name: rawName, expr: valibotExpr });
                  validatorExports.push({
                    name: validatorName,
                    target,
                    rawSchemaName: rawName,
                  });
                }
              }
            }
          }
        }
      }
    }
  }

  // Generate output file
  const lines: string[] = [
    '/**',
    ' * Auto-generated Valibot validators from OpenAPI spec.',
    ' * Do not edit by hand.',
    ' */',
    '',
    "import * as v from 'valibot';",
    "import { sValidator } from '@hono/standard-validator';",
    '',
  ];

  lines.push('');
  for (const { name, expr } of rawSchemas) {
    lines.push(`const ${name} = ${expr};`);
  }
  lines.push('');

  for (const { name, target, rawSchemaName } of validatorExports) {
    lines.push(
      `export const ${name} = sValidator('${target}', {`,
      `  '~standard': ${rawSchemaName}['~standard'],`,
      `});`,
    );
  }

  await fs.writeFile(outPath, lines.join('\n'), 'utf-8');
  console.log(`Wrote ${path.relative(repoRoot, outPath)}`);
  console.log(`Generated ${rawSchemas.length} raw schemas`);
  console.log(`Generated ${validatorExports.length} validator exports`);
}

generateValidators().catch((err) => {
  console.error(err);
  process.exit(1);
});
