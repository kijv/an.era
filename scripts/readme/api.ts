/**
 * API reference section: loads OpenAPI, collects operations/sections,
 * schema usages, and builds operation blocks (parameters, request body, responses).
 */
import type { Block, TocEntry } from './types';
import type { HttpMethods } from 'oas/types';
import OASNormalize from 'oas-normalize';
import Oas from 'oas';
import { extractRefName } from '../openapi/util';

const UNION = ' or ';
const INTERSECTION = ' and ';

// --- Types ---
export type OpInfo = {
  path: string;
  method: string;
  operationId: string;
  summary: string | undefined;
  description: string | undefined;
  tags: string[];
  parameters: Array<{
    name: string;
    in: string;
    description?: string;
    type?: string;
    schemaRef?: string;
    schema?: unknown;
  }>;
  requestBodyRef?: string;
  requestBodySchema?: unknown;
  responses: Array<{
    status: string;
    description?: string;
    contentRef?: string;
    contentSchema?: unknown;
  }>;
};

export type Section =
  | { type: 'group'; tag: string; ops: OpInfo[] }
  | { type: 'ungrouped'; op: OpInfo };

export type SchemaUsage = {
  sectionSchemaId: string;
  anchor: string;
  label: string;
  operationId: string;
};

export type ApiReference = {
  sections: Section[];
  operationsByKey: Record<string, OpInfo>;
  allSchemaNames: string[];
  schemaUsages: Map<string, SchemaUsage[]>;
  schemaContent: Map<string, unknown>;
  componentsSchemas: Record<string, unknown> | undefined;
  getScopedName: (operationId: string, tag: string) => string;
  getUngroupedOpDisplayName: (op: OpInfo) => string;
  getGroupedForm: (op: OpInfo, tag?: string) => string | null;
  buildOperationBlocks: (
    op: OpInfo,
    subNum: string,
    headingLevel: 4 | 5,
    title: string,
    tocEntries: TocEntry[],
    groupedForm?: string | null,
  ) => Block[];
  describeSchema: (
    schema: unknown,
    indent?: string,
    linkable?: Set<string>,
    options?: { descriptionOverride?: string; omitDescription?: boolean },
  ) => string;
  refSchemaAnchor: (schemaName: string) => string;
  UNION: string;
};

// --- Helpers: scoped name ---
function splitCamelCase(str: string): string[] {
  const terms: string[] = [];
  let current = '';
  for (const char of str) {
    if (char === char.toUpperCase() && char !== char.toLowerCase()) {
      if (current) terms.push(current);
      current = char;
    } else {
      current += char;
    }
  }
  if (current) terms.push(current);
  return terms;
}

function tagMatchesTerm(tag: string, term: string): boolean {
  const tagLower = tag.toLowerCase();
  const termLower = term.toLowerCase();
  return (
    tagLower === termLower ||
    tagLower === termLower + 's' ||
    tagLower + 's' === termLower
  );
}

/** Term from operationId that matches the tag (e.g. "Block" for tag "Blocks"); used as group key (lowercase). */
function getTermMatchingTag(operationId: string, tag: string): string | null {
  const terms = splitCamelCase(operationId);
  return terms.find((t) => tagMatchesTerm(tag, t)) ?? null;
}

function getScopedName(operationId: string, tag: string): string {
  const terms = splitCamelCase(operationId);
  const filtered = terms.filter((t) => !tagMatchesTerm(tag, t));
  if (filtered.length === 0) return operationId;
  const first = filtered[0]!;
  return (
    first.toLowerCase() +
    filtered
      .slice(1)
      .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
      .join('')
  );
}

// --- Grouping logic ---
function getProcessedKey(key: string, method: string): string {
  const methodUpper = method.toUpperCase();
  const keyUpper = key.slice(0, method.length).toUpperCase();
  if (keyUpper === methodUpper) {
    const rest = key.slice(method.length);
    return rest.charAt(0).toLowerCase() + rest.slice(1);
  }
  return key.charAt(0).toLowerCase() + key.slice(1);
}

function getAllTerms(processedKey: string): string[] {
  return splitCamelCase(processedKey).map((t) => t.toLowerCase());
}

function extractResourcePath(path: string): string {
  const segments = path.split('/');
  let result = '';
  for (const segment of segments) {
    if (segment.startsWith('{') && segment.endsWith('}')) {
      result += (result ? '/' : '') + segment;
      return result;
    }
    result += (result ? '/' : '') + segment;
  }
  return result;
}

