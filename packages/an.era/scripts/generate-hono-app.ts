import {
  type GlobalContext,
  type OpenAPI3,
  type OperationObject,
  type PathItemObject,
  type ReferenceObject,
  type RequestBodyObject,
  type SchemaObject,
  astToString,
  createRef,
  resolveRef,
  scanDiscriminators,
  transformSchemaObject,
} from 'openapi-typescript';
import { URL, fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';
import type ts from 'typescript';

const repoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outPath = path.join(repoRoot, 'src', 'client', 'app.ts');

const SOURCE_URL = 'https://api.are.na/v3/openapi.json';

const methodOrder = [
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
] as const;

function replaceParams(openApiPath: string) {
  return openApiPath.replace(/\{([^}]+)\}/g, (_, name) => `:${name}`);
}

function mapContentTypeToOutputFormat(contentType: string) {
  // Hono's known output formats are: json | text | redirect, but it allows other strings.
  const ct = contentType.toLowerCase();
  if (ct.includes('json')) return 'json';
  if (ct.startsWith('text/')) return 'text';
  return ct;
}

function isObject(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === 'object' && !Array.isArray(x);
}

function asString(node: ts.Node) {
  // openapi-typescript's astToString is stable enough to inline into type expressions.
  return astToString(node).trim();
}

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

  // Local file path
  const text = await fs.readFile(source, 'utf-8');
  return { source, openapiJson: JSON.parse(text) };
}

function toTSLiteralString(value: unknown) {
  // Works for numbers and strings; status codes should be numbers.
  return typeof value === 'number' ? String(value) : JSON.stringify(value);
}

const argv = process.argv.slice(2);
const argSource = argv.find((a) => a.startsWith('--source='))?.split('=')[1];

const { openapiJson } = await resolveSource(argSource);
// We intentionally avoid generating openapi-typescript's full `schema.ts`.
// For this generator, we only need schema.paths and then we transform request/response schemas into Hono endpoint types.
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

function resolveMaybeRef(obj: unknown) {
  if (isObject(obj) && '$ref' in obj && typeof obj.$ref === 'string') {
    return ctx.resolve(obj.$ref);
  }
  return obj;
}

/**
 * Transform an OpenAPI schema-like object into a TS type expression string.
 */
function schemaToTypeExpr(
  schemaObject: SchemaObject | undefined,
  options: {
    path?: string;
  } = {},
) {
  if (!schemaObject) return 'unknown';
  const node = transformSchemaObject(schemaObject, {
    ...options,
    ctx,
    path: options.path ?? '#',
  });
  return asString(node);
}

/** OpenAPI allows `parameters` as an array or (in some specs) a map of name → parameter. */
function normalizeParametersList(
  parameters: PathItemObject['parameters'],
): unknown[] {
  if (parameters == null) return [];
  if (Array.isArray(parameters)) return parameters;
  if (isObject(parameters)) return Object.values(parameters);
  return [];
}

/**
 * Parameter objects may use `schema` (typical) or `content` (per OpenAPI 3.x) for both
 * `in: path` and `in: query` parameters.
 */
function parameterToTypeExpr(
  parameter: unknown,
  paramIn: 'path' | 'query',
): string {
  const resolved = resolveMaybeRef(parameter);
  if (!resolved || typeof resolved !== 'object') return 'unknown';
  const p = resolved as {
    name?: string;
    schema?: SchemaObject;
    content?: Record<string, unknown>;
  };
  const paramName = String(p.name ?? 'unknown');

  if (p.schema !== undefined) {
    return schemaToTypeExpr(p.schema, {
      path: createRef(['parameters', paramIn, paramName]),
    });
  }

  if (p.content && typeof p.content === 'object') {
    const entries = Object.entries(p.content);
    if (entries.length === 0) return 'unknown';
    const typeExprs = entries.map(([contentType, media]) => {
      const mediaResolved = resolveMaybeRef(media) as
        | { schema?: SchemaObject }
        | undefined;
      return schemaToTypeExpr(mediaResolved?.schema, {
        path: createRef([
          'parameters',
          paramIn,
          paramName,
          'content',
          contentType,
        ]),
      });
    });
    return typeExprs.length === 1
      ? typeExprs[0]!
      : `(${typeExprs.join(' | ')})`;
  }

  return 'unknown';
}

