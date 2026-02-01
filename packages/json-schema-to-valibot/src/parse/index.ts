import type {
  JsonSchemaObject,
  ParseResult,
  ParserContext,
  Schema,
} from '../declaration';
import { generateTypeScriptType } from '../util';
import { handleRef } from './util';
import { isRef } from 'oas/types';

export function parseSchema(
  schema: Schema,
  context: ParserContext,
): ParseResult {
  // Prevent infinite recursion
  if (context.depth > context.maxDepth) {
    return { schema: 'v.any()', imports: new Set(['any']) };
  }

  // Handle boolean schemas
  if (typeof schema === 'boolean') {
    if (schema === true) {
      return { schema: 'v.any()', imports: new Set(['any']) };
    } else {
      return { schema: 'v.never()', imports: new Set(['never']) };
    }
  }

  // Handle $ref
  if (isRef(schema)) {
    return handleRef(schema.$ref, context);
  }

  // Handle composition schemas first
  if (schema.allOf) return parseAllOf(schema, context);
  if (schema.anyOf) return parseAnyOf(schema, context);
  if (schema.oneOf) return parseOneOf(schema, context);
  if (schema.not) return parseNot(schema, context);

  // Handle const and enum
  if (schema.const !== undefined) return parseConst(schema);
  if (schema.enum) return parseEnum(schema, context);

  // Handle nullable
  if (schema.nullable === true) {
    const baseResult = parseSchemaType(schema, context);
    return {
      schema: `v.nullable(${baseResult.schema})`,
      imports: new Set([...baseResult.imports, 'nullable']),
      types: baseResult.types ? `${baseResult.types} | null` : undefined,
    };
  }

  return parseSchemaType(schema, context);
}

function parseSchemaType(
  schema: JsonSchemaObject,
  context: ParserContext,
): ParseResult {
  const type = schema.type;

  if (Array.isArray(type)) {
    // Multiple types - create a union
    const results = type.map((t) =>
      parseSchema({ ...schema, type: t }, context),
    );
    const schemas = results.map((r) => r.schema);
    const allImports = new Set<string>();
    results.forEach((r) => r.imports.forEach((imp) => allImports.add(imp)));
    allImports.add('union');

    return {
      schema: `v.union([${schemas.join(', ')}])`,
      imports: allImports,
      types: type
        .map((type) => generateTypeScriptType({ type }, '', context))
        .join(' | '),
    };
  }

  switch (type) {
    case 'string':
      return parseString(schema, context);
    case 'number':
    case 'integer':
      return parseNumber(schema, context);
    case 'boolean':
      return parseBoolean(schema, context);
    case 'array':
      return parseArray(schema, context);
    case 'object':
      return parseObject(schema, context);
    case 'null':
      return parseNull(schema, context);
    default:
      // No type specified or unknown type
      return { schema: 'v.any()', imports: new Set(['any']) };
  }
}

