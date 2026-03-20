import {
  astToString,
  createRef,
  resolveRef,
  scanDiscriminators,
  transformSchemaObject,
} from 'openapi-typescript';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outPath = path.join(repoRoot, 'src', 'hono-app.ts');

const SOURCE_URL = 'https://api.are.na/v3/openapi.json';

const methodOrder = /** @type {const} */ ([
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
]);

function replaceParams(openApiPath) {
  return openApiPath.replace(/\{([^}]+)\}/g, (_, name) => `:${name}`);
}

function mapContentTypeToOutputFormat(contentType) {
  // Hono's known output formats are: json | text | redirect, but it allows other strings.
  const ct = contentType.toLowerCase();
  if (ct.includes('json')) return 'json';
  if (ct.startsWith('text/')) return 'text';
  return ct;
}

function isObject(x) {
  return x !== null && typeof x === 'object' && !Array.isArray(x);
}

function asString(node) {
  // openapi-typescript's astToString is stable enough to inline into type expressions.
  return astToString(node).trim();
}

function wrapIfUnion(typeExpr) {
  return /\s\|\s/.test(typeExpr) ? `(${typeExpr})` : typeExpr;
}

async function resolveSource(input) {
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

function toTSLiteralString(value) {
  // Works for numbers and strings; status codes should be numbers.
  return typeof value === 'number' ? String(value) : JSON.stringify(value);
}

const argv = process.argv.slice(2);
const argSource = argv.find((a) => a.startsWith('--source='))?.split('=')[1];

const { openapiJson } = await resolveSource(argSource);
// We intentionally avoid generating openapi-typescript's full `schema.ts`.
// For this generator, we only need schema.paths and then we transform request/response schemas into Hono endpoint types.
const schema = openapiJson;

const ctx = {
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
  silent: false,
  inject: undefined,
  transform: undefined,
  transformProperty: undefined,
  makePathsEnum: false,
  generatePathParams: false,
  readWriteMarkers: false,
  resolve($ref) {
    return resolveRef(schema, $ref, { silent: ctx.silent });
  },
};

function resolveMaybeRef(obj) {
  if (isObject(obj) && '$ref' in obj) {
    return ctx.resolve(obj.$ref);
  }
  return obj;
}

/**
 * Transform an OpenAPI schema-like object into a TS type expression string.
 */
function schemaToTypeExpr(schemaObject, options = {}) {
  const node = transformSchemaObject(schemaObject, {
    ...options,
    ctx,
    path: options.path ?? '#',
  });
  return asString(node);
}

function parameterListToPathParams(pathItem, operation) {
  const out = [];
  const all = [
    ...(pathItem?.parameters ?? []),
    ...(operation?.parameters ?? []),
  ];

  for (const p of all) {
    const resolved = resolveMaybeRef(p);
    if (!resolved || typeof resolved !== 'object') continue;
    if (resolved.in !== 'path') continue;
    if (!resolved.name) continue;
    out.push({
      name: String(resolved.name),
      // Parameter objects can define `schema` (most common) or `content` (less common).
      schema: resolved.schema ?? undefined,
    });
  }
  return out;
}

function requestBodyToInputUnionExpr(requestBody) {
  if (!requestBody || requestBody === true) return `{}`;
  const resolved = resolveMaybeRef(requestBody);
  if (!resolved || !resolved.content || typeof resolved.content !== 'object')
    return `{}`;

  const members = [];
  for (const [contentType, mediaType] of Object.entries(resolved.content)) {
    const resolvedMediaType = resolveMaybeRef(mediaType);
    if (!resolvedMediaType || typeof resolvedMediaType !== 'object') continue;

    const schemaObject = resolvedMediaType.schema ?? undefined;
    const typeExpr = schemaToTypeExpr(schemaObject, {
      path: createRef(['requestBody', contentType, 'schema']),
    });

    const target =
      contentType === 'application/x-www-form-urlencoded' ? 'form' : 'json';
    members.push(`{ ${target}: ${typeExpr} }`);
  }

  if (!members.length) return `{}`;
  return members.length === 1 ? members[0] : members.join(' | ');
}

function buildInputExpr({ inputBodyExpr, pathParams }) {
  const parts = [];
  if (inputBodyExpr && inputBodyExpr !== '{}')
    parts.push(wrapIfUnion(inputBodyExpr));
  if (pathParams.length) {
    const record = pathParams
      .map((p) => {
        const paramExpr = schemaToTypeExpr(p.schema, {
          path: createRef(['parameters', 'path', p.name]),
        });
        return `${p.name}: ${paramExpr}`;
      })
      .join('; ');
    parts.push(`{ param: { ${record} } }`);
  }

  if (!parts.length) return `{}`;
  if (parts.length === 1) return parts[0];
  return `${parts[0]} & ${parts[1]}`;
}

function operationToEndpointUnionExpr({ operation, pathItem }) {
  const pathParams = parameterListToPathParams(pathItem, operation);
  const inputBodyExpr = requestBodyToInputUnionExpr(operation?.requestBody);
  const inputExpr = buildInputExpr({ inputBodyExpr, pathParams });

  const responses = operation?.responses ?? {};
  if (!isObject(responses)) return `{}`;

  const endpointMembers = [];
  for (const [statusKey, responseValue] of Object.entries(responses)) {
    if (!/^\d+$/.test(statusKey)) continue;
    const statusCode = Number(statusKey);

    const resolvedResponse = resolveMaybeRef(responseValue);
    const content = resolvedResponse?.content;

    if (content && isObject(content) && Object.keys(content).length) {
      for (const [contentType, mediaType] of Object.entries(content)) {
        const resolvedMediaType = resolveMaybeRef(mediaType);
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
honoSchemaLines.push('type HonoSchema = {');

for (const [openApiPath, pathItem] of Object.entries(schema.paths ?? {})) {
  const resolvedPathItem = resolveMaybeRef(pathItem);
  if (!resolvedPathItem || typeof resolvedPathItem !== 'object') continue;

  const honoPath = replaceParams(openApiPath);
  const methodLines = [];

  for (const methodName of methodOrder) {
    const operation = resolvedPathItem[methodName];
    if (!operation) continue;
    if (resolvedPathItem.deprecated === true) {
      // If whole path item is deprecated, skip everything. (Rare, but consistent.)
      continue;
    }
    if (
      operation &&
      typeof operation === 'object' &&
      'deprecated' in operation &&
      operation.deprecated === true
    ) {
      continue;
    }
    const endpointUnionExpr = operationToEndpointUnionExpr({
      operation: resolveMaybeRef(operation),
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
  ' * This file was auto-generated by scripts/generate-hono-app.mjs.',
  ' * DO NOT EDIT BY HAND.',
  ' */',
  '',
  `import type { Hono } from 'hono';`,
  `import type { components } from './schema';`,
  '',
  honoSchemaLines.join('\n'),
  '',
  'export type App = Hono<{}, HonoSchema>;',
  '',
].join('\n');

await fs.writeFile(outPath, output, 'utf-8');
console.log(`Wrote ${path.relative(repoRoot, outPath)}`);
