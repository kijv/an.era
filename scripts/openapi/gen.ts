import type { ComponentsObject, HttpMethods, SchemaObject } from 'oas/types';
import { defaultRenderRef, sortSchemas } from './util';
import OASNormalize from 'oas-normalize';
import Oas from 'oas';
import { Operation } from 'oas/operation';
import { dataToEsm } from '@rollup/pluginutils';
import { fileURLToPath } from 'bun';
import { getParametersAsJSONSchema } from 'oas/operation/get-parameters-as-json-schema';
import { jsonSchemaToValibot } from 'json-schema-to-valibot';
import path from 'node:path';

const cwd = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const only = Bun.argv
  .slice(2)
  .find((arg) => arg.startsWith('--only='))
  ?.split('=')[1]
  ?.split(',');

const input = Bun.argv
  .slice(2)
  .find((arg) => arg.startsWith('--input='))
  ?.split('=')[1];

const skipExistingArg = Bun.argv
  .slice(2)
  .find((arg) => arg.startsWith('--skip-existing='))
  ?.split('=')[1];

const skipExisting =
  skipExistingArg == null ? false : skipExistingArg === 'true';

const normalizedOas = new OASNormalize(input!, {
  enablePaths: true,
  parser: {
    resolve: {
      external: false,
    },
    dereference: {
      circular: false,
      onDereference: (path, value, parent, p) => {
        parent![p!] = {
          $ref: path,
        };
      },
    },
  },
});

const openApi = await normalizedOas.load();
const derefOpenApi = await normalizedOas.dereference();

const oas = new Oas(openApi);
const derefOas = await (async () => {
  const derefOpenApi = new OASNormalize(structuredClone(oas).api);
  return new Oas(await derefOpenApi.dereference());
})();

const resolveRef = <
  T extends
    | {}
    | {
        $ref: string;
      },