export function parseAllOf(
  schema: JsonSchemaObject,
  context: ParserContext,
): ParseResult {
  if (!schema.allOf || schema.allOf.length === 0) {
    return { schema: 'v.any()', imports: new Set(['any']) };
  }

  const allOf = schema.allOf.filter(
    (s) => typeof s === 'object' && ('type' in s || '$ref' in s),
  );

  if (allOf.length === 1) {
    // Single schema - just parse it directly
    const firstSchema = allOf[0];
    if (firstSchema == null) throw new Error('Invalid schema in allOf');
    return parseSchema(firstSchema, { ...context, depth: context.depth + 1 });
  }

  // For allOf, we need to intersect the schemas
  // In Valibot, this is typically done with v.intersect for objects
  // For other types, we'll try to merge constraints where possible

  const results = allOf.map((subSchema) => {
    if (subSchema == null) throw new Error('Invalid schema in allOf');
    return parseSchema(subSchema, { ...context, depth: context.depth + 1 });
  });

  const allImports = new Set<string>();
  const types: string[] = [];

  // Collect all imports and types
  results.forEach((result) => {
    result.imports.forEach((imp) => allImports.add(imp));
    if (result.types) {
      types.push(result.types);
    }
  });

  // Check if all schemas are objects - then we can use intersect
  const allObjects = allOf.every(
    (subSchema) =>
      typeof subSchema === 'object' &&
      subSchema !== null &&
      (subSchema.type === 'object' || subSchema.properties),
  );

  if (allObjects) {
    allImports.add('intersect');
    return {
      schema: `v.intersect([${results.map((r) => r.schema).join(', ')}])`,
      imports: allImports,
      types: types.length > 0 ? types.join(' & ') : undefined,
    };
  }

  // For non-objects, check if any schema is never (false)
  // If any schema in allOf is never, the result is never
  const hasNeverSchema = results.some(
    (result) => result.schema === 'v.never()',
  );
  if (hasNeverSchema) {
    allImports.add('never');
    return {
      schema: 'v.never()',
      imports: allImports,
      types: 'never',
    };
  }

  // Filter out any() schemas and use the most restrictive one
  const nonAnyResults = results.filter((result) => result.schema !== 'v.any()');
  if (nonAnyResults.length === 0) {
    // All schemas were any(), result is any()
    allImports.add('any');
    return {
      schema: 'v.any()',
      imports: allImports,
      types: types.length > 0 ? types.join(' & ') : undefined,
    };
  }

  // For now, use the first non-any schema (this is a simplification)
  const firstResult = nonAnyResults[0];
  if (!firstResult) {
    return { schema: 'v.any()', imports: new Set(['any']), types: undefined };
  }

  if (allOf.some(isRef)) {
    allImports.add('intersect');
    // const types = allOf
    //   .map((s) =>
    //     parseSchema(isRef(s) && context.resolveRef ? parseSchema(context.resolveRef), context).types
    //     isRef(s)
    //       ? context.resolveRef
    //         ? parseSchema(s, context).types
    //         : undefined
    //       : typeof s === "object" && ? s.types : null,
    //   )
    //   .filter(Boolean);
    return {
      schema: `v.intersect([${results.map((r) => r.schema).join(', ')}])`,
      imports: allImports,
      types: types.length > 0 ? types.join(' & ') : undefined,
    };
  }

  return {
    schema: firstResult.schema,
    imports: allImports,
    types: types.length > 0 ? types.join(' & ') : firstResult.types,
  };
}

export function parseAnyOf(
  schema: JsonSchemaObject,
  context: ParserContext,
): ParseResult {
  if (!schema.anyOf || schema.anyOf.length === 0) {
    return { schema: 'v.any()', imports: new Set(['any']) };
  }

  if (schema.anyOf.length === 1) {
    // Single schema - just parse it directly
    const firstSchema = schema.anyOf[0];
    if (firstSchema == null) throw new Error('Invalid schema in anyOf');
    return parseSchema(firstSchema, { ...context, depth: context.depth + 1 });
  }

  // Multiple schemas - create union
  const results = schema.anyOf.map((subSchema) => {
    if (subSchema == null) throw new Error('Invalid schema in anyOf');
    return parseSchema(subSchema, { ...context, depth: context.depth + 1 });
  });

  const schemas = results.map((r) => r.schema);
  const allImports = new Set(['union']);
  const types: string[] = [];

  // Collect all imports and types
  results.forEach((result) => {
    result.imports.forEach((imp) => allImports.add(imp));
    if (result.types) {
      types.push(result.types);
    }
  });

  // Filter out never() schemas for anyOf
  const nonNeverSchemas = schemas.filter((schema) => schema !== 'v.never()');

  if (nonNeverSchemas.length === 0) {
    // All schemas were never, result is never
    allImports.add('never');
    return {
      schema: 'v.never()',
      imports: allImports,
      types: 'never',
    };
  }

  if (nonNeverSchemas.length === 1) {
    // Only one non-never schema, return it directly
    const nonNeverResults = results.find((r) => r.schema !== 'v.never()');
    const result = nonNeverResults[0];
    if (!result) {
      return {
        schema: 'v.never()',
        imports: new Set(['never']),
        types: 'never',
      };
    }
    return {
      schema: result.schema,
      imports: allImports,
      types: result.types,
    };
  }

  const nonNeverTypes = types.filter(
    (_, i) => results[i]?.schema !== 'v.never()',
  );
  return {
    schema: `v.union([${nonNeverSchemas.join(', ')}])`,
    imports: allImports,
    types: nonNeverTypes.length > 0 ? nonNeverTypes.join(' | ') : undefined,
  };
}

