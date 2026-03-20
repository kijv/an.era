import openapiTS, { astToString } from 'openapi-typescript';
import fs from 'node:fs/promises';
import ts from 'typescript';

await (async () => {
  const openapiJson = await fetch('https://api.are.na/v3/openapi.json').then(
    (res) => res.json(),
  );

  const contents = astToString(
    (
      await openapiTS(
        Object.assign({}, openapiJson, {
          paths: {},
        }),
      )
    ).filter((node) => {
      if (node.kind === ts.SyntaxKind.TypeAliasDeclaration) {
        const typeAliasDecl = node as ts.TypeAliasDeclaration;
        if (
          astToString(typeAliasDecl.type).trim() === 'Record<string, never>'
        ) {
          return false;
        }
      }
      return true;
    }),
  );

  await fs.writeFile(
    new URL('../src/openapi.ts', import.meta.url),
    `/* oxlint-disable */\n${contents}`,
    'utf-8',
  );
})();