>(
  obj?: T,
) =>
  obj != null && '$ref' in obj && typeof obj.$ref === 'string'
    ? (obj.$ref as string)
        .replace(/^#\//, '')
        .split('/')
        .reduce((acc, part) => (acc = acc[part]), derefOpenApi as any)
    : obj;

type Code = {
  imports: {
    require: string;
    variable: string;
  }[];
  exports: {
    default: string[];
    type: string[];
  };
  body: string;
  toString: () => string;
};

const createCode = ({
  imports = [],
  exports = {
    default: [],
    type: [],
  },
  body = '',
}: Partial<Omit<Code, 'toString'>> = {}): Code => ({
  imports,
  exports,
  body,
  toString() {
    return this.imports
      .map((i) => `import ${i.variable} from "${i.require}";`)
      .concat([this.body.trim()])
      .concat(
        Object.entries(this.exports)
          .filter(([, v]) => v.length > 0)
          .map(
            ([k, v]) =>
              `export ${k} {\n${v.map((s) => `\t${s}`).join(',\n ')}\n};`,
          ),
      )
      .join('\n')
      .trim();
  },
});

const createRenderRef =
  (code: Code, filename: string) =>
  (ref: string, types = false, shouldImport = true) => {
    const refPath = ref.replace(/^#\//, '').split('/');
    const parent = refPath.slice(0, -1).join('/');
    const variableName = parent.split('/').at(-1)!.charAt(0);
    const relativeParent = path.relative(path.dirname(filename), parent);
    if (path.relative(path.dirname(filename), filename) === relativeParent) {
      return defaultRenderRef(ref, !types);
    }
    if (
      shouldImport &&
      !code.imports.find((c) => c.require === `./${relativeParent}`)
    ) {
      code.imports.push({
        require: `./${relativeParent}`,
        variable: `* as ${variableName}`,
      });
    }
    return `${variableName}.${defaultRenderRef(ref, !types)}`;
  };

const jsonToVali = (
  schema: SchemaObject & {
    components?: ComponentsObject | undefined;
  },
  renderRef?: ReturnType<typeof createRenderRef>,
  constraints?: (c: string[]) => string[],
) => {
  // @ts-expect-error
  const code = jsonSchemaToValibot(schema, {
    module: 'esm',
    exportDefinitions: false,
    withTypes: true,
    maxDepth: 999999,
    nameRef: (ref: string, types: boolean) => renderRef?.(ref, types, false),
    importRef: (ref: string) => renderRef?.(ref, false, true),
    resolveRef: ($ref: string) => resolveRef({ $ref }),
    constraints,
  });

  const jsDefinition = 'export const schema =';
  const tsDefinition = 'export type schemaType =';

  const isolated = code.slice(code.indexOf(jsDefinition) + jsDefinition.length);

  const typesIndex = isolated.indexOf(tsDefinition);

  const result = {
    js: isolated.slice(0, typesIndex).trim(),
    ts: isolated.slice(typesIndex + tsDefinition.length).trim(),
  };

  return result;
};

const getComponentsSchemasCode = () => {
  const code = createCode({
    imports: [
      {
        require: 'valibot',
        variable: '* as v',
      },
    ],
  });

  const data: Record<string, unknown> = {};
  const codeReferences: Record<string, string> = {};

  const schemas = sortSchemas(oas.api.components?.schemas ?? {});

  for (const name in schemas) {
    const s = schemas[name];
    if (!s) continue;

    const { js, ts } = jsonToVali(
      // @ts-expect-error
      Object.assign({}, s, {
        components: derefOas.api.components,
      }),
      createRenderRef(code, 'components/schemas'),
      // (r) => `${r.split('/').pop()!}Schema`,
      (c) => c.map((c) => (c === 'v.isoDateTime()' ? 'v.isoTimestamp()' : c)),
    );

    const reference = ['__']
      .concat(
        name
          .split('')
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join('')
          .toUpperCase(),
      )
      .concat('__')
      .join('');
    codeReferences[reference] = `${js};\ntype ${name} = ${ts}`;

    code.exports.type.push(name);

    data[`${name}Schema`] = reference;
  }

  code.body += `\n${dataToEsm(data, {
    preferConst: true,
    namedExports: true,
    includeArbitraryNames: true,
    objectShorthand: true,
  })}`;
  for (const reference in codeReferences) {
    code.body = code.body.replaceAll(
      JSON.stringify(reference),
      codeReferences[reference]!,
    );
  }
  return code;
};

const getOperationsCode = () => {
  const code = createCode({
    imports: [
      {
        require: 'valibot',
        variable: '* as v',
      },
    ],
  });
  const renderRef = createRenderRef(code, 'operations');

  const paths = oas.getPaths();
  const operations: Record<
    string,
    {
      path: string;
      method: string;
      tags: string[];
      parameters: Record<string, string>;
      response: Record<string, Record<string, string>>;
    }
  > = {};
  const codeReferences: Record<string, string> = {};

  for (const pathname in oas.getPaths()) {
    const path = paths[pathname];
    if (path == null) continue;

    const methods = Object.keys(path) as HttpMethods[];
    const url = new URL(pathname, oas.url()).toString();

    for (const method of methods) {
      const operation = oas.getOperation(url, method);

      const operationId = operation.getOperationId();
      if (!operationId) continue;

      const parameters = getParametersAsJSONSchema(
        new Operation(
          oas.api,
          pathname,
          method,
          Object.assign({}, operation.schema, {
            parameters: operation.getParameters().map((p) =>
              Object.assign(
                {},
                resolveRef(p),
                '$ref' in p
                  ? {
                      $ref: p.$ref,
                    }
                  : {},
              ),
            ),
          }),
        ),
        oas.api,
        {
          includeDiscriminatorMappingRefs: true,
          transformer: (s) => resolveRef(s),
        },
      );

      const parameterOrder = ['path', 'body', 'formData', 'query'];

      operations[operationId] = {
        path: pathname,
        method,
        tags: operation.getTags().map((t) => t.name),
        parameters:
          parameters != null && Array.isArray(parameters)
            ? Object.fromEntries(
                parameters
                  .sort(
                    (a, b) =>
                      parameterOrder.indexOf(a.type) -
                      parameterOrder.indexOf(b.type),
                  )
                  .map((p) => [
                    p.type,
                    (() => {
                      const code = jsonToVali(p.schema, renderRef);
                      const reference = ['__']
                        .concat(
                          pathname
                            .split('/')
                            .concat([method, operationId, 'parameters', p.type])
                            .filter(Boolean)
                            .map((s) => s.toUpperCase())
                            .join('_'),
                        )
                        .concat('__')
                        .join('');
                      codeReferences[reference] = code.js;
                      return reference;
                    })(),
                  ]),
              )
            : {},
        response: Object.fromEntries(
          operation.getResponseStatusCodes().map((status) => [
            status,
            (() => {
              const response = (() => {
                const response = operation.getResponseByStatusCode(status);
                return typeof response === 'boolean'
                  ? resolveRef(operation.schema.responses![status])
                  : response;
              })();
              if (
                !response ||
                !('content' in response) ||
                response.content == null
              )
                return {};
              return Object.fromEntries(
                Object.keys(response.content).map((contentType) => [
                  contentType,
                  (() => {
                    const schema = Object.assign(
                      {
                        components: oas.api.components,
                      },
                      response.content[contentType]!.schema!,
                    );
                    const { js, ts } = jsonToVali(schema, renderRef);
                    const reference = ['__']
                      .concat(
                        pathname
                          .split('/')
                          .concat([
                            method,
                            operationId,
                            'responses',
                            status,
                            contentType,
                          ])
                          .filter(Boolean)
                          .map((s) => s.toUpperCase())
                          .join('_'),
                      )
                      .concat('__')
                      .join('');
                    codeReferences[reference] =
                      `Object.assign({}, ${js}, { _type: {} as unknown as ${ts} })`;
                    return reference;
                  })(),
                ]),
              );
            })(),
          ]),
        ),
      };
    }
  }
  code.body += `\n${dataToEsm(operations, {
    preferConst: true,
    namedExports: true,
    includeArbitraryNames: true,
    objectShorthand: true,
  }).replaceAll(/({\n(\n|(?!export|const).)*})(;)/gm, '$1 as const;')}`;
  //   .replace(
  //   /((const .* = {\n)(\n|(?!export|const).)*})(;)/gm,
  //   (m, b) => `${b} as const;`,
  // )
  for (const reference in codeReferences) {
    code.body = code.body.replaceAll(
      JSON.stringify(reference),
      codeReferences[reference]!,
    );
  }
  return code;
};

const getMainCode = () => {
  const code = createCode();

  if (oas.api.servers != null && oas.api.servers.length > 0) {
    code.body += [
      `export const SERVERS = [`,
      ...oas.api.servers.map((s) => JSON.stringify(s)).map((s) => `\t${s},`),
      `] as const;`,
    ].join('\n');
  }

  return code;
};

const contents: Record<string, () => Code> = {
  'components/schemas': getComponentsSchemasCode,
  operations: getOperationsCode,
  index: getMainCode,
};

const arr = only != null ? only : Object.keys(contents);

for (const key of arr) {
  if (!(key in contents)) continue;
  const file = Bun.file(path.join(cwd, `src/openapi/${key}.ts`));
  if (skipExisting && (await file.exists())) continue;
  await file.write(contents[key]!().toString());
  console.log(key);
}