/**
 * OpenAPI: `required` defaults to `false` for query/header/cookie; path params
 * must be `true` in valid specs — we only mark path keys optional if explicitly
 * `required: false`.
 */
function isParameterOptional(parameter: { in?: string; required?: boolean }) {
  if (parameter.in === 'path') return parameter.required === false;
  return parameter.required !== true;
}

function collectParametersByLocation(
  pathItem: PathItemObject,
  operation: OperationObject,
  paramIn: 'path' | 'query',
): Array<{ name: string; typeExpr: string; optional: boolean }> {
  const out: Array<{ name: string; typeExpr: string; optional: boolean }> = [];
  const all = [
    ...normalizeParametersList(pathItem?.parameters),
    ...normalizeParametersList(operation?.parameters),
  ];

  for (const p of all) {
    const resolved = resolveMaybeRef(p);
    if (!resolved || typeof resolved !== 'object') continue;
    const parameter = resolved as { in?: string; name?: string; required?: boolean };
    if (parameter.in !== paramIn) continue;
    if (!parameter.name) continue;
    out.push({
      name: String(parameter.name),
      typeExpr: parameterToTypeExpr(p, paramIn),
      optional: isParameterOptional(parameter),
    });
  }
  return out;
}

type BodyInputMember = { target: 'json' | 'form'; typeExpr: string };

function requestBodyToInputMembers(
  requestBody?: RequestBodyObject | ReferenceObject | boolean,
): BodyInputMember[] {
  if (!requestBody || requestBody === true) return [];
  const resolved = resolveMaybeRef(requestBody) as
    | { content?: Record<string, { schema?: SchemaObject }> }
    | undefined;
  if (!resolved || !resolved.content || typeof resolved.content !== 'object')
    return [];

  const members: BodyInputMember[] = [];
  for (const [contentType, mediaType] of Object.entries(resolved.content)) {
    const resolvedMediaType = resolveMaybeRef(mediaType) as
      | { schema?: SchemaObject }
      | undefined;
    if (!resolvedMediaType || typeof resolvedMediaType !== 'object') continue;

    const schemaObject = resolvedMediaType.schema ?? undefined;
    const typeExpr = schemaToTypeExpr(schemaObject, {
      path: createRef(['requestBody', contentType, 'schema']),
    });

    const target =
      contentType === 'application/x-www-form-urlencoded' ? 'form' : 'json';
    members.push({ target, typeExpr });
  }

  return members;
}

function buildInputExpr({
  bodyMembers,
  pathParams,
  queryParams,
}: {
  bodyMembers: BodyInputMember[];
  pathParams: Array<{ name: string; typeExpr: string; optional: boolean }>;
  queryParams: Array<{ name: string; typeExpr: string; optional: boolean }>;
}) {
  const sharedProps: string[] = [];
  if (pathParams.length) {
    const record = pathParams
      .map((p) => `${p.name}${p.optional ? '?' : ''}: ${p.typeExpr}`)
      .join('; ');
    sharedProps.push(`param: { ${record} }`);
  }
  if (queryParams.length) {
    const record = queryParams
      .map((p) => `${p.name}${p.optional ? '?' : ''}: ${p.typeExpr}`)
      .join('; ');
    sharedProps.push(`query: { ${record} }`);
  }

  if (bodyMembers.length === 0) {
    return sharedProps.length ? `{ ${sharedProps.join('; ')} }` : `{}`;
  }
  if (bodyMembers.length === 1) {
    const { target, typeExpr } = bodyMembers[0]!;
    return `{ ${[...sharedProps, `${target}: ${typeExpr}`].join('; ')} }`;
  }
  return bodyMembers
    .map(({ target, typeExpr }) => {
      return `{ ${[...sharedProps, `${target}: ${typeExpr}`].join('; ')} }`;
    })
    .join(' | ');
}

