import { type SchemaObject, isRef } from 'oas/types';
import type { ParserContext } from './declaration';

export function sanitizeIdentifier(name: string): string {
  // Replace invalid characters with underscores
  let sanitized = name.replace(/[^a-zA-Z0-9_$]/g, '_');

  // Ensure it doesn't start with a number
  if (/^[0-9]/.test(sanitized)) {
    sanitized = `_${sanitized}`;
  }

  // Ensure it's not empty
  if (!sanitized) {
    sanitized = '_';
  }

  return sanitized;
}

export function generateTypeScriptType(
  schema: SchemaObject,
  typeName: string,
  context: ParserContext,
): string {
  if (typeof schema === 'boolean') {
    return schema ? 'any' : 'never';
  }

  if (isRef(schema)) {
    const refKey = schema.$ref;
    const refData = context.refs.get(refKey);
    if (refData) {
      context.importRef?.(refKey);
      return refData.schemaTypeName || refData.schemaName;
    }
    return 'any';
  }

  switch (schema.type) {
    case 'string':
      return 'string';
    case 'number':
    case 'integer':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'null':
      return 'null';
    case 'array':
      if (schema.items) {
        if (Array.isArray(schema.items)) {
          // Tuple type
          const itemTypes = schema.items.map((item, i) =>
            generateTypeScriptType(item, `${typeName}Item${i}`, context),
          );
          return `[${itemTypes.join(', ')}]`;
        } else {
          const itemType = generateTypeScriptType(
            schema.items,
            `${typeName}Item`,
            context,
          );
          return `${itemType}[]`;
        }
      }
      return 'any[]';
    case 'object':
      if (schema.properties) {
        const required = schema.required || [];
        const props = Object.entries(schema.properties).map(
          ([key, propSchema]) => {
            const propType = generateTypeScriptType(
              propSchema,
              `${typeName}${key.charAt(0).toUpperCase() + key.slice(1)}`,
              context,
            );
            const isRequired = required.includes(key);
            const keyStr = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
              ? key
              : `"${key}"`;
            return `${keyStr}${isRequired ? '' : '?'}: ${propType}`;
          },
        );

        let typeBody = `{ ${props.join('; ')} }`;

        // Handle additionalProperties
        if (schema.additionalProperties === true) {
          typeBody = `{ ${props.join('; ')}; [key: string]: any }`;
        } else if (typeof schema.additionalProperties === 'object') {
          const additionalType = generateTypeScriptType(
            schema.additionalProperties,
            `${typeName}Additional`,
            context,
          );
          typeBody = `{ ${props.join('; ')}; [key: string]: ${additionalType} }`;
        }

        return typeBody;
      }
      return 'Record<string, any>';
    default:
      if (schema.anyOf) {
        const types = schema.anyOf.map((s, i) =>
          generateTypeScriptType(s, `${typeName}Option${i}`, context),
        );
        return types.join(' | ');
      }
      if (schema.oneOf) {
        const types = schema.oneOf.map((s, i) =>
          generateTypeScriptType(s, `${typeName}Option${i}`, context),
        );
        return types.join(' | ');
      }
      if (schema.allOf) {
        const types = schema.allOf.map((s, i) =>
          generateTypeScriptType(s, `${typeName}Variant${i}`, context),
        );
        return types.join(' & ');
      }
      return 'any';
  }
}
