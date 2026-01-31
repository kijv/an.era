import type { SchemaObject } from 'oas/types';

export type JsonSchemaObject = SchemaObject;

export type Schema = SchemaObject | boolean;

type CommonFunctions = {
  constraints?: (s: string[]) => string[];
  renameRef?: (ref: string, types: boolean) => string | undefined;
  importRef?: (ref: string) => void;
  resolveRef?: (ref: string) => JsonSchemaObject;
};

export type ConversionOptions = {
  name?: string;
  module?: 'esm' | 'cjs' | 'none';
  withTypes?: boolean;
  withJsDoc?: boolean;
  maxDepth?: number;
  exportDefinitions?: boolean;
  definitions?: Record<string, string>;
} & CommonFunctions;

export type ParserContext = {
  refs: Map<
    string,
    {
      schemaName: string;
      rawSchema: SchemaObject;
      isProcessing?: boolean;
      generatedCode?: string;
      generatedImports?: Set<string>;
      isRecursive?: boolean;
      schemaTypeName?: string;
    }
  >;
  depth: number;
  maxDepth: number;
  currentPath: string[];
} & CommonFunctions;

export interface ParseResult {
  schema: string;
  imports: Set<string>;
  types?: string | undefined;
}