function pathsShareResourcePrefix(path1: string, path2: string): boolean {
  return extractResourcePath(path1) === extractResourcePath(path2);
}

function tagsShareCommon(
  tags1: readonly string[],
  tags2: readonly string[],
): boolean {
  if (tags1.length === 0 && tags2.length === 0) return true;
  return tags1.some((t) => tags2.includes(t));
}

function getParamNames(op: OpInfo): string[] {
  return op.parameters.map((p) => p.name);
}

function hasNonEmptyParameters(op: OpInfo): boolean {
  return op.parameters.length > 0;
}

function sharesParameterKey(op1: OpInfo, op2: OpInfo): boolean {
  const names1 = new Set(getParamNames(op1));
  return getParamNames(op2).some((n) => names1.has(n));
}

function getOpsWithTermAndSharedTag(
  operationsByKey: Record<string, OpInfo>,
  currentKey: string,
  term: string,
): OpInfo[] {
  const currentOp = operationsByKey[currentKey];
  if (!currentOp) return [];
  const result: OpInfo[] = [];
  for (const [key, op] of Object.entries(operationsByKey)) {
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

function hasSharedTagWithSameTermOp(
  operationsByKey: Record<string, OpInfo>,
  currentKey: string,
  term: string,
): boolean {
  const currentOp = operationsByKey[currentKey];
  if (!currentOp) return false;
  const allOps = getOpsWithTermAndSharedTag(operationsByKey, currentKey, term);
  const otherOps = allOps.filter((o) => o !== currentOp);
  if (otherOps.length === 0) return false;
  const currentParamCount = currentOp.parameters.length;
  const opsWithMoreParams = otherOps.filter(
    (op) => op.parameters.length > currentParamCount,
  );
  if (opsWithMoreParams.length === 0) return true;
  for (const op of opsWithMoreParams) {
    if (!sharesParameterKey(currentOp, op)) return false;
  }
  return true;
}

/** If the inner key starts with the HTTP method and the remainder is non-empty, return the remainder (e.g. getContents → contents); else return the key as-is (e.g. get → get). */
function innerKeyWithoutMethod(innerKey: string, method: string): string {
  const methodLower = method.toLowerCase();
  const keyLower = innerKey.toLowerCase();
  if (keyLower.startsWith(methodLower) && innerKey.length > method.length) {
    const rest = innerKey.slice(method.length);
    return rest.charAt(0).toLowerCase() + rest.slice(1);
  }
  return innerKey;
}

/** Inner operation key with term removed: before + after in camelCase (e.g. getBlockConnections → getConnections). */
function getStrippedKey(
  processedKey: string,
  term: string,
  method: string,
): string {
  const terms = splitCamelCase(processedKey);
  const termLower = term.toLowerCase();
  const termIndex = terms.findIndex((t) => t.toLowerCase() === termLower);
  if (termIndex === -1) return method;
  const before = terms.slice(0, termIndex);
  const after = terms.slice(termIndex + 1);
  const combined = [...before, ...after];
  if (combined.length === 0) return method;
  const first = combined[0]!;
  return (
    first.toLowerCase() +
    combined
      .slice(1)
      .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
      .join('')
  );
}

export function getUngroupedOpDisplayName(
  op: OpInfo,
  operationsByKey: Record<string, OpInfo>,
): string {
  if (!hasNonEmptyParameters(op)) return op.operationId;
  const processedKey = getProcessedKey(op.operationId, op.method);
  const terms = getAllTerms(processedKey);
  for (const term of terms) {
    if (hasSharedTagWithSameTermOp(operationsByKey, op.operationId, term)) {
      const strippedKey = getStrippedKey(processedKey, term, op.method);
      const groupName = term.charAt(0).toUpperCase() + term.slice(1);
      const localName =
        strippedKey.charAt(0).toUpperCase() + strippedKey.slice(1);
      return `${groupName}.${localName} (plain: \`${op.operationId}\`)`;
    }
  }
  return op.operationId;
}

/** Parameter names that are common to all ops in the same group (shared group params). */
function getGroupParamNames(
  op: OpInfo,
  operationsByKey: Record<string, OpInfo>,
  term: string,
): string[] {
  const groupOps = getOpsWithTermAndSharedTag(
    operationsByKey,
    op.operationId,
    term,
  );
  if (groupOps.length === 0) return [];
  const first = groupOps[0]!;
  let common = new Set(getParamNames(first));
  for (let i = 1; i < groupOps.length; i++) {
    const names = new Set(getParamNames(groupOps[i]!));
    common = new Set([...common].filter((n) => names.has(n)));
  }
  return [...common];
}

/**
 * Returns the grouped form for the block quote, or null if no grouped form.
 * Matches runtime grouping: tag.term({ groupParams }).strippedKey (e.g. Blocks.block({ id }).getConnections)
 * or tag.scopedName when the op has no parameters (e.g. Blocks.create).
 */
export function getGroupedForm(
  op: OpInfo,
  operationsByKey: Record<string, OpInfo>,
  tag?: string,
): string | null {
  const processedKey = getProcessedKey(op.operationId, op.method);

  if (tag != null) {
    const displayTag = tag.toLowerCase();
    const scopedName = getScopedName(op.operationId, tag);
    if (scopedName === op.operationId) return null;
    if (op.parameters.length > 0) {
      const term = getTermMatchingTag(op.operationId, tag);
      if (!term) {
        const paramList = `({ ${op.parameters.map((p) => p.name).join(', ')} })`;
        return `${displayTag}.${scopedName}${paramList}`;
      }
      const termLower = term.toLowerCase();
      const strippedKey = getStrippedKey(op.operationId, term, op.method);
      const innerKey = innerKeyWithoutMethod(strippedKey, op.method);
      const groupParams = getGroupParamNames(op, operationsByKey, termLower);
      const groupParamList =
        groupParams.length > 0 ? `({ ${groupParams.join(', ')} })` : '';
      const opParamNames = op.parameters
        .map((p) => p.name)
        .filter((n) => !groupParams.includes(n));
      const opParamList =
        opParamNames.length > 0 ? `({ ${opParamNames.join(', ')} })` : '()';
      return `${displayTag}.${termLower}${groupParamList}.${innerKey}${opParamList}`;
    }
    return `${displayTag}.${scopedName}()`;
  }

  if (!hasNonEmptyParameters(op)) return null;
  const terms = getAllTerms(processedKey);
  for (const term of terms) {
    if (hasSharedTagWithSameTermOp(operationsByKey, op.operationId, term)) {
      const strippedKey = getStrippedKey(op.operationId, term, op.method);
      const innerKey = innerKeyWithoutMethod(strippedKey, op.method);
      const displayTag = (op.tags[0] ?? term).toLowerCase();
      const termLower = term.toLowerCase();
      if (op.parameters.length > 0) {
        const groupParams = getGroupParamNames(op, operationsByKey, termLower);
        const groupParamList =
          groupParams.length > 0 ? `({ ${groupParams.join(', ')} })` : '';
        const opParamNames = op.parameters
          .map((p) => p.name)
          .filter((n) => !groupParams.includes(n));
        const opParamList =
          opParamNames.length > 0 ? `({ ${opParamNames.join(', ')} })` : '()';
        return `${displayTag}.${termLower}${groupParamList}.${innerKey}${opParamList}`;
      }
      return `${displayTag}.${innerKey.charAt(0).toUpperCase() + innerKey.slice(1)}()`;
    }
  }
  return null;
}

function slugForAnchor(sectionId: string, schemaName: string): string {
  const idPart = sectionId.replace(/\./g, '-');
  return `${idPart}-${schemaName}`
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// --- Schema/format helpers ---
function maybeLinkSchemaName(name: string, linkable: Set<string>): string {
  if (linkable.has(name)) return `[${name}](#${refSchemaAnchor(name)})`;
  return name;
}

function refSchemaAnchor(schemaName: string): string {
  return `referenced-schemas-${schemaName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')}`;
}

function capitalizeType(s: string): string {
  if (s.startsWith('[') || s.length === 0) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatSchemaOption(
  opt: Record<string, unknown>,
  linkable: Set<string>,
): string {
  if (opt?.$ref && typeof opt.$ref === 'string')
    return maybeLinkSchemaName(extractRefName(opt.$ref), linkable);
  if (opt?.type === 'null') return capitalizeType('null');
  if (
    opt?.type === 'object' &&
    opt?.properties &&
    typeof opt.properties === 'object'
  )
    return capitalizeType('object');
  return capitalizeType((opt?.type as string) ?? 'object');
}

function formatPropertyType(
  val: Record<string, unknown>,
  linkable: Set<string>,
): string {
  if (val?.$ref && typeof val.$ref === 'string') {
    const name = extractRefName(val.$ref);
    return maybeLinkSchemaName(name, linkable);
  }
  const composition: Array<{
    key: 'oneOf' | 'allOf' | 'anyOf';
    connector: string;
  }> = [
    { key: 'oneOf', connector: UNION },
    { key: 'allOf', connector: INTERSECTION },
    { key: 'anyOf', connector: UNION },
  ];
  for (const { key, connector } of composition) {
    const opts = val?.[key] as Record<string, unknown>[] | undefined;
    if (!Array.isArray(opts) || opts.length === 0) continue;
    const parts = opts.map((v) =>
      formatSchemaOption(v as Record<string, unknown>, linkable),
    );
    return parts.length > 0 ? parts.join(connector) : capitalizeType('object');
  }
  if (val?.type === 'array') {
    const items = val.items as Record<string, unknown> | undefined;
    let itemType: string;
    if (items == null) {
      itemType = capitalizeType('any');
    } else if (
      (items.type as string) === 'object' &&
      items.properties &&
      typeof items.properties === 'object'
    ) {
      const props = items.properties as Record<string, Record<string, unknown>>;
      const refKeys = Object.entries(props)
        .filter(([, v]) => v?.$ref != null)
        .map(([k]) => k);
      if (refKeys.length === 1) {
        const refVal = props[refKeys[0]!];
        const refName = extractRefName((refVal as { $ref: string }).$ref);
        itemType = `Object (${refKeys[0]}: ${maybeLinkSchemaName(refName, linkable)})`;
      } else {
        itemType = formatPropertyType(items, linkable);
      }
    } else {
      itemType = formatPropertyType(items, linkable);
    }
    return `List of ${capitalizeType(itemType)}`;
  }
  const type = val?.type;
  if (Array.isArray(type)) {
    return type.length > 0
      ? type.map((t) => capitalizeType(String(t))).join(UNION)
      : capitalizeType('object');
  }
  return capitalizeType((type as string) ?? 'object');
}

const ADDITIONAL_KEYS_PREFIX = '**Additional properties:**';

function formatAdditionalPropertiesLine(
  additionalProps: unknown,
  indent: string,
  linkable: Set<string>,
): string | null {
  if (additionalProps === undefined) return null;
  const prefix = `${indent}- ${ADDITIONAL_KEYS_PREFIX}`;
  let suffix: string;
  if (additionalProps === false) suffix = 'not allowed';
  else if (additionalProps === true) suffix = 'allowed (Any value)';
  else if (additionalProps && typeof additionalProps === 'object') {
    suffix = `values must be ${formatPropertyType(
      additionalProps as Record<string, unknown>,
      linkable,
    )}`;
  } else return null;
  return `${prefix} ${suffix}`;
}

function describeSchemaProperties(
  props: Record<string, Record<string, unknown>>,
  indent: string,
  linkable: Set<string>,
): string[] {
  const lines: string[] = [];
  for (const [key, val] of Object.entries(props)) {
    const desc = val?.description;
    const ex = val?.example;
    const typeStr = formatPropertyType(
      val as Record<string, unknown>,
      linkable,
    );
    const formatPart =
      val?.format != null && typeof val.format === 'string'
        ? ` (${val.format})`
        : '';
    const hasNestedProps =
      !val?.$ref &&
      !val?.oneOf &&
      !val?.allOf &&
      !val?.anyOf &&
      (val?.type as string) === 'object' &&
      val?.properties &&
      typeof val.properties === 'object' &&
      Object.keys(val.properties as object).length > 0;
    let line = `${indent}- \`${key}\`: ${typeStr}${formatPart}`;
    if (desc != null && typeof desc === 'string') line += ` — ${desc}`;
    if (ex !== undefined)
      line += ` (Example: \`${JSON.stringify(ex).replaceAll(/(^"|"$)/g, '')}\`)`;
    lines.push(line);
    if (hasNestedProps) {
      const nested = val.properties as Record<string, Record<string, unknown>>;
      lines.push(...describeSchemaProperties(nested, indent + '  ', linkable));
      const apLine = formatAdditionalPropertiesLine(
        val.additionalProperties,
        indent + '  ',
        linkable,
      );
      if (apLine) lines.push(apLine);
    }
  }
  return lines;
}

function describeSchemaImpl(
  schema: unknown,
  indent = '',
  linkable: Set<string> = new Set(),
  options?: { descriptionOverride?: string; omitDescription?: boolean },
): string {
  if (schema == null) return '';
  const s = schema as Record<string, unknown>;
  const lines: string[] = [];
  if (!options?.omitDescription) {
    const desc =
      options?.descriptionOverride ??
      (typeof s.description === 'string' ? s.description : undefined);
    if (desc != null && desc !== '') {
      lines.push(`${indent}${desc}`);
    }
  }
  if (s.format != null && typeof s.format === 'string') {
    lines.push(`${indent}- **format:** \`${s.format}\``);
  }
  const compositionKeys: Array<{
    key: 'oneOf' | 'allOf' | 'anyOf';
    connector: string;
  }> = [
    { key: 'oneOf', connector: UNION },
    { key: 'allOf', connector: INTERSECTION },
    { key: 'anyOf', connector: UNION },
  ];
  function pushObjectOptionLines(opt: Record<string, unknown>): void {
    if (
      opt?.type !== 'object' ||
      !opt?.properties ||
      typeof opt.properties !== 'object' ||
      Object.keys(opt.properties as object).length === 0
    )
      return;
    const subIndent = indent + '  ';
    lines.push(
      ...describeSchemaProperties(
        opt.properties as Record<string, Record<string, unknown>>,
        subIndent,
        linkable,
      ),
    );
    const apLine = formatAdditionalPropertiesLine(
      opt.additionalProperties,
      subIndent,
      linkable,
    );
    if (apLine) lines.push(apLine);
  }

  for (const { key, connector } of compositionKeys) {
    const opts = s[key] as Record<string, unknown>[] | undefined;
    if (!Array.isArray(opts) || opts.length === 0) continue;
    const parts = opts.map((v) => formatSchemaOption(v, linkable));
    lines.push(`${indent}- ${parts.join(connector)}`);
    for (const opt of opts) pushObjectOptionLines(opt);
  }
  if (s.properties && typeof s.properties === 'object') {
    const props = s.properties as Record<string, Record<string, unknown>>;
    const propLines = describeSchemaProperties(props, indent, linkable);
    lines.push(...propLines);
    const apLine = formatAdditionalPropertiesLine(
      s.additionalProperties,
      indent,
      linkable,
    );
    if (apLine) lines.push(apLine);
  }
  if (s.example !== undefined) {
    lines.push(`${indent}- **Example**: \`${JSON.stringify(s.example)}\``);
  }
  if (s.enum) {
    const enumArr = s.enum as unknown[];
    for (const e of enumArr) {
      lines.push(`${indent}- \`${String(e)}\``);
    }
  }
  return lines.join('\n');
}

type OperationSectionLines = {
  paramLines: string[];
  requestBodyLines: string[];
  responseLines: string[];
};

function formatParamSummaryLine(
  p: OpInfo['parameters'][0],
  formatSchemaRefFn: (name: string) => string,
): { typeDisplay: string; descPart: string } {
  const typeOrSchema =
    p.schemaRef != null ? formatSchemaRefFn(p.schemaRef) : (p.type ?? '');
  const typeDisplay =
    typeOrSchema && typeOrSchema.startsWith('[')
      ? `: ${typeOrSchema}`
      : typeOrSchema
        ? `: \`${typeOrSchema}\``
        : '';
  const descPart = p.description ? ` — ${p.description}` : '';
  return { typeDisplay, descPart };
}

function pushSchemaBlock(
  ref: string,
  schema: unknown,
  nextSchemaId: () => string,
  headerLine: (id: string, link: string) => string,
  linkableSchemaNames: Set<string>,
  nonUniqueSchemaNames: Set<string>,
  schemaOptions?: {
    descriptionOverride?: string;
    omitDescription?: boolean;
    expandSchema?: boolean;
  },
): string[] {
  const lines: string[] = [];
  const sectionSchemaId = nextSchemaId();
  const anchor = slugForAnchor(sectionSchemaId, ref);
  const link = linkableSchemaNames.has(ref)
    ? `[${ref}](#${refSchemaAnchor(ref)})`
    : ref;
  lines.push(`<a id="${anchor}"></a>`);
  lines.push(headerLine(sectionSchemaId, link));
  const shouldExpand =
    schemaOptions?.expandSchema !== false &&
    !nonUniqueSchemaNames.has(ref) &&
    schema;
  if (shouldExpand)
    lines.push(
      describeSchemaImpl(schema, '  ', linkableSchemaNames, schemaOptions),
    );
  lines.push('');
  return lines;
}

function renderOperationSection(
  op: OpInfo,
  nextSchemaId: () => string,
  linkableSchemaNames: Set<string>,
  nonUniqueSchemaNames: Set<string>,
): OperationSectionLines {
  const formatSchemaRefFn = (name: string) =>
    linkableSchemaNames.has(name)
      ? `[${name}](#${refSchemaAnchor(name)})`
      : name;

  const paramLines: string[] = [];
  for (const p of op.parameters) {
    const { typeDisplay, descPart } = formatParamSummaryLine(
      p,
      formatSchemaRefFn,
    );
    paramLines.push(`- **${p.name}** (${p.in})${typeDisplay}${descPart}`);
    paramLines.push('');
  }
  for (const p of op.parameters) {
    if (p.schemaRef)
      paramLines.push(
        ...pushSchemaBlock(
          p.schemaRef,
          p.schema,
          nextSchemaId,
          (id, link) => `###### ${id} Parameter: ${p.name} (${p.in}): ${link}`,
          linkableSchemaNames,
          nonUniqueSchemaNames,
        ),
      );
  }

  const requestBodyLines: string[] = [];
  if (op.requestBodyRef)
    requestBodyLines.push(
      ...pushSchemaBlock(
        op.requestBodyRef,
        op.requestBodySchema,
        nextSchemaId,
        (id, link) => `#### ${id} Request body: ${link}`,
        linkableSchemaNames,
        nonUniqueSchemaNames,
      ),
    );

  const responseLines: string[] = [];
  for (const res of op.responses) {
    if (res.contentRef) {
      const descPart =
        res.description != null && res.description !== ''
          ? ` — ${res.description}`
          : '';
      responseLines.push(
        ...pushSchemaBlock(
          res.contentRef,
          res.contentSchema,
          nextSchemaId,
          (id, link) => `###### ${id} \`${res.status}\`: ${link}${descPart}`,
          linkableSchemaNames,
          nonUniqueSchemaNames,
          { omitDescription: true, expandSchema: false },
        ),
      );
    }
  }
  return { paramLines, requestBodyLines, responseLines };
}

function addHeading(
  blocks: Block[],
  tocEntries: TocEntry[],
  level: number,
  text: string,
  anchor?: string,
): void {
  tocEntries.push({ level, text, ...(anchor && { anchor }) });
  blocks.push({ type: 'heading', level, text });
}

function addContent(blocks: Block[], lines: string[]): void {
  if (lines.length > 0) blocks.push({ type: 'content', lines });
}

function addCollapsible(
  blocks: Block[],
  summary: string,
  innerBlocks: Block[],
): void {
  if (innerBlocks.length > 0)
    blocks.push({ type: 'collapsible', summary, blocks: innerBlocks });
}

/** Build blocks for one operation (heading, description, parameters, request body, responses). */
function buildOperationBlocks(
  op: OpInfo,
  subNum: string,
  headingLevel: 4 | 5,
  title: string,
  tocEntries: TocEntry[],
  linkableSchemaNames: Set<string>,
  nonUniqueSchemaNames: Set<string>,
  groupedForm?: string | null,
): Block[] {
  const blocks: Block[] = [];
  const headingText = `${subNum} ${title}`;
  addHeading(blocks, tocEntries, headingLevel, headingText);
  const desc = op.description ?? op.summary ?? '';
  if (desc) addContent(blocks, [desc]);
  const plainExample =
    op.parameters.length > 0
      ? `arena.${op.operationId}({ ${op.parameters.map((p) => p.name).join(', ')} })`
      : `arena.${op.operationId}()`;
  addHeading(blocks, tocEntries, headingLevel + 1, 'Example');
  if (groupedForm != null && groupedForm !== '') {
    addContent(blocks, ['```js', `arena.${groupedForm}`, '```']);
  }
  addCollapsible(blocks, 'Plain Example', [
    { type: 'content', lines: ['```js', plainExample, '```'] },
  ]);
  let schemaNth = 0;
  const nextSchemaId = () => `${subNum}.${++schemaNth}`;
  const { paramLines, requestBodyLines, responseLines } =
    renderOperationSection(
      op,
      nextSchemaId,
      linkableSchemaNames,
      nonUniqueSchemaNames,
    );
  if (paramLines.length > 0)
    addCollapsible(blocks, 'Parameters', [
      { type: 'content', lines: paramLines },
    ]);
  addContent(blocks, requestBodyLines);
  if (responseLines.length > 0)
    addCollapsible(blocks, 'Responses', [
      { type: 'content', lines: responseLines },
    ]);
  return blocks;
}

// --- Load and build API reference ---
export async function loadApiReference(
  inputPath: string,
): Promise<ApiReference> {
  const normalizedOas = new OASNormalize(inputPath, {
    enablePaths: true,
    parser: {
      resolve: { external: false },
      dereference: {
        circular: false,
        onDereference: (_path, value, parent, p) => {
          parent![p!] = { $ref: _path };
        },
      },
    },
  });

  const openApi = await normalizedOas.load();
  const derefOpenApi = await normalizedOas.dereference();
  const oas = new Oas(openApi as ConstructorParameters<typeof Oas>[0]);

  function resolveRef<T>(obj: (T & { $ref?: string }) | undefined): unknown {
    if (obj == null || typeof (obj as { $ref?: string }).$ref !== 'string')
      return obj;
    const ref = (obj as { $ref: string }).$ref;
    const parts = ref.replace(/^#\//, '').split('/');
    let acc: unknown = derefOpenApi;
    for (const part of parts) {
      acc = (acc as Record<string, unknown>)?.[part];
    }
    return acc;
  }

  const paths = oas.getPaths();
  const operations: OpInfo[] = [];

  for (const pathname of Object.keys(paths)) {
    const pathItem = paths[pathname];
    if (!pathItem) continue;
    const methods = Object.keys(pathItem).filter((k) =>
      ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(k),
    ) as HttpMethods[];
    const url = new URL(pathname, oas.url()).toString();

    for (const method of methods) {
      const op = oas.getOperation(url, method);
      const operationId = op.getOperationId();
      if (!operationId) continue;

      const schema = op.schema as {
        summary?: string;
        description?: string;
        parameters?: Array<{
          name?: string;
          in?: string;
          description?: string;
          schema?: { $ref?: string };
        }>;
        requestBody?: {
          content?: Record<string, { schema?: { $ref?: string } }>;
        };
        responses?: Record<
          string,
          {
            description?: string;
            content?: Record<string, { schema?: { $ref?: string } }>;
          }
        >;
      };

      const parameters: OpInfo['parameters'] = [];
      for (const p of op.getParameters()) {
        const resolved = resolveRef(p) as Record<string, unknown> | undefined;
        if (!resolved) continue;
        const name = (resolved.name as string) ?? (p as { name?: string }).name;
        const in_ = (resolved.in as string) ?? (p as { in?: string }).in;
        const desc = resolved.description as string | undefined;
        const rawSchema = resolved.schema as
          | { $ref?: string; type?: string | string[] }
          | undefined;
        const ref = rawSchema?.$ref;
        const typeVal = rawSchema?.type;
        const typeStr =
          typeVal == null
            ? undefined
            : Array.isArray(typeVal)
              ? typeVal.join(UNION)
              : String(typeVal);
        parameters.push({
          name: name ?? 'unknown',
          in: in_ ?? 'query',
          description: desc,
          type: typeStr,
          schemaRef: ref ? extractRefName(ref) : undefined,
          schema: ref ? resolveRef({ $ref: ref }) : undefined,
        });
      }

      let requestBodyRef: string | undefined;
      let requestBodySchema: unknown;
      const rb = schema?.requestBody;
      if (rb?.content) {
        const firstContent = Object.values(rb.content)[0];
        const s = firstContent?.schema;
        if (s?.$ref) {
          requestBodyRef = extractRefName(s.$ref);
          requestBodySchema = resolveRef(s);
        } else {
          requestBodySchema = s;
        }
      }

      const responses: OpInfo['responses'] = [];
      for (const status of op.getResponseStatusCodes()) {
        const res = op.getResponseByStatusCode(status);
        const resObj =
          typeof res === 'boolean'
            ? undefined
            : (res as Record<string, unknown>);
        const desc = resObj?.description as string | undefined;
        const content = resObj?.content as
          | Record<string, { schema?: { $ref?: string } }>
          | undefined;
        let contentRef: string | undefined;
        let contentSchema: unknown;
        if (content) {
          const first = Object.values(content)[0];
          const s = first?.schema;
          if (s?.$ref) {
            contentRef = extractRefName(s.$ref);
            contentSchema = resolveRef(s);
          } else {
            contentSchema = s;
          }
        }
        responses.push({
          status,
          description: desc,
          contentRef,
          contentSchema,
        });
      }

      operations.push({
        path: pathname,
        method,
        operationId,
        summary: schema?.summary,
        description: schema?.description,
        tags: op.getTags().map((t) => t.name),
        parameters,
        requestBodyRef,
        requestBodySchema,
        responses,
      });
    }
  }

  const tagToOps = new Map<string, OpInfo[]>();
  const untagged: OpInfo[] = [];

  for (const op of operations) {
    if (op.tags.length === 0) {
      untagged.push(op);
    } else {
      const tag = op.tags[0]!;
      if (!tagToOps.has(tag)) tagToOps.set(tag, []);
      tagToOps.get(tag)!.push(op);
    }
  }

  const sections: Section[] = [];
  for (const [tag] of [...tagToOps.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    const ops = tagToOps.get(tag)!;
    sections.push({ type: 'group', tag, ops });
  }
  for (const op of untagged) {
    sections.push({ type: 'ungrouped', op });
  }

  const operationsByKey: Record<string, OpInfo> = Object.fromEntries(
    operations.map((op) => [op.operationId, op]),
  );

  const schemaUsages = new Map<string, SchemaUsage[]>();
  const schemaContent = new Map<string, unknown>();

  function collectSchemaUsage(
    schemaName: string,
    sectionSchemaId: string,
    label: string,
    schema: unknown,
    operationId: string,
  ) {
    const anchor = slugForAnchor(sectionSchemaId, schemaName);
    if (!schemaUsages.has(schemaName)) {
      schemaUsages.set(schemaName, []);
      schemaContent.set(schemaName, schema);
    }
    schemaUsages.get(schemaName)!.push({
      sectionSchemaId,
      anchor,
      label,
      operationId,
    });
  }

  function collectSchemaUsagesForOp(op: OpInfo, nextId: () => string): void {
    for (const p of op.parameters) {
      if (p.schemaRef) {
        const id = nextId();
        collectSchemaUsage(
          p.schemaRef,
          id,
          `${id} Parameter: ${p.name} (${p.in})`,
          p.schema,
          op.operationId,
        );
      }
    }
    if (op.requestBodyRef) {
      const id = nextId();
      collectSchemaUsage(
        op.requestBodyRef,
        id,
        `${id} Request body`,
        op.requestBodySchema,
        op.operationId,
      );
    }
    for (const res of op.responses) {
      if (res.contentRef) {
        const id = nextId();
        collectSchemaUsage(
          res.contentRef,
          id,
          `${id} Response ${res.status}`,
          res.contentSchema,
          op.operationId,
        );
      }
    }
  }

  let preTopNum = 0;
  for (const section of sections) {
    preTopNum += 1;
    const groupNum = String(preTopNum);
    if (section.type === 'group') {
      section.ops.forEach((op, i) => {
        let schemaNth = 0;
        const nextId = () => `${groupNum}.${i + 1}.${++schemaNth}`;
        collectSchemaUsagesForOp(op, nextId);
      });
    } else {
      let schemaNth = 0;
      const nextId = () => `${groupNum}.${++schemaNth}`;
      collectSchemaUsagesForOp(section.op, nextId);
    }
  }

  const nonUniqueSchemaNames = new Set(
    [...schemaUsages.entries()]
      .filter(([, usages]) => usages.length > 1)
      .map(([name]) => name),
  );
  const componentsSchemas = (derefOpenApi as Record<string, unknown>)
    ?.components as Record<string, unknown> | undefined;
  const allSchemaNames = componentsSchemas?.schemas
    ? Object.keys(componentsSchemas.schemas as Record<string, unknown>)
    : [...schemaUsages.keys()];
  const linkableSchemaNames = new Set(allSchemaNames);

  return {
    sections,
    operationsByKey,
    allSchemaNames,
    schemaUsages,
    schemaContent,
    componentsSchemas,
    getScopedName,
    getUngroupedOpDisplayName: (op) =>
      getUngroupedOpDisplayName(op, operationsByKey),
    getGroupedForm: (op, tag) => getGroupedForm(op, operationsByKey, tag),
    buildOperationBlocks: (
      op,
      subNum,
      headingLevel,
      title,
      tocEntries,
      groupedForm,
    ) =>
      buildOperationBlocks(
        op,
        subNum,
        headingLevel,
        title,
        tocEntries,
        linkableSchemaNames,
        nonUniqueSchemaNames,
        groupedForm,
      ),
    describeSchema: (
      schema,
      indent = '',
      linkable = linkableSchemaNames,
      options,
    ) => describeSchemaImpl(schema, indent, linkable, options),
    refSchemaAnchor,
    UNION,
  };
}