export function parseOneOf(
  schema: JsonSchemaObject,
  context: ParserContext,
): ParseResult {
  if (!schema.oneOf || schema.oneOf.length === 0) {
    return { schema: 'v.any()', imports: new Set(['any']) };
  }

  if (schema.oneOf.length === 1) {
    // Single schema - just parse it directly
    const firstSchema = schema.oneOf[0];
    if (firstSchema == null) throw new Error('Invalid schema in oneOf');
    return parseSchema(firstSchema, { ...context, depth: context.depth + 1 });
  }

  // Multiple schemas - create variant (discriminated union)
  // For simplicity, we'll use union like anyOf
  // A full implementation might try to detect discriminator fields
  const results = schema.oneOf.map((subSchema) => {
    if (subSchema == null) throw new Error('Invalid schema in oneOf');
    return parseSchema(subSchema, { ...context, depth: context.depth + 1 });
  });

  const schemas = results.map((r) => r.schema);
  const allImports = new Set(['union']);
  const types: string[] = [];

  // Collect all imports and types
  results.forEach((result) => {
    result.imports.forEach((imp) => allImports.add(imp));
    if (result.types) {
      types.push(result.types);
    }
  });

  // Filter out never() schemas for oneOf
  const nonNeverSchemas = schemas.filter((schema) => schema !== 'v.never()');

  if (nonNeverSchemas.length === 0) {
    // All schemas were never, result is never
    allImports.add('never');
    return {
      schema: 'v.never()',
      imports: allImports,
      types: 'never',
    };
  }

  if (nonNeverSchemas.length === 1) {
    // Only one non-never schema, return it directly
    const nonNeverResults = results.find((r) => r.schema !== 'v.never()');
    const result = nonNeverResults[0]!;
    if (!result) {
      return {
        schema: 'v.never()',
        imports: new Set(['never']),
        types: 'never',
      };
    }
    return {
      schema: result.schema,
      imports: allImports,
      types: result.types,
    };
  }

  if (schema.oneOf.some(isRef)) {
    return {
      schema: `v.union([${results.map((r) => r.schema).join(', ')}])`,
      imports: allImports,
      types: types.length > 0 ? types.join(' | ') : undefined,
    };
  }

  const nonNeverTypes = types.filter(
    (_, i) => results[i]?.schema !== 'v.never()',
  );
  return {
    schema: `v.union([${nonNeverSchemas.join(', ')}])`,
    imports: allImports,
    types: nonNeverTypes.length > 0 ? nonNeverTypes.join(' | ') : undefined,
  };
}

export function parseConst(schema: JsonSchemaObject): ParseResult {
  const value = schema.const;

  // For primitive values, use literal which is more efficient
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return {
      schema: `v.literal(${JSON.stringify(value)})`,
      imports: new Set(['literal']),
      types: typeof value === 'string' ? `"${value}"` : JSON.stringify(value),
    };
  }

  // For arrays, use tuple validation
  if (Array.isArray(value)) {
    const itemSchemas: string[] = [];
    const allImports = new Set(['tuple']);
    const itemTypes: string[] = [];

    for (const item of value) {
      const itemResult = parseConst({ const: item });
      itemSchemas.push(itemResult.schema);
      itemResult.imports.forEach((imp) => allImports.add(imp));
      itemTypes.push(itemResult.types || 'any');
    }

    return {
      schema: `v.tuple([${itemSchemas.join(', ')}])`,
      imports: allImports,
      types: `[${itemTypes.join(', ')}]`,
    };
  }

  // For objects, use object validation
  if (typeof value === 'object' && value !== null) {
    const properties: string[] = [];
    const allImports = new Set(['object']);
    const propertyTypes: string[] = [];

    for (const [key, propValue] of Object.entries(value)) {
      const propResult = parseConst({ const: propValue });
      properties.push(`${JSON.stringify(key)}: ${propResult.schema}`);
      propResult.imports.forEach((imp) => allImports.add(imp));

      const keyStr = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
        ? key
        : JSON.stringify(key);
      propertyTypes.push(`${keyStr}: ${propResult.types || 'any'}`);
    }

    return {
      schema: `v.object({ ${properties.join(', ')} })`,
      imports: allImports,
      types: `{ ${propertyTypes.join(', ')} }`,
    };
  }

  // Fallback for any other types
  return {
    schema: `v.literal(${JSON.stringify(value)})`,
    imports: new Set(['literal']),
    types: JSON.stringify(value),
  };
}

