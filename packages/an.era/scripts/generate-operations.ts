import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';

type HttpMethod =
  | 'get'
  | 'put'
  | 'post'
  | 'delete'
  | 'options'
  | 'head'
  | 'patch'
  | 'trace';

type OpenApiOperation = { operationId?: string };
type OpenApiPaths = Record<
  string,
  Partial<Record<HttpMethod, OpenApiOperation>>
>;
type OpenApiDocument = { paths?: OpenApiPaths };

const pkgRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outPath = path.join(pkgRoot, 'src', 'operations', 'generated.ts');
const SOURCE_URL = 'https://api.are.na/v3/openapi.json';

const methodOrder: HttpMethod[] = [
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
];

function replaceParams(openApiPath: string): string {
  return openApiPath.replace(/\{([^}]+)\}/g, (_, name) => `:${name}`);
}

function toPathSegments(pathname: string): string[] {
  const withColons = replaceParams(pathname);
  return withColons.split('/').filter(Boolean);
}

function toOperationChain(pathname: string, method: HttpMethod): string[] {
  return [...toPathSegments(pathname), `$${method}`];
}

/** TypeScript indexed access: `['v3']['blocks']['$get']` */
function toClientIndexedType(chain: readonly string[]): string {
  return chain.map((seg) => `[${JSON.stringify(seg)}]`).join('');
}

function tsInterfacePropertyKey(operationId: string): string {
  return /^[A-Za-z_$][\w$]*$/.test(operationId)
    ? operationId
    : JSON.stringify(operationId);
}

function lowerFirst(s: string): string {
  return s.length ? s[0]!.toLowerCase() + s.slice(1) : s;
}

function capitalize(s: string): string {
  return s.length ? s[0]!.toUpperCase() + s.slice(1) : s;
}

function splitCamelCase(input: string): string[] {
  // Best-effort tokenization: getBlockComments -> ["get","Block","Comments"]
  const parts = input.match(/[A-Z]+(?![a-z])|[A-Z]?[a-z]+|[0-9]+/g);
  return parts ?? [input];
}

/** Path segment names from `:id`-style segments (excludes `$get`, etc.). */
function pathParamNamesFromChain(chain: readonly string[]): string[] {
  return chain
    .filter((s) => s.startsWith(':') && !s.startsWith('$'))
    .map((s) => s.slice(1));
}

async function resolveOpenApi(input?: string): Promise<OpenApiDocument> {
  const source = input ?? SOURCE_URL;

  if (source.startsWith('http://') || source.startsWith('https://')) {
    const res = await fetch(source);
    if (!res.ok)
      throw new Error(
        `Failed to fetch OpenAPI: ${res.status} ${res.statusText}`,
      );
    return (await res.json()) as OpenApiDocument;
  }

  return JSON.parse(await fs.readFile(source, 'utf-8')) as OpenApiDocument;
}

const argv = process.argv.slice(2);
const argSource = argv.find((a) => a.startsWith('--source='))?.split('=')[1];

const openapi = await resolveOpenApi(argSource);
const paths = openapi.paths ?? {};

const byId = new Map<string, readonly string[]>();
const warnings: string[] = [];

for (const [pathname, pathItem] of Object.entries(paths)) {
  if (!pathItem || typeof pathItem !== 'object') continue;
  for (const method of methodOrder) {
    const op = pathItem[method];
    if (!op || typeof op !== 'object') continue;
    const operationId = op.operationId;
    if (typeof operationId !== 'string' || !operationId) {
      warnings.push(
        `skip ${method.toUpperCase()} ${pathname}: missing operationId`,
      );
      continue;
    }
    const chain = toOperationChain(pathname, method);
    if (byId.has(operationId)) {
      warnings.push(
        `duplicate operationId "${operationId}" (${method.toUpperCase()} ${pathname}); keeping last`,
      );
    }
    byId.set(operationId, chain);
  }
}

