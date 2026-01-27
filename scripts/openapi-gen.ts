import { OpenAPIV3, type OpenAPIV3_1 } from 'openapi-types';
import { defaultRenderRef, openApiSchemaToValibotSchema } from './transform';
import OASNormalize from 'oas-normalize';
import Oas from 'oas';
import { fileURLToPath } from 'bun';
import path from 'node:path';
import { sortSchemas } from './util';

const cwd = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

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

const createFile = <O extends Record<string, any>>(options: {
  filename: string;
  codeOptions?: Parameters<typeof createCode>[0];
  objects: O | undefined | null;
  variableName?: (name: string) => string;
  types?: boolean;
  getLines: (
    this: { code: Code; renderRef: (ref: string) => string },
    obj: O extends Record<string, infer V> ? V : never,
  ) => string[];
}) => {
  const {
    codeOptions,
    objects,
    types = false,
    getLines,
    filename,
    ...otherOptions
  } = options;

  const code = createCode(codeOptions);

  if (!objects) return code;

  const renderRef = (ref: string) => {
    const refPath = ref.replace(/^#\//, '').split('/');
    const parent = refPath.slice(0, -1).join('/');
    const variableName = parent.split('/').at(-1)!.charAt(0);
    const relativeParent = path.relative(path.dirname(filename), parent);
    if (!code.imports.find((c) => c.require === `./${relativeParent}`)) {
      code.imports.push({
        require: `./${relativeParent}`,
        variable: `* as ${variableName}`,
      });
    }
    return `${variableName}.${defaultRenderRef(ref)}`;
  };

  for (const name in objects) {
    const obj = objects[name];
    if (obj == null) continue;
    const variableName = otherOptions.variableName?.(name) ?? name;
    code.body += [`\nconst ${variableName} = `]
      .concat(
        getLines
          .bind({
            code,
            renderRef,
          })(obj)
          .join('\n'),
      )
      .join('');
    code.exports.push(variableName);
    if (types) {
      code.body += `\ntype ${name} = v.InferInput<typeof ${variableName}>;`;
      code.exports.push(`type ${name}`);
    }
  }

  return code;
};

const getComponentsSchemasCode = () =>
  createFile({
    filename: 'components/schemas',
    codeOptions: {
      imports: [{ require: 'valibot', variable: '* as v' }],
    },
    objects: sortSchemas(oas.api.components?.schemas ?? {}),
    types: true,
    variableName: (n) => `${n}Schema`,
    getLines(this, obj) {
      return openApiSchemaToValibotSchema(obj, this.renderRef);
    },
  });

const getComponentsParamsCode = () =>
  createFile({
    filename: 'components/parameters',
    codeOptions: {
      imports: [{ require: 'valibot', variable: '* as v' }],
    },
    objects: oas.api.components?.parameters,
    types: true,
    variableName: (n) => `${n}Schema`,
    getLines(this, obj) {
      return openApiSchemaToValibotSchema(
        '$ref' in obj
          ? obj
          : Object.assign({}, obj.schema, {
              example: obj.example,
              describetion: obj.description,
            }),
        this.renderRef,
      );
    },
  });

const getComponentsResCode = () =>
  createFile({
    filename: 'components/responses',
    objects: oas.api.components?.responses ?? {},
    getLines(this, obj) {
      return [
        `{`,
        ...('$ref' in obj
          ? openApiSchemaToValibotSchema(obj, this.renderRef)
          : 'content' in obj && obj.content != null
            ? Object.entries(obj.content).flatMap(([media, v]) =>
                openApiSchemaToValibotSchema(
                  Object.assign({}, v.schema, {
                    description: obj.description,
                    examples: 'examples' in obj ? obj.examples : undefined,
                  }),
                  this.renderRef,
                ).map(
                  (l, i, arr) =>
                    `${i === 0 ? `${JSON.stringify(media)}: ` : ''}${l}${i === arr.length - 1 ? ',' : ''}`,
                ),
              )
            : []
        ).map((s) => `\t${s}`),
        `}`,
      ];
    },
  });

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

  return createFile({
    filename: 'paths',
    objects: taggedOps,
    variableName: (n) => n.replace(/\s+/g, ''),
    getLines(this, obj) {
      const samePathParam: Record<
        string,
        {
          ops: Operation[];
          schema: OpenAPIV3_1.ReferenceObject | OpenAPIV3_1.SchemaObject;
        }
      > = {};
      const restOps: Operation[] = [];

      for (const op of obj) {
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
            this.renderRef(param.$ref);
            if (!this.code.imports.find((c) => c.require === 'valibot')) {
              this.code.imports.push({
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
                                  this.renderRef,
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
                                      Object.entries(
                                        op.requestBody.content ?? {},
                                      )
                                        .flatMap(([media, value]) =>
                                          openApiSchemaToValibotSchema(
                                            Object.assign({}, value.schema!, {
                                              example: value.example,
                                              examples: value.examples,
                                            }),
                                            this.renderRef,
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
                            ? openApiSchemaToValibotSchema(
                                res,
                                this.renderRef,
                              ).map(
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
                                          this.renderRef,
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

      return [
        '{',
        ...renderOps(restOps),
        ...Object.entries(samePathParam).flatMap(([paramName, data]) =>
          [`\t${paramName}: {`].concat(
            [
              `$parameters: {`,
              ...openApiSchemaToValibotSchema(data.schema, this.renderRef)
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
      ];
    },
  });
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
