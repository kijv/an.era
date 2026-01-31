import type { ParserContext, ParseResult } from '../declaration';
import { generateTypeScriptType } from '../util';

export function handleRef(ref: string, context: ParserContext): ParseResult {
  const refData = context.refs.get(ref);

  if (refData) {
    // If the definition is currently being processed, this indicates a circular dependency.
    if (refData.isProcessing) {
      console.warn(
        `Circular dependency detected for ${ref}. Using v.lazy() for proper recursion.`,
      );
      // Mark as recursive for proper type annotation
      refData.isRecursive = true;
      // Use v.lazy() for proper recursive schema support
      // For recursive schemas, reference the schema (not the type)
      const schemaReference = refData.isRecursive
        ? `${refData.schemaName}Schema`
        : refData.schemaName;
      return {
        schema: `v.lazy(() => ${schemaReference})`,
        imports: new Set(['lazy']),
      };
    }
    // If the code for this ref has already been generated (e.g. processing nested refs within a definition),
    // and we encounter it again, we should use its schemaName.
    // However, the primary generation of definition code happens in jsonSchemaToValibot.ts.
    // Here, we just need to return the schemaName so it's used in the referencing schema.
    // For recursive schemas, always use the Schema suffix for consistency
    const schemaReference = refData.isRecursive
      ? `${refData.schemaName}Schema`
      : refData.schemaName;
    context.importRef?.(ref);
    return {
      schema: schemaReference,
      imports: new Set(),
      types: generateTypeScriptType({ $ref: ref }, refData.schemaName, context),
    }; // Imports for the definition itself are handled when it's declared.
  }

  // Fallback for unresolved refs (e.g., external refs or typos)
  console.warn(`$ref not found: ${ref}. Using v.any() as fallback.`);
  return { schema: 'v.any()', imports: new Set(['v']) }; // 'v' for v.any()
}