export function parseEnum(
  schema: JsonSchemaObject,
  _context: ParserContext,
): ParseResult {
  if (!schema.enum || schema.enum.length === 0) {
    return { schema: 'v.any()', imports: new Set(['any']) };
  }

  // Check if all enum values are primitives
  const hasComplexValues = schema.enum.some(
    (value) => value !== null && typeof value === 'object',
  );

  if (schema.enum.length === 1) {
    // Single enum value - delegate to parseConst
    return parseConst({ const: schema.enum[0] });
  }

  if (hasComplexValues) {
    // Multiple enum values with at least one complex type - use union of individual validators
    const validators: string[] = [];
    const imports = new Set<string>(['union']);
    const types: string[] = [];

    for (const value of schema.enum) {
      const valueResult = parseConst({ const: value });
      validators.push(valueResult.schema);
      valueResult.imports.forEach((imp) => imports.add(imp));
      types.push(valueResult.types || 'any');
    }

    return {
      schema: `v.union([${validators.join(', ')}])`,
      imports,
      types: types.join(' | '),
    };
  } else {
    // Multiple primitive enum values - use picklist
    const values = schema.enum.map((v) => JSON.stringify(v));
    const types = schema.enum
      .map((v) => (typeof v === 'string' ? `"${v}"` : JSON.stringify(v)))
      .join(' | ');

    return {
      schema: `v.picklist([${values.join(', ')}])`,
      imports: new Set(['picklist']),
      types,
    };
  }
}

export function parseNot(
  schema: JsonSchemaObject,
  context: ParserContext,
): ParseResult {
  if (!schema.not) {
    return { schema: 'v.any()', imports: new Set(['any']) };
  }

  // Parse the negated schema
  const notResult = parseSchema(schema.not, {
    ...context,
    depth: context.depth + 1,
  });
  const allImports = new Set(['custom', ...notResult.imports]);

  // Create a custom validation that negates the schema
  const customValidation = `v.custom((input) => {
    try {
      v.parse(${notResult.schema}, input);
      return false; // If parsing succeeds, validation fails
    } catch {
      return true; // If parsing fails, validation succeeds
    }
  }, "Value must not match the specified schema")`;

  return {
    schema: customValidation,
    imports: allImports,
    types: 'unknown', // Type cannot be determined for negation
  };
}

export function parseObject(
  schema: JsonSchemaObject,
  context: ParserContext,
): ParseResult {
  const imports = new Set(['object']);

  // Parse properties
  const properties: Record<string, string> = {};
  const propertyTypes: Record<string, string> = {};
  const allImports = new Set(imports);

  if (schema.properties) {
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      const propResult = parseSchema(propSchema, {
        ...context,
        depth: context.depth + 1,
        currentPath: [...context.currentPath, key],
      });

      properties[key] = propResult.schema;
      propertyTypes[key] = propResult.types || 'any';

      // Add imports from property schemas
      propResult.imports.forEach((imp) => allImports.add(imp));
    }
  }

  // Handle required properties
  const required =
    (Array.isArray(schema.required) ? schema.required : null) || [];

  // Build properties object
  const propsEntries = Object.entries(properties).map(([key, propSchema]) => {
    const isRequired = required.includes(key);

    if (isRequired) {
      return `${JSON.stringify(key)}: ${propSchema}`;
    } else {
      // Optional property - wrap with v.optional
      allImports.add('optional');
      return `${JSON.stringify(key)}: v.optional(${propSchema})`;
    }
  });

  const propsObject =
    propsEntries.length > 0 ? `{ ${propsEntries.join(', ')} }` : '{}';

  // Handle additionalProperties
  let schemaStr: string;

  if (schema.additionalProperties === false) {
    // Strict object - no additional properties allowed beyond those in `properties`
    schemaStr = `v.strictObject(${propsObject})`;
    allImports.add('strictObject');
    allImports.delete('object'); // v.object might have been added by default
  } else if (
    schema.additionalProperties &&
    typeof schema.additionalProperties === 'object'
  ) {
    // Additional properties are allowed and must conform to a specific schema
    const additionalPropsSchema = schema.additionalProperties as Schema; // Cast for type safety
    const additionalResult = parseSchema(additionalPropsSchema, {
      ...context,
      depth: context.depth + 1, // Ensure depth is managed for nested parsing
      currentPath: [...context.currentPath, 'additionalProperties'], // Update current path
    });

    additionalResult.imports.forEach((imp) => allImports.add(imp));

    if (propsEntries.length > 0) {
      // Both properties and additionalProperties (as schema) are defined
      // Use v.object(shape, rest)
      schemaStr = `v.objectWithRest(${propsObject}, ${additionalResult.schema})`;
      // v.object is already in allImports by default or will be added.
      // The 'rest' argument for v.object doesn't require a separate 'v.rest' import,
      // it's a part of v.object's signature.
    } else {
      // Only additionalProperties (as schema) is defined, no specific properties
      // Use v.record(keyType, valueType) -> v.record(valueType) assuming string keys
      // For JSON schema, keys are always strings.
      schemaStr = `v.record(${additionalResult.schema})`;
      allImports.add('record');
      allImports.delete('object'); // v.object might have been added by default
    }
  } else {
    // Default behavior: additionalProperties is true or undefined (or not a boolean/object)
    // Allow any additional properties
    schemaStr = `v.object(${propsObject})`;
    // v.object is already in allImports by default.
  }

  // Build TypeScript type
  const typeEntries = Object.entries(propertyTypes).map(([key, type]) => {
    const isRequired = required.includes(key);
    const keyStr = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
      ? key
      : JSON.stringify(key);
    return isRequired ? `${keyStr}: ${type}` : `${keyStr}?: ${type}`;
  });

  const objectType =
    typeEntries.length > 0 ? `{ ${typeEntries.join(', ')} }` : '{}';

  return {
    schema: schemaStr,
    imports: allImports,
    types: objectType,
  };
}

