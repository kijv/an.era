/**
 * Generates a structured readme (text/markdown) from an OpenAPI spec:
 * - Groups operations by tag (like packages/an.era)
 * - Numbered sections: ### N. Group (h3), #### N.M Operation (h4), ungrouped ops as ### N. (h3)
 * - For each operation: (plain: operationId), description, and ### Schema with options/descriptions/examples
 * - Schema refs that appear more than once: first appearance is full section, later ones are linkable refs
 */
import args from 'args';
import { fileURLToPath } from 'bun';
import path from 'node:path';
import { buildReadme } from './readme/doc';

const cwd = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

args.option('input', 'Path to OpenAPI spec (JSON)', './openapi.json');
args.option(
  'output',
  'Write to file (default: stdout)',
  undefined as string | undefined,
);

const flags = args.parse(process.argv);
const input = (flags.input as string) ?? path.join(cwd, 'openapi.json');
const outputPath = flags.output as string | undefined;

const text = await buildReadme(input);

if (outputPath) {
  await Bun.write(outputPath, text);
  console.log(`Wrote ${outputPath}`);
} else {
  console.log(text);
}
