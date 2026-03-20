import openapiTS, { astToString } from 'openapi-typescript';
import fs from 'node:fs/promises';

await (async () => {
  const openapiJson = await fetch('https://api.are.na/v3/openapi.json').then(
    (res) => res.json(),
  );

  const ast = await openapiTS(openapiJson, {
    alphabetize: true,
  });
  const contents = astToString(ast);

  await fs.writeFile(
    new URL('../src/schema.ts', import.meta.url),
    contents,
    'utf-8',
  );
})();