export function parseArray(
  schema: JsonSchemaObject,
  context: ParserContext,
): ParseResult {
  const imports = new Set(['array']);
  const constraints: string[] = [];

  // Parse items schema
  let itemsSchema = 'v.any()';
  let itemsImports = new Set<string>();
  let itemsType = 'any';

  if (schema.items) {
    if (Array.isArray(schema.items)) {
      // Tuple array - use first item as base type for now
      // Full tuple support would require more complex logic
      if (schema.items.length > 0 && schema.items[0]) {
        const firstItemResult = parseSchema(schema.items[0], {
          ...context,
          depth: context.depth + 1,
        });
        itemsSchema = firstItemResult.schema;
        itemsImports = firstItemResult.imports;
        itemsType = firstItemResult.types || 'any';
      }
    } else {
      // Single items schema
      const itemsResult = parseSchema(schema.items, {
        ...context,
        depth: context.depth + 1,
      });
      itemsSchema = itemsResult.schema;
      itemsImports = itemsResult.imports;
      itemsType = itemsResult.types || 'any';
    }
  } else {
    itemsImports.add('any');
  }

  // Add length constraints
  if (typeof schema.minItems === 'number') {
    constraints.push(`v.minLength(${schema.minItems})`);
    imports.add('minLength');
  }

  if (typeof schema.maxItems === 'number') {
    constraints.push(`v.maxLength(${schema.maxItems})`);
    imports.add('maxLength');
  }

  // Add unique items constraint
  if (schema.uniqueItems === true) {
    constraints.push(
      'v.custom((input) => Array.isArray(input) && new Set(input).size === input.length, "Items must be unique")',
    );
    imports.add('custom');
  }

  // Combine all imports
  const allImports = new Set([...imports, ...itemsImports]);

  // Build the schema string
  const arrayBase = `v.array(${itemsSchema})`;
  const schemaStr =
    constraints.length > 0
      ? `v.pipe(${arrayBase}, ${constraints.join(', ')})`
      : arrayBase;

  // Add pipe import if needed
  if (constraints.length > 0) {
    allImports.add('pipe');
  }

  return {
    schema: schemaStr,
    imports: allImports,
    types: `(${itemsType})[]`,
  };
}

