import { OpenAPIV3, type OpenAPIV3_1 } from 'openapi-types';
import {
  defaultRenderRef,
  openApiSchemaToValibotSchema,
  sortSchemasByDependencies,
} from './util';
import { dereference, parse } from '@readme/openapi-parser';
import { fileURLToPath } from 'bun';
import path from 'node:path';

const cwd = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const only = Bun.argv
  .slice(2)
  .find((arg) => arg.startsWith('--only='))
  ?.split('=')[1]
  ?.split(',');

const url = Bun.argv
  .slice(2)
  .find((arg) => arg.startsWith('--url='))
  ?.split('=')[1];

const file = Bun.argv
  .slice(2)
  .find((arg) => arg.startsWith('--file='))
  ?.split('=')[1];

const skipExistingArg = Bun.argv
  .slice(2)
  .find((arg) => arg.startsWith('--skip-existing='))
  ?.split('=')[1];

const skipExisting =
  skipExistingArg == null ? false : skipExistingArg === 'true';

const openApiJson = await (url
  ? fetch(url).then((res) => res.json())
  : Bun.file(path.join(cwd, file!)).json());

const openApi = (await parse(
  structuredClone(openApiJson),
)) as OpenAPIV3_1.Document<typeof openApiJson>;
const derefOpenApi = (await dereference(
  structuredClone(openApiJson),
)) as OpenAPIV3_1.Document<typeof openApiJson>;

type Code = {
  imports: {
    require: string;
    variable: string;
  }[];
  exports: string[];
  body: string;
  toString: () => string;
};

const createCode = ({
  imports = [],
  exports = [],
  body = '',
}: Partial<Omit<Code, 'toString'>> = {}): Code => ({
  imports,
  exports,
  body,
  toString() {
    return this.imports
      .map((i) => `import ${i.variable} from "${i.require}";`)
      .concat([this.body])
      .concat(
        this.exports.length > 0
          ? [
              `\nexport {\n${this.exports.map((s) => `\t${s}`).join(',\n ')}\n};`,
            ]
          : [],
      )
      .join('\n')
      .trim();
  },
});

const getComponentsSchemasCode = () => {
  const code = createCode({
    imports: [{ require: 'valibot', variable: '* as v' }],
  });

  const schemas = sortSchemasByDependencies(openApi.components?.schemas ?? {});

  for (const name in schemas) {
    const obj = schemas[name];
    if (obj == null) continue;
    const variableName = `${name}Schema`;
    code.body += [`\nconst ${variableName} = `]
      .concat(openApiSchemaToValibotSchema(obj).join('\n'))
      .join('');
    code.exports.push(variableName);
    code.body += `\ntype ${name} = v.InferOutput<typeof ${variableName}>;`;
    code.exports.push(`type ${name}`);
  }

  return code;
};

const getComponentsParamsCode = () => {
  const code = createCode({
    imports: [{ require: 'valibot', variable: '* as v' }],
  });

  for (const name in openApi.components?.parameters) {
    const obj = openApi.components?.parameters[name];
    if (obj == null || '$ref' in obj) continue;
    const variableName = `${name}Schema`;
    code.body += [`\nconst ${variableName} = `]
      .concat(
        openApiSchemaToValibotSchema(
          Object.assign({}, obj.schema as OpenAPIV3_1.SchemaObject, {
            example: obj.example,
            describetion: obj.description,
          }),
          (ref, kind) => {
            if (kind === 'components/schemas') {
              if (!code.imports.find((c) => c.require === './schemas')) {
                code.imports.push({ require: './schemas', variable: '* as s' });
              }
              return `s.${defaultRenderRef(ref)}`;
            }
          },
        ).join('\n'),
      )
      .join('');
    code.exports.push(variableName);
    code.body += `\ntype ${name} = v.InferOutput<typeof ${variableName}>;`;
    code.exports.push(`type ${name}`);
  }

  return code;
};

