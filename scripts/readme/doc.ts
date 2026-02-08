/**
 * Document model, TOC, referenced schemas section, and main readme build flow.
 * Builds the full doc (TOC + API reference blocks + schema reference) and renders to markdown.
 */
import type { Block, Doc, TocEntry } from './types';
import { loadApiReference } from './api';

/** GitHub-style anchor slug for heading text (TOC links). */
export function slugForToc(headingText: string): string {
  return headingText
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// --- Document model ---
function renderBlock(
  block: Block,
  slugForTocRef: (text: string) => string,
): string {
  switch (block.type) {
    case 'heading':
      return `${'#'.repeat(block.level)} ${block.text}`;
    case 'toc':
      return [
        '### Table of contents',
        '',
        ...block.entries.map(
          (e) =>
            '  '.repeat(Math.max(0, e.level - 4)) +
            `- [${e.text}](#${e.anchor ?? slugForTocRef(e.text)})`,
        ),
      ].join('\n');
    case 'anchor':
      return `<a id="${block.id}"></a>`;
    case 'content':
      return block.lines.length > 0 ? block.lines.join('\n') : '';
    case 'collapsible':
      if (block.blocks.length === 0) return '';
      const inner = block.blocks
        .map((b) => renderBlock(b, slugForTocRef))
        .filter(Boolean)
        .join('\n\n');
      return [
        '<details>',
        `<summary>${block.summary}</summary>`,
        '',
        inner,
        '</details>',
      ].join('\n');
    default:
      return '';
  }
}

export function renderDoc(
  doc: Doc,
  slugForTocRef: (text: string) => string,
): string {
  return doc
    .map((b) => renderBlock(b, slugForTocRef))
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n');
}

// --- Build helpers ---
function addHeading(
  doc: Doc,
  tocEntries: TocEntry[],
  level: number,
  text: string,
  anchor?: string,
): void {
  tocEntries.push({ level, text, ...(anchor && { anchor }) });
  doc.push({ type: 'heading', level, text });
}

function addBlocks(doc: Doc, blocks: Block[]): void {
  doc.push(...blocks);
}

function addContent(doc: Doc, lines: string[]): void {
  if (lines.length > 0) doc.push({ type: 'content', lines });
}

// --- Main: build full readme from API reference ---
export async function buildReadme(inputPath: string): Promise<string> {
  const doc: Doc = [];
  let topNum = 0;

  const api = await loadApiReference(inputPath);
  const tocEntries: TocEntry[] = [];

  if (api.sections.length > 0) {
    addHeading(doc, [], 2, 'API Reference');
  }

  for (const section of api.sections) {
    topNum += 1;
    const groupNum = String(topNum);
    if (section.type === 'group') {
      addHeading(doc, tocEntries, 4, `${groupNum} ${section.tag}`);
      addContent(doc, ['']);
      section.ops.forEach((op, i) => {
        const subNum = `${groupNum}.${i + 1}`;
        addBlocks(
          doc,
          api.buildOperationBlocks(
            op,
            subNum,
            5,
            op.operationId,
            tocEntries,
            api.getGroupedForm(op, section.tag),
          ),
        );
      });
    } else {
      const op = section.op;
      addBlocks(
        doc,
        api.buildOperationBlocks(
          op,
          groupNum,
          4,
          op.operationId,
          tocEntries,
          api.getGroupedForm(op),
        ),
      );
    }
  }

  if (api.allSchemaNames.length > 0) {
    addHeading(doc, tocEntries, 4, 'Schema Reference');
    addContent(doc, ['']);
    const schemasMap = (api.componentsSchemas?.schemas ?? {}) as Record<
      string,
      unknown
    >;
    for (const schemaName of [...api.allSchemaNames].sort()) {
      addHeading(
        doc,
        tocEntries,
        5,
        schemaName,
        api.refSchemaAnchor(schemaName),
      );
      const usages = api.schemaUsages.get(schemaName);
      const schema =
        api.schemaContent.get(schemaName) ?? schemasMap[schemaName];
      doc.push({ type: 'anchor', id: api.refSchemaAnchor(schemaName) });
      addContent(doc, ['']);
      if (schema) addContent(doc, [api.describeSchema(schema, '  ')]);
      addContent(doc, ['']);
      if (usages && usages.length > 1) {
        const usageLinks = usages.map(
          (u) => `[${u.label} (${u.operationId})](#${u.anchor})`,
        );
        addContent(doc, [`**Used in:** ${usageLinks.join(api.UNION)}`, '']);
      }
    }
  }

  const before: Doc = [];

  addContent(before, [
    '# an.era',
    '',
    'an.era is a API wrapper for the Are.na API',
    '',
    'Find package specific information [here](https://github.com/kijv/an.era/tree/main/packages/an.era/readme.md)',
  ]);

  const fullDoc: Doc = [
    ...before,
    doc[0]!,
    { type: 'toc', entries: tocEntries },
    ...doc.slice(1),
  ];

  return renderDoc(fullDoc, slugForToc);
}
