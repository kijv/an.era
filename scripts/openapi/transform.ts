import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';

const METADATA: boolean = true;
export const ONE_OF_DISCRIM: boolean = false;

const PIPE_KEYS = ['examples', 'example', 'description', 'title'];

const shouldPipeSchema = (
  schema: OpenAPIV3.SchemaObject | OpenAPIV3_1.SchemaObject,
): boolean =>
  ('examples' in schema &&
    schema.examples != null &&
    schema.examples?.length > 0) ||
  ('example' in schema && schema.example != null) ||
  ('description' in schema && typeof schema.description === 'string') ||
  ('title' in schema && typeof schema.name === 'string');

const mergeSchemas = <
  T extends
    | OpenAPIV3.BaseSchemaObject
    | (OpenAPIV3_1.BaseSchemaObject & {
        type: 'object';
      }),
>(
  schemas: T[],
):
  | OpenAPIV3.BaseSchemaObject
  | (OpenAPIV3_1.BaseSchemaObject & {
      type: 'object';
    }) => ({
  type: 'object',
  properties: Object.fromEntries(
    schemas.flatMap((s) => Object.entries(s.properties ?? {})),
  ),
});

export const defaultRenderRef = (ref: string) => {
  const parts = ref.replace(/^#/, '').split('/').filter(Boolean);

  const suffix = ['components/responses'].includes(parts.slice(0, -1).join('/'))
    ? ''
    : 'Schema';

  return `${parts.at(-1)}${suffix}`;
};

export const openApiSchemaToValibotSchema = <
  T extends (
    | OpenAPIV3.SchemaObject
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3_1.SchemaObject
    | OpenAPIV3_1.ReferenceObject
  ) & {
    title?: string;
  },
>(
  schema: T,
  renderRef: (
    ref: string,
    kind: string,
  ) => string | null | undefined = defaultRenderRef,
  used: string[] = [],
): string[] =>
  ('$ref' in schema && typeof schema.$ref === 'string'
    ? [
        renderRef(schema.$ref, schema.$ref.split('/').slice(1, -1).join('/')) ??
          defaultRenderRef(schema.$ref),
      ]
    : METADATA &&
        !PIPE_KEYS.some((k) => used.includes(k)) &&
        shouldPipeSchema(
          schema as OpenAPIV3.SchemaObject | OpenAPIV3_1.SchemaObject,
        )
      ? [`v.pipe(`]
          .concat(
            (() => {
              const arr = openApiSchemaToValibotSchema(
                schema,
                renderRef,
                used.concat(
                  Object.keys(schema).filter((k) => PIPE_KEYS.includes(k)),
                ),
              );

              return arr.length === 0 ? ['v.any()'] : arr;
            })()
              .map((l, i, arr) => `${l}${i === arr.length - 1 ? ',' : ''}`)
              .concat(
                'title' in schema && typeof schema.title === 'string'
                  ? [`v.title(${JSON.stringify(schema.title)}),`]
                  : [],
              )
              .concat(
                'description' in schema &&
                  typeof schema.description === 'string'
                  ? [`v.description(${JSON.stringify(schema.description)}),`]
                  : [],
              )
              .concat(
                ('examples' in schema &&
                  schema.examples != null &&
                  schema.examples?.length > 0) ||
                  ('example' in schema && schema.example != null)
                  ? [
                      `v.examples(${JSON.stringify('examples' in schema ? schema.examples : [schema.example].filter(Boolean))}),`,
                    ]
                  : [],
              )
              .map((s) => `\t${s}`),
          )
          .concat(')')
      : ('allOf' in schema && schema.allOf != null) ||
          ('oneOf' in schema &&
            schema.oneOf != null &&
            (!ONE_OF_DISCRIM || schema.discriminator == null))
        ? (schema.allOf != null &&
            schema.allOf.filter((a) => 'type' in a || '$ref' in a).length >
              1) ||
          schema.oneOf != null
          ? [
              schema.oneOf != null
                ? schema.oneOf.filter((s) => !('type' in s) || s.type != 'null')
                    .length === 1 && schema.oneOf.length !== 1
                  ? 'v.nullish('
                  : 'v.union(['
                : 'v.intersect([',
              ...(schema.oneOf != null
                ? schema.oneOf.filter((s) => !('type' in s) || s.type != 'null')
                    .length === 1 && schema.oneOf.length !== 1
                  ? schema.oneOf?.filter(
                      (s) => !('type' in s) || s.type != 'null',
                    )
                  : schema.oneOf
                : schema.allOf)!
                .flatMap((subSchema) =>
                  openApiSchemaToValibotSchema(subSchema, renderRef).join('\n'),
                )
                .map((s) => `\t${s},`),
              schema.oneOf != null &&
              schema.oneOf?.filter((s) => !('type' in s) || s.type != 'null')
                .length === 1 &&
              schema.oneOf.length !== 1
                ? ')'
                : '])',
            ]
          : schema.allOf != null
            ? openApiSchemaToValibotSchema(
                schema.allOf.find((a) => 'type' in a || '$ref' in a)!,
                renderRef,
              )
            : null
        : ONE_OF_DISCRIM &&
            'oneOf' in schema &&
            schema.oneOf != null &&
            'discriminator' in schema &&
            schema.discriminator != null
          ? [
              `v.variant(${JSON.stringify(schema.discriminator.propertyName)}, [`,
              ...schema.oneOf
                .flatMap((subSchema) =>
                  [
                    // `v.omit(`,
                    // ...[
                    //   ...[
                    //     `${openApiSchemaToValibotSchema(subSchema, n + 1).join("\n")},`,
                    //     `${JSON.stringify(schema.discriminator!.propertyName)}`,
                    //   ].map((s) => `\t${s}`),
                    //   `)`,
                    // ].map((s) => `\t${s}`),
                    openApiSchemaToValibotSchema(
                      'allOf' in subSchema
                        ? mergeSchemas(subSchema.allOf)
                        : subSchema,
                      renderRef,
                    ).join('\n'),
                  ].join('\n'),
                )
                .map((s) => `\t${s},`),
              `])`,
            ]
          : 'type' in schema
            ? Array.isArray(schema.type)
              ? [
                  `v.union([`,
                  ...schema.type
                    .flatMap((type) =>
                      openApiSchemaToValibotSchema({
                        type,
                      }),
                    )
                    .map((s) => `\t${s},`),
                  `])`,
                ]
              : schema.type === 'object'
                ? 'required' in schema &&
                  schema.required != null &&
                  schema.required.length > 0 &&
                  !used.includes('required') &&
                  Object.keys(schema.properties ?? {}).every((k) =>
                    schema.required?.includes(k),
                  )
                  ? [
                      `v.required(`,
                      ...openApiSchemaToValibotSchema(
                        schema,
                        renderRef,
                        used.concat('required'),
                      )
                        .map(
                          (s, i, arr) =>
                            `${i === 0 && Object.keys(schema.properties ?? {}).length != schema.required?.length ? 'v.partial(' : ''}${s}${i === arr.length - 1 ? `${Object.keys(schema.properties ?? {}).length != schema.required?.length ? ')' : ''},` : ''}`,
                        )
                        .concat(
                          JSON.stringify(
                            schema.required.filter(
                              (r) => r in (schema.properties ?? {}),
                            ),
                          ),
                        )
                        .map((s) => `\t${s}`),
                      `)`,
                    ]
                  : 'additionalProperties' in schema &&
                      schema.additionalProperties != null &&
                      typeof schema.additionalProperties === 'object' &&
                      !used.includes('additionalProperties')
                    ? ['v.objectWithRest(']
                        .concat(
                          openApiSchemaToValibotSchema(
                            schema,
                            renderRef,
                            used.concat('additionalProperties'),
                          )
                            .map(
                              (s, i, arr) =>
                                `${i === 0 ? s.replace('v.object(', '') : i === arr.length - 1 ? s.replace(')', '') : s}${i === arr.length - 1 ? ',' : ''}`,
                            )
                            .concat(
                              openApiSchemaToValibotSchema(
                                schema.additionalProperties,
                              ),
                            )
                            .map((s) => `\t${s}`),
                        )
                        .concat(')')
                    : schema.properties != null &&
                        Object.keys(schema.properties).length > 0
                      ? [
                          `v.object({`,
                          ...Object.entries(schema.properties)
                            .filter(([, data]) => typeof data === 'object')
                            .flatMap<string>(([key, data]) => {
                              const lines = openApiSchemaToValibotSchema(
                                data,
                                renderRef,
                              );
                              return lines.length > 1
                                ? [`${key}: ${lines[0]!}`].concat(
                                    lines
                                      .slice(1, lines.length - 1)
                                      .map((s) => `\t${s}`),
                                    `${lines.at(-1)},`,
                                  )
                                : lines.length === 1
                                  ? [`${key}: ${lines[0]!}`].map((s) =>
                                      s != null || s != '' ? `${s},` : s,
                                    )
                                  : [];
                            })
                            .map((s) => `\t${s}`),
                          '})',
                        ].filter(Boolean)
                      : ('examples' in schema && schema.examples != null
                            ? schema.examples
                            : [schema.example].filter(Boolean)
                          ).length > 0
                        ? openApiSchemaToValibotSchema({
                            oneOf:
                              'examples' in schema && schema.examples != null
                                ? schema.examples
                                : [schema.example]
                                    .filter(Boolean)
                                    .flatMap((e) =>
                                      Object.values(e).map((v) => typeof v),
                                    )
                                    .reduce((acc, v) => {
                                      if (!acc.includes(v)) {
                                        acc.push(v);
                                      }
                                      return acc;
                                    }, [] as string[])
                                    .map(
                                      (type) =>
                                        ({ type }) as OpenAPIV3_1.SchemaObject,
                                    ),
                          }).map(
                            (l, i, arr) =>
                              `${i === 0 ? 'v.record(v.string(), ' : ''}${l}${i === arr.length - 1 ? ')' : ''}`,
                          )
                        : ['v.record(v.string(), v.any())']
                : schema.type === 'array'
                  ? [
                      `v.array(`,
                      ...openApiSchemaToValibotSchema(
                        schema.items as OpenAPIV3_1.SchemaObject,
                        renderRef,
                      ).map((s) => `\t${s}`),
                      `)`,
                    ]
                  : schema.type === 'string'
                    ? schema.enum != null && schema.enum?.length > 0
                      ? [
                          schema.enum.length > 1
                            ? `v.picklist(${JSON.stringify(schema.enum)})`
                            : `v.literal(${JSON.stringify(schema.enum[0])})`,
                        ]
                      : [`v.string()`]
                    : schema.type === 'number' || schema.type === 'boolean'
                      ? [`v.${schema.type}()`]
                      : schema.type === 'integer'
                        ? [`v.pipe(v.number(), v.integer())`]
                        : schema.type === 'null'
                          ? ['v.null(), v.undefined()']
                          : null
            : null) ?? [];