function operationToEndpointUnionExpr({
  operation,
  pathItem,
}: {
  operation: OperationObject;
  pathItem: PathItemObject;
}) {
  const pathParams = collectParametersByLocation(pathItem, operation, 'path');
  const queryParams = collectParametersByLocation(pathItem, operation, 'query');
  const bodyMembers = requestBodyToInputMembers(operation?.requestBody);
  const inputExpr = buildInputExpr({ bodyMembers, pathParams, queryParams });

  const responses = operation?.responses ?? {};
  if (!isObject(responses)) return `{}`;

  const endpointMembers: string[] = [];
  for (const [statusKey, responseValue] of Object.entries(responses)) {
    if (!/^\d+$/.test(statusKey)) continue;
    const statusCode = Number(statusKey);

    const resolvedResponse = resolveMaybeRef(responseValue) as
      | { content?: Record<string, { schema?: SchemaObject }> }
      | undefined;
    const content = resolvedResponse?.content;

    if (content && isObject(content) && Object.keys(content).length) {
      for (const [contentType, mediaType] of Object.entries(content)) {
        const resolvedMediaType = resolveMaybeRef(mediaType) as
          | { schema?: SchemaObject }
          | undefined;
        const schemaObject = resolvedMediaType?.schema ?? undefined;
        const outputTypeExpr = schemaToTypeExpr(schemaObject, {
          path: createRef(['responses', statusKey, contentType, 'schema']),
        });
        const outputFormat = mapContentTypeToOutputFormat(contentType);

        endpointMembers.push(
          `{ input: ${inputExpr}; output: ${outputTypeExpr}; outputFormat: ${toTSLiteralString(
            outputFormat,
          )}; status: ${statusCode} }`,
        );
      }
    } else {
      // No response body: Hono expects an output type of {}.
      endpointMembers.push(
        `{ input: ${inputExpr}; output: {}; outputFormat: 'json'; status: ${statusCode} }`,
      );
    }
  }

  // If there are no responses, return never so the endpoint isn't callable.
  if (!endpointMembers.length) return `never`;
  return endpointMembers.length === 1
    ? endpointMembers[0]
    : endpointMembers.join(' | ');
}

const honoSchemaLines = [];
honoSchemaLines.push('type Endpoints = {');

for (const [openApiPath, pathItem] of Object.entries(schema.paths ?? {})) {
  const resolvedPathItem = resolveMaybeRef(pathItem) as
    | PathItemObject
    | undefined;
  if (!resolvedPathItem || typeof resolvedPathItem !== 'object') continue;

  const honoPath = replaceParams(openApiPath);
  const methodLines = [];

  for (const methodName of methodOrder) {
    const operation = resolvedPathItem[methodName] as
      | OperationObject
      | undefined;
    if (!operation) continue;
    if (
      operation &&
      typeof operation === 'object' &&
      'deprecated' in operation &&
      operation.deprecated === true
    ) {
      continue;
    }
    const endpointUnionExpr = operationToEndpointUnionExpr({
      operation: resolveMaybeRef(operation) as OperationObject,
      pathItem: resolvedPathItem,
    });

    methodLines.push(
      `  ${JSON.stringify(`$${methodName}`)}: ${endpointUnionExpr};`,
    );
  }

  if (!methodLines.length) continue;
  honoSchemaLines.push(`  ${JSON.stringify(honoPath)}: {`);
  honoSchemaLines.push(...methodLines.map((l) => `    ${l.trim()}`));
  honoSchemaLines.push('  };');
}

honoSchemaLines.push('};');

const output = [
  '/**',
  ' * This file was auto-generated by scripts/generate-hono-app.ts.',
  ' * DO NOT EDIT BY HAND.',
  ' */',
  '',
  `import type { Hono } from 'hono';`,
  `import type { components } from '../schema';`,
  '',
  honoSchemaLines.join('\n'),
  '',
  'export type App = Hono<{}, Endpoints>;',
  '',
].join('\n');

await fs.writeFile(outPath, output, 'utf-8');
console.log(`Wrote ${path.relative(repoRoot, outPath)}`);