// Keep insertion order from OpenAPI traversal (more stable vs intent).
const sortedIds = [...byId.keys()];

type LeafInfo = { params: Set<string>; methods: Set<string> };
type Categories = Map<string, Map<string, LeafInfo>>; // category -> remainingString -> { param, method }
const categories: Categories = new Map();
const noParamOps = new Map<string, string>(); // operationId -> methodType

for (const id of sortedIds) {
  const chain = byId.get(id)!;
  const paramNames = pathParamNamesFromChain(chain);
  const methodType = `Client${toClientIndexedType(chain)}`;

  if (paramNames.length === 0) {
    noParamOps.set(id, methodType);
    continue;
  }

  const firstParamName = paramNames[0]!;
  const tokens = splitCamelCase(id);

  const categoryKey =
    tokens.length >= 2 ? lowerFirst(tokens[1]!) : lowerFirst(tokens[0]!);

  const leafTokens =
    tokens.length >= 2 ? [tokens[0]!, ...tokens.slice(2)] : [tokens[0]!];

  const leafKey =
    leafTokens.length === 0
      ? lowerFirst(id)
      : lowerFirst(leafTokens[0]!) +
        leafTokens
          .slice(1)
          .map((t) => capitalize(lowerFirst(t)))
          .join('');

  let leafMap = categories.get(categoryKey);
  if (!leafMap) {
    leafMap = new Map();
    categories.set(categoryKey, leafMap);
  }

  let leafInfo = leafMap.get(leafKey);
  if (!leafInfo) {
    leafInfo = { params: new Set(), methods: new Set() };
    leafMap.set(leafKey, leafInfo);
  }
  leafInfo.params.add(firstParamName);
  leafInfo.methods.add(methodType);
}

const operationsTypeLines: string[] = ['export type Operations = {'];

for (const [categoryKey, leafMap] of categories) {
  operationsTypeLines.push(`  ${tsInterfacePropertyKey(categoryKey)}: {`);
  for (const [leafKey, leafInfo] of leafMap) {
    const params = [...leafInfo.params].sort((a, b) => a.localeCompare(b));
    const methods = [...leafInfo.methods].sort((a, b) => a.localeCompare(b));
    const variantCount = Math.max(params.length, methods.length);

    const variants: string[] = [];
    for (let i = 0; i < variantCount; i++) {
      const p = params[Math.min(i, params.length - 1)]!;
      const m = methods[Math.min(i, methods.length - 1)]!;
      variants.push(`{ param: ${JSON.stringify(p)}; method: ${m} }`);
    }

    operationsTypeLines.push(
      `    ${tsInterfacePropertyKey(leafKey)}: ${variants.join(' | ')};`,
    );
  }
  operationsTypeLines.push('  }');
}

for (const [operationId, methodType] of noParamOps) {
  operationsTypeLines.push(
    `  ${tsInterfacePropertyKey(operationId)}: ${methodType}`,
  );
}

operationsTypeLines.push('}');

const lines: string[] = [
  '/**',
  ' * Auto-generated by scripts/generate-operations.ts.',
  ' * Do not edit by hand.',
  ' */',
  '',
  "import type { ac } from '../client';",
  '',
  'type Client = ReturnType<typeof ac>;',
  '',
  ...operationsTypeLines,
  '',
  'export const OPERATIONS: Map<string, readonly string[]> = new Map([',
  ...sortedIds.map((id) => {
    const segs = byId.get(id)!;
    const inner = segs.map((s) => JSON.stringify(s)).join(', ');
    return `  ['${id}', [${inner}]],`;
  }),
  ']);',
  '',
];

if (warnings.length) {
  console.warn('Warnings:\n', warnings.map((w) => `  - ${w}`).join('\n'));
}

await fs.mkdir(path.dirname(outPath), { recursive: true });
await fs.writeFile(outPath, lines.join('\n'), 'utf-8');
console.log(`Wrote ${path.relative(pkgRoot, outPath)}`);
