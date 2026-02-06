/** Shared document types for readme generation. */

export type TocEntry = { level: number; text: string; anchor?: string };

export type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'toc'; entries: TocEntry[] }
  | { type: 'anchor'; id: string }
  | { type: 'content'; lines: string[] }
  | { type: 'collapsible'; summary: string; blocks: Block[] };

export type Doc = Block[];
