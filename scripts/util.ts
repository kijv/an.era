import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';

export type OpenAPISchemasCollection = Record<
  string,
  | OpenAPIV3.SchemaObject
  | OpenAPIV3.ReferenceObject
  | OpenAPIV3_1.SchemaObject
  | OpenAPIV3_1.ReferenceObject
>;

/**
 * Recursively extracts all $ref objects from an OpenAPI schema object
 * @param obj - The object to search for $ref properties
 * @param visited - Set to track visited objects and prevent infinite loops
 * @returns Array of objects containing $ref properties
 */
export function getAllRefs(
  obj: unknown,
  visited: Set<unknown> = new Set(),
): (OpenAPIV3.ReferenceObject | OpenAPIV3_1.ReferenceObject)[] {
  const refs: RefObject[] = [];

  if (!obj || typeof obj !== 'object') {
    return refs;
  }

  if (visited.has(obj)) {
    return refs;
  }
  visited.add(obj);

  const objAsRecord = obj as Record<string, unknown>;

  if ('$ref' in objAsRecord && typeof objAsRecord.$ref === 'string') {
    refs.push({ $ref: objAsRecord.$ref });
  }

  if (Array.isArray(obj)) {
    for (const item of obj) {
      refs.push(...getAllRefs(item, visited));
    }
  } else {
    for (const key in objAsRecord) {
      if (Object.prototype.hasOwnProperty.call(objAsRecord, key)) {
        refs.push(...getAllRefs(objAsRecord[key], visited));
      }
    }
  }

  return refs;
}

/**
 * Extracts the name from a $ref string
 * @param ref - The $ref string (e.g., "#/components/schemas/User")
 * @returns The extracted name (e.g., "User")
 */
export function extractRefName(ref: string): string {
  const parts = ref.split('/');
  return parts[parts.length - 1];
}

/**
 * Options for sorting schemas
 */
export interface SortOptions {
  /**
   * Whether to throw an error if circular dependencies are detected
   * @default false
   */
  throwOnCircular?: boolean;

  /**
   * Whether to log warnings
   * @default true
   */
  warnings?: boolean;
}

/**
 * Result of sorting operation
 */
export interface SortResult<T> {
  /**
   * Sorted schemas object
   */
  schemas: Record<string, T>;

  /**
   * List of schema names in sorted order
   */
  order: string[];

  /**
   * Whether circular dependencies were detected
   */
  hasCircularDependencies: boolean;

  /**
   * Dependency graph (schema name -> dependencies)
   */
  dependencyGraph: Map<string, Set<string>>;
}

/**
 * Topologically sorts an object based on $ref dependencies in its values
 * Returns a new object with keys ordered so dependencies are defined before being referenced
 * @param schemasObject - Object where keys are schema names and values are schema definitions
 * @param options - Sorting options
 * @returns Sort result containing the sorted object and metadata
 */
export function sortObjectByRefDependencies<T>(
  schemasObject: Record<string, T>,
  options: SortOptions = {},
): SortResult<T> {
  const { throwOnCircular = false, warnings = true } = options;

  // Build dependency graph
  const graph = new Map<string, Set<string>>();
  const names = Object.keys(schemasObject);

  // Build dependency graph
  for (const name of names) {
    const schema = schemasObject[name];
    const refs = getAllRefs(schema);
    const dependencies = new Set<string>();

    for (const ref of refs) {
      const depName = extractRefName(ref.$ref);
      // Only add as dependency if it's another schema in our object
      if (
        depName !== name &&
        Object.prototype.hasOwnProperty.call(schemasObject, depName)
      ) {
        dependencies.add(depName);
      }
    }

    graph.set(name, dependencies);
  }

  // Topological sort using Kahn's algorithm
  const sorted: string[] = [];
  const inDegree = new Map<string, number>();

  // Calculate in-degree for each node (how many dependencies it has)
  for (const [name, dependencies] of graph.entries()) {
    inDegree.set(name, dependencies.size);
  }

  // Queue nodes with no dependencies (in-degree = 0)
  const queue: string[] = [];
  for (const [name, degree] of inDegree.entries()) {
    if (degree === 0) {
      queue.push(name);
    }
  }

  // Process queue
  while (queue.length > 0) {
    const name = queue.shift()!;
    sorted.push(name);

    // For each node that depends on the current node, reduce its in-degree
    for (const [depName, dependencies] of graph.entries()) {
      if (dependencies.has(name)) {
        const newDegree = inDegree.get(depName)! - 1;
        inDegree.set(depName, newDegree);

        if (newDegree === 0) {
          queue.push(depName);
        }
      }
    }
  }

  // Check for circular dependencies
  const hasCircularDependencies = sorted.length !== names.length;

  if (hasCircularDependencies) {
    const message =
      'Circular dependencies detected. Some schemas may be in arbitrary order.';

    if (throwOnCircular) {
      throw new Error(message);
    }

    if (warnings) {
      console.warn(`Warning: ${message}`);
    }

    // Add remaining schemas to the end
    for (const name of names) {
      if (!sorted.includes(name)) {
        sorted.push(name);
      }
    }
  }

  // Build new object with sorted keys
  const sortedObject = {} as Record<string, T>;
  for (const name of sorted) {
    sortedObject[name] = schemasObject[name] as T;
  }

  return {
    schemas: sortedObject,
    order: sorted,
    hasCircularDependencies,
    dependencyGraph: graph,
  };
}

/**
 * Simple version that just returns the sorted object
 * @param schemasObject - Object where keys are schema names and values are schema definitions
 * @returns New object with keys in dependency order
 */
export function sortSchemas<T>(
  schemasObject: Record<string, T>,
): Record<string, T> {
  return sortObjectByRefDependencies(schemasObject).schemas;
}
