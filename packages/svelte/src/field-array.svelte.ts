import type { UseFieldArrayReturn, UseFormReturn } from './types.js';

/**
 * Creates array field operations.
 * Equivalent to React's useFieldArray hook.
 */
export function createFieldArray(
  name: string,
  formState: UseFormReturn,
): UseFieldArrayReturn {
  const fields = $derived(
    Array.isArray(formState.values[name]) ? (formState.values[name] as unknown[]) : [],
  );

  function push(value: unknown): void {
    formState.setValue(name, [...fields, value]);
  }

  function remove(index: number): void {
    formState.setValue(
      name,
      fields.filter((_, i) => i !== index),
    );
  }

  function move(from: number, to: number): void {
    const next = [...fields];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    formState.setValue(name, next);
  }

  return {
    get fields() { return fields; },
    push,
    remove,
    move,
  };
}

