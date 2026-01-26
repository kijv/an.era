import type { OpenAPIV3_1 } from 'openapi-types';

const PIPE_KEYS = ['examples', 'example', 'description'];

const shouldPipeSchema = (schema: OpenAPIV3_1.SchemaObject): boolean =>
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
  T extends OpenAPIV3_1.SchemaObject | OpenAPIV3_1.ReferenceObject,
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
    : !PIPE_KEYS.map((k) => used.includes(k)) && shouldPipeSchema(schema)
      ? [
          `v.pipe(`,
          ...openApiSchemaToValibotSchema(
            schema,
            renderRef,
            used.concat(
              Object.keys(schema).filter((k) => PIPE_KEYS.includes(k)),
            ),
          )
            .map((s, _, arr) => (s === arr.at(-1) ? `${s},` : `${s}`))
            .concat(
              'description' in schema && typeof schema.description === 'string'
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
                    `v.examples(${JSON.stringify(schema.examples ?? [schema.example])})`,
                  ]
                : [],
            )
            .map((s) => `\t${s}`),
          `)`,
        ]
      : ('allOf' in schema && schema.allOf != null) ||
          ('oneOf' in schema &&
            schema.oneOf != null) /*&& schema.discriminator == null*/
        ? [
            `v.${schema.allOf ? 'intersect' : 'union'}([`,
            ...(schema.allOf || schema.oneOf)!
              .flatMap((subSchema) =>
                openApiSchemaToValibotSchema(subSchema, renderRef).join('\n'),
              )
              .map((s) => `\t${s},`),
            `])`,
          ]
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
                !used.includes('required')
                ? [
                    `v.required(`,
                    ...openApiSchemaToValibotSchema(
                      schema,
                      renderRef,
                      used.concat('required'),
                    )
                      .map(
                        (s, i, arr) =>
                          `${i === 0 ? 'v.partial(' : ''}${s}${i === arr.length - 1 ? '),' : ''}`,
                      )
                      .concat(JSON.stringify(schema.required))
                      .map((s) => `\t${s}`),
                    `)`,
                  ]
                : schema.properties != null &&
                    Object.keys(schema.properties).length > 0
                  ? [
                      `v.object({`,
                      ...Object.entries(schema.properties)
                        .filter<[string, OpenAPIV3_1.SchemaObject]>(
                          ([, data]) =>
                            typeof data === 'object' && 'type' in data,
                        )
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
                      oneOf: (schema.examples ?? [schema.example])
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
                        ? [`v.null()`, `v.undefined()`]
                        : null
          : null) ?? ['v.any()'];

/**
 * Extracts schema references from a schema object
 */
function extractSchemaRefs(schema: OpenAPIV3_1.SchemaObject): Set<string> {
  const refs = new Set<string>();

  const extractRef = (obj: any) => {
    if (obj?.$ref && typeof obj.$ref === 'string') {
      // Extract schema name from #/components/schemas/SchemaName
      const match = obj.$ref.match(/#\/components\/schemas\/(.+)/);
      if (match) {
        refs.add(match[1]);
      }
    }
  };

  // Check oneOf
  if (schema.oneOf) {
    schema.oneOf.forEach(extractRef);
  }

  // Check allOf
  if (schema.allOf) {
    schema.allOf.forEach(extractRef);
  }

  // Check properties
  if (schema.properties) {
    Object.values(schema.properties).forEach(extractRef);
  }

  // Check items (for arrays)
  if (schema.type === 'array' && schema.items) {
    extractRef(schema.items);
  }

  return refs;
}

/**
 * Performs topological sort on schemas based on their dependencies
 * Ensures schemas are ordered so dependencies come before dependents
 *
 * @param schemas - Object containing OpenAPI schemas
 * @returns Sorted schemas object
 * @throws Error if circular dependencies are detected
 */
export function sortSchemasByDependencies(
  schemas: Record<string, OpenAPIV3_1.SchemaObject>,
): Record<string, OpenAPIV3_1.SchemaObject> {
  const schemaNames = Object.keys(schemas);
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const sorted: string[] = [];

  // Build dependency graph
  const dependencies = new Map<string, Set<string>>();
  for (const name of schemaNames) {
    if (schemas[name] == null) continue;
    dependencies.set(name, extractSchemaRefs(schemas[name]));
  }

  // Topological sort using DFS
  function visit(name: string, path: string[] = []): void {
    if (visited.has(name)) {
      return;
    }

    if (visiting.has(name)) {
      const cycle = [...path, name].join(' -> ');
      throw new Error(`Circular dependency detected: ${cycle}`);
    }

    visiting.add(name);
    const deps = dependencies.get(name) || new Set();

    for (const dep of deps) {
      // Only process dependencies that exist in our schemas
      if (dependencies.has(dep)) {
        visit(dep, [...path, name]);
      }
    }

    visiting.delete(name);
    visited.add(name);
    sorted.push(name);
  }

  // Visit all schemas
  for (const name of schemaNames) {
    visit(name);
  }

  // Rebuild schemas object in sorted order
  const sortedSchemas: Record<string, OpenAPIV3_1.SchemaObject> = {};
  for (const name of sorted) {
    if (schemas[name] == null) continue;
    sortedSchemas[name] = schemas[name];
  }

  return sortedSchemas;
}
