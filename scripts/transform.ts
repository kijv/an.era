import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';

const PIPE_KEYS = ['examples', 'example', 'description'];

const shouldPipeSchema = (
  schema: OpenAPIV3.SchemaObject | OpenAPIV3_1.SchemaObject,
): boolean =>
  ('examples' in schema &&
    schema.examples != null &&
    schema.examples?.length > 0) ||
  ('example' in schema && schema.example != null) ||
  ('description' in schema && typeof schema.description === 'string');

export const defaultRenderRef = (ref: string) => {
  const parts = ref.replace(/^#/, '').split('/').filter(Boolean);

  const suffix = ['components/responses'].includes(parts.slice(0, -1).join('/'))
    ? ''
    : 'Schema';

  return `${parts.at(-1)}${suffix}`;
};

export const openApiSchemaToValibotSchema = <
  T extends
    | OpenAPIV3.SchemaObject
    | OpenAPIV3.ReferenceObject
    | OpenAPIV3_1.SchemaObject
    | OpenAPIV3_1.ReferenceObject,
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
    : false &&
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
                'description' in schema &&
                  typeof schema.description === 'string'
                  ? [
                      `v.metadata({`,
                      `\tdescription: ${JSON.stringify(schema.description)}`,
                      '}),',
                    ]
                  : [],
              )
              .concat(
                ('examples' in schema &&
                  schema.examples != null &&
                  schema.examples?.length > 0) ||
                  ('example' in schema && schema.example != null)
                  ? [
                      `v.examples(${JSON.stringify('examples' in schema ? schema.examples : [schema.example].filter(Boolean))})`,
                    ]
                  : [],
              )
              .map((s) => `\t${s}`),
          )
          .concat(')')
      : ('allOf' in schema && schema.allOf != null) ||
          ('oneOf' in schema &&
            schema.oneOf != null) /*&& schema.discriminator == null*/
        ? (schema.allOf != null &&
            schema.allOf.filter((a) => 'type' in a || '$ref' in a).length >
              1) ||
          schema.oneOf != null
          ? [
              `v.${schema.allOf ? 'intersect' : 'union'}([`,
              ...(schema.allOf || schema.oneOf)!
                .flatMap((subSchema) =>
                  openApiSchemaToValibotSchema(subSchema, renderRef).join('\n'),
                )
                .map((s) => `\t${s},`),
              `])`,
            ]
          : schema.allOf != null
            ? openApiSchemaToValibotSchema(
                schema.allOf.find((a) => 'type' in a || '$ref' in a)!,
                renderRef,
              )
            : null
        : /*"oneOf" in schema &&
            schema.oneOf != null &&
            "discriminator" in schema &&
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
                    openApiSchemaToValibotSchema(subSchema, renderRef).join("\n"),
                  ].join("\n"),
                )
                .map((s) => `\t${s},`),
              `])`,
            ]
          :*/ 'type' in schema
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
                  schema.required.includes(k),
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
                  : openApiSchemaToValibotSchema({
                      oneOf: ('examples' in schema
                        ? (schema.examples ?? [])
                        : [schema.example]
                      )
                        .filter(Boolean)
                        .filter(Boolean)
                        .flatMap((e) => Object.values(e).map((v) => typeof v))
                        .reduce((acc, v) => {
                          if (!acc.includes(v)) {
                            acc.push(v);
                          }
                          return acc;
                        }, [] as string[])
                        .map((type) => ({ type }) as OpenAPIV3_1.SchemaObject),
                    }).map(
                      (l, i, arr) =>
                        `${i === 0 ? 'v.record(v.string(), ' : ''}${l}${i === arr.length - 1 ? ')' : ''}`,
                    )
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
                    ? [`v.picklist(${JSON.stringify(schema.enum)})`]
                    : [`v.string()`]
                  : schema.type === 'number' || schema.type === 'boolean'
                    ? [`v.${schema.type}()`]
                    : schema.type === 'integer'
                      ? [`v.pipe(v.number(), v.integer())`]
                      : schema.type === 'null'
                        ? ['v.null(), v.undefined()']
                        : null
          : null) ?? [];