const getComponentsResCode = () => {
  const code = createCode();
  const renderRef = (ref: string) => {
    const refPath = ref.replace(/^#\//, '').split('/');
    const parent = refPath.slice(0, -1).join('/');
    const variableName = parent.split('/').at(-1)!.charAt(0);
    const relativeParent = path.relative('components', parent);
    if (!code.imports.find((c) => c.require === `./${relativeParent}`)) {
      code.imports.push({
        require: `./${relativeParent}`,
        variable: `* as ${variableName}`,
      });
    }
    return `${variableName}.${defaultRenderRef(ref)}`;
  };

  for (const name in openApi.components?.responses) {
    const res = openApi.components.responses[name];
    if (res == null) continue;
    const variableName = name;
    code.body += [`\nconst ${variableName} = `]
      .concat(
        [
          `{`,
          ...('$ref' in res
            ? openApiSchemaToValibotSchema(res)
            : 'content' in res && res.content != null
              ? Object.entries(res.content).flatMap(([media, v]) =>
                  openApiSchemaToValibotSchema(
                    Object.assign({}, v.schema, {
                      description: res.description,
                      examples: v.examples,
                    }),
                    renderRef,
                  ).map(
                    (l, i, arr) =>
                      `${i === 0 ? `${JSON.stringify(media)}: ` : ''}${l}${i === arr.length - 1 ? ',' : ''}`,
                  ),
                )
              : []
          ).map((s) => `\t${s}`),
          `}`,
        ].join('\n'),
      )
      .join('');
    code.exports.push(variableName);
  }

  return code;
};

const getPathsCode = () => {
  type Operation = {
    path: string;
    id: string;
    method: string;
    parameters?: (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[] &
      (OpenAPIV3.ParameterObject | OpenAPIV3_1.ReferenceObject)[];
    responses: OpenAPIV3.ResponsesObject & OpenAPIV3_1.ResponsesObject;
    requestBody?: OpenAPIV3_1.RequestBodyObject;
  };

  const code = createCode();
  const renderRef = (ref: string) => {
    const refPath = ref.replace(/^#\//, '').split('/');
    const parent = refPath.slice(0, -1).join('/');
    const variableName = parent.split('/').at(-1)!.charAt(0);
    if (!code.imports.find((c) => c.require === `./${parent}`)) {
      code.imports.push({
        require: `./${parent}`,
        variable: `* as ${variableName}`,
      });
    }
    return `${variableName}.${defaultRenderRef(ref)}`;
  };

  const taggedOps: Record<string, Operation[]> = {};

  for (const pathKey in openApi.paths) {
    const path = openApi.paths[pathKey];
    if (path == null) continue;

    for (const methodKey in path) {
      const method = path[methodKey as keyof typeof path];
      if (method == null) continue;

      if (typeof method === 'object' && 'tags' in method) {
        for (const tag of method.tags) {
          taggedOps[tag] ??= [];
          taggedOps[tag].push({
            path: pathKey,
            id: method.operationId!,
            method: methodKey,
            parameters: method.parameters,
            responses: method.responses,
            requestBody:
              method.requestBody != null &&
              typeof method.requestBody === 'object' &&
              '$ref' in method.requestBody
                ? (method.$ref as string)
                    .replace(/^#\//, '')
                    .split('/')
                    .reduce(
                      (acc, part) => (acc = acc[part]),
                      derefOpenApi as any,
                    )
                : method.requestBody,
          });
        }
      }
    }
  }

  for (const tag in taggedOps) {
    const operations = taggedOps[tag];
    if (operations == null) continue;

    const samePathParam: Record<
      string,
      {
        ops: Operation[];
        schema: OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.SchemaObject;
      }
    > = {};
    const restOps: Operation[] = [];

    for (const op of operations) {
      let hasSimilar = false;
      for (const param of op.parameters ?? []) {
        const paramObj =
          '$ref' in param
            ? param.$ref
                .replace(/^#\//, '')
                .split('/')
                .reduce((acc, part) => (acc = acc[part]), derefOpenApi as any)
            : param;

        if ('$ref' in param) {
          const refPath = param.$ref.replace(/^#\//, '').split('/');
          const parent = refPath.slice(0, -1).join('/');
          if (!code.imports.find((c) => c.require === `./${parent}`)) {
            code.imports.push({
              require: `./${parent}`,
              variable: `* as ${parent.split('/').at(-1)!.charAt(0)}`,
            });
          }
          if (!code.imports.find((c) => c.require === 'valibot')) {
            code.imports.push({
              require: 'valibot',
              variable: `* as v`,
            });
          }
        }

        if (
          paramObj != null &&
          typeof paramObj === 'object' &&
          'in' in paramObj &&
          'name' in paramObj &&
          typeof paramObj.name === 'string' &&
          paramObj.in === 'path'
        ) {
          const { name } = paramObj;

          samePathParam[name] ??= {
            ops: [],
            schema: '$ref' in param ? param : param.schema!,
          };
          samePathParam[name].ops.push(op);
          hasSimilar = true;
        }
      }
      if (!hasSimilar) restOps.push(op);
    }

    const variableName = tag.replace(/\s+/g, '');

    const renderOps = (ops: Operation[]) =>
      ops
        .flatMap((op) => {
          const groupedParamsByIn: Record<
            string,
            (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[]
          > = op.parameters
            ? op.parameters.reduce(
                (acc, param) => {
                  const paramObj =
                    '$ref' in param
                      ? param.$ref
                          .replace(/^#\//, '')
                          .split('/')
                          .reduce(
                            (acc, part) => (acc = acc[part]),
                            derefOpenApi as any,
                          )
                      : param;

                  if (
                    paramObj != null &&
                    typeof paramObj === 'object' &&
                    'in' in paramObj
                  ) {
                    const { in: inType } = paramObj;
                    acc[inType] ??= [];
                    acc[inType].push(param);
                  }
                  return acc;
                },
                {} as Record<
                  string,
                  (OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject)[]
                >,
              )
            : {};

          return [
            `${op.id}: {`,
            ...[
              `method: ${JSON.stringify(op.method)},`,
              `path: ${JSON.stringify(op.path)},`,
            ]
              .concat(
                [`parameters: {`]
                  .concat(
                    Object.entries(groupedParamsByIn)
                      .flatMap(([key, params]) =>
                        [`${key}: {`].concat([
                          ...params
                            .filter(
                              (p) =>
                                '$ref' in p ||
                                ('schema' in p && p.schema != null),
                            )
                            .flatMap((p) =>
                              openApiSchemaToValibotSchema(
                                '$ref' in p
                                  ? p
                                  : Object.assign(
                                      {},
                                      p.schema as OpenAPIV3_1.SchemaObject,
                                      {
                                        example: p.example,
                                        description: p.description,
                                      },
                                    ),
                                renderRef,
                              ).map((l, i, arr) => {
                                const pObj =
                                  '$ref' in p
                                    ? p.$ref
                                        .replace(/^#\//, '')
                                        .split('/')
                                        .reduce(
                                          (acc, part) => (acc = acc[part]),
                                          derefOpenApi as any,
                                        )
                                    : p;
                                return `${
                                  i === 0
                                    ? `${pObj.name}: ${!pObj.required ? 'v.nullish(' : ''}`
                                    : ''
                                }${l}${i === arr.length - 1 ? `${!pObj.required ? ')' : ''},` : ''}`;
                              }),
                            )
                            .map((s) => `\t${s}`),
                          `},`,
                        ]),
                      )
                      .map((s) => `\t${s}`),
                  )
                  .concat('},'),
              )
              .concat(
                op.requestBody != null
                  ? [`body: {`]
                      .concat(
                        [
                          `required: ${JSON.stringify(op.requestBody.required ?? false)},`,
                        ]
                          .concat(
                            Object.keys(op.requestBody.content).length > 0
                              ? ['content: {']
                                  .concat(
                                    Object.entries(op.requestBody.content ?? {})
                                      .flatMap(([media, value]) =>
                                        openApiSchemaToValibotSchema(
                                          Object.assign({}, value.schema!, {
                                            example: value.example,
                                            examples: value.examples,
                                          }),
                                        ).map(
                                          (l, i, arr) =>
                                            `${i === 0 ? `${JSON.stringify(media)}: ` : ''}${l}${i === arr.length - 1 ? ',' : ''}`,
                                        ),
                                      )
                                      .map((s) => `\t${s}`),
                                  )
                                  .concat('},')
                              : [],
                          )
                          .map((s) => `\t${s}`),
                      )
                      .concat('},')
                  : [],
              )
              .concat(
                ['responses: {']
                  .concat(
                    Object.entries(op.responses)
                      .flatMap(([statusCode, res]) =>
                        '$ref' in res
                          ? openApiSchemaToValibotSchema(res, renderRef).map(
                              (l, i, arr) =>
                                `${i === 0 ? `${JSON.stringify(statusCode)}: ` : ''}${l}${i === arr.length - 1 ? ',' : ''}`,
                            )
                          : 'content' in res && res.content != null
                            ? [`${JSON.stringify(statusCode)}: {`]
                                .concat(
                                  Object.entries(res.content)
                                    .flatMap(([media, v]) =>
                                      openApiSchemaToValibotSchema(
                                        Object.assign({}, v.schema, {
                                          description: res.description,
                                          examples: v.examples,
                                        }),
                                        renderRef,
                                      ).map(
                                        (l, i, arr) =>
                                          `${i === 0 ? `${JSON.stringify(media)}: ` : ''}${l}${i === arr.length - 1 ? ',' : ''}`,
                                      ),
                                    )
                                    .map((s) => `\t${s}`),
                                )
                                .concat('},')
                            : [],
                      )
                      .map((s) => `\t${s}`),
                  )
                  .concat('},'),
              )
              .map((s) => `\t${s}`)
              .concat('},'),
          ];
        })
        .map((s) => `\t${s}`);

    code.body += [`\nconst ${variableName} = `]
      .concat(
        [
          '{',
          ...renderOps(restOps),
          ...Object.entries(samePathParam).flatMap(([paramName, data]) =>
            [`\t${paramName}: {`].concat(
              [
                `$parameters: {`,
                ...openApiSchemaToValibotSchema(data.schema, renderRef)
                  .map((l, i) => `${i === 0 ? `${paramName}: ` : ''}${l}`)
                  .map((s) => `\t${s}`),
                `},`,
              ]
                .map((s) => `\t${s}`)
                .concat(renderOps(data.ops))
                .concat('}')
                .map((s) => `\t${s}`),
            ),
          ),
          '}',
        ].join('\n'),
      )
      .join('');

    code.exports.push(variableName);
  }

  return code;
};

const getMainCode = () => {
  const code = createCode();

  if (openApi.servers != null && openApi.servers.length > 0) {
    code.body += [
      `export const SERVERS = [`,
      ...openApi.servers.map((s) => JSON.stringify(s)).map((s) => `\t${s},`),
      `] as const;`,
    ].join('\n');
  }

  return code;
};

const contents: Record<string, () => Code> = {
  'components/schemas': getComponentsSchemasCode,
  'components/parameters': getComponentsParamsCode,
  'components/responses': getComponentsResCode,
  paths: getPathsCode,
  index: getMainCode,
};

const arr = only != null ? only : Object.keys(contents);

for await (const key of arr) {
  const file = Bun.file(path.join(cwd, `src/openapi/${key}.ts`));
  if (skipExisting && (await file.exists())) continue;
  await file.write(contents[key]!().toString());
  console.log(key);
}