export function parseString(
  schema: JsonSchemaObject,
  context: ParserContext,
): ParseResult {
  const imports = new Set(['string']);
  const constraints: string[] = [];

  // Add length constraints
  if (typeof schema.minLength === 'number') {
    constraints.push(`v.minLength(${schema.minLength})`);
    imports.add('minLength');
  }

  if (typeof schema.maxLength === 'number') {
    constraints.push(`v.maxLength(${schema.maxLength})`);
    imports.add('maxLength');
  }

  // Add pattern constraint
  if (schema.pattern) {
    constraints.push(`v.regex(/${schema.pattern}/)`);
    imports.add('regex');
  }

  // Add format constraints
  if (schema.format) {
    switch (schema.format) {
      case 'email':
        constraints.push('v.email()');
        imports.add('email');
        break;
      case 'uri':
      case 'url':
        constraints.push('v.url()');
        imports.add('url');
        break;
      case 'uuid':
        constraints.push('v.uuid()');
        imports.add('uuid');
        break;
      case 'date':
        constraints.push('v.isoDate()');
        imports.add('isoDate');
        break;
      case 'date-time':
        constraints.push('v.isoDateTime()');
        imports.add('isoDateTime');
        break;
      case 'time':
        constraints.push('v.isoTime()');
        imports.add('isoTime');
        break;
      case 'ipv4':
        constraints.push('v.ipv4()');
        imports.add('ipv4');
        break;
      case 'ipv6':
        constraints.push('v.ipv6()');
        imports.add('ipv6');
        break;
      default:
        // Unknown format - skip
        break;
    }
  }

  // Build the schema string
  const schemaStr =
    constraints.length > 0
      ? `v.pipe(v.string(), ${(context.constraints ? context.constraints(constraints) : constraints).join(', ')})`
      : 'v.string()';

  if (constraints.length > 0) {
    imports.add('pipe');
  }

  return {
    schema: schemaStr,
    imports,
    types: 'string',
  };
}

export function parseNumber(
  schema: JsonSchemaObject,
  _context: ParserContext,
): ParseResult {
  const isInteger = schema.type === 'integer';
  const imports = new Set([isInteger ? 'integer' : 'number']);
  const constraints: string[] = [];

  // Add minimum constraint
  if (typeof schema.minimum === 'number') {
    constraints.push(`v.minValue(${schema.minimum})`);
    imports.add('minValue');
  }

  // Add maximum constraint
  if (typeof schema.maximum === 'number') {
    constraints.push(`v.maxValue(${schema.maximum})`);
    imports.add('maxValue');
  }

  // Add exclusive minimum constraint
  if (typeof schema.exclusiveMinimum === 'number') {
    constraints.push(
      `v.minValue(${schema.exclusiveMinimum}, { exclusive: true })`,
    );
    imports.add('minValue');
  } else if (
    schema.exclusiveMinimum === true &&
    typeof schema.minimum === 'number'
  ) {
    constraints.push(`v.minValue(${schema.minimum}, { exclusive: true })`);
    imports.add('minValue');
  }

  // Add exclusive maximum constraint
  if (typeof schema.exclusiveMaximum === 'number') {
    constraints.push(
      `v.maxValue(${schema.exclusiveMaximum}, { exclusive: true })`,
    );
    imports.add('maxValue');
  } else if (
    schema.exclusiveMaximum === true &&
    typeof schema.maximum === 'number'
  ) {
    constraints.push(`v.maxValue(${schema.maximum}, { exclusive: true })`);
    imports.add('maxValue');
  }

  // Add multiple of constraint
  if (typeof schema.multipleOf === 'number') {
    constraints.push(`v.multipleOf(${schema.multipleOf})`);
    imports.add('multipleOf');
  }

  // Build the schema string - use number() for both number and integer
  const baseSchema = 'v.number()';
  const schemaStr =
    constraints.length > 0
      ? `v.pipe(${baseSchema}, ${constraints.join(', ')})`
      : baseSchema;

  if (constraints.length > 0) {
    imports.add('pipe');
  }

  // Add integer validation if needed
  if (isInteger && constraints.length === 0) {
    imports.delete('integer');
    imports.add('number');
    imports.add('pipe');
    imports.add('integer');
    return {
      schema: `v.pipe(v.number(), v.integer())`,
      imports,
      types: 'number',
    };
  } else if (isInteger) {
    imports.delete('integer');
    imports.add('integer');
    constraints.unshift('v.integer()');
  }

  return {
    schema: schemaStr,
    imports,
    types: 'number',
  };
}

export function parseBoolean(
  _schema: JsonSchemaObject,
  _context: ParserContext,
): ParseResult {
  return {
    schema: 'v.boolean()',
    imports: new Set(['boolean']),
    types: 'boolean',
  };
}

export function parseNull(
  _schema: JsonSchemaObject,
  _context: ParserContext,
): ParseResult {
  return {
    schema: 'v.null_()',
    imports: new Set(['null_']),
    types: 'null',
  };
}
