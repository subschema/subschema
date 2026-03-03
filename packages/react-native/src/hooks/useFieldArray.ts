import { useCallback, useMemo } from 'react';
import type { UseFieldArrayReturn } from '../types.js';

interface FormStateRef {
  values: Record<string, unknown>;
  setValue: (name: string, value: unknown) => void;
}

/**
 * Hook for array/list field operations.
 * Provides push, remove, and move operations on an array field.
 */
export function useFieldArray(name: string, formState: FormStateRef): UseFieldArrayReturn {
  const rawValue = formState.values[name];
  const fields = useMemo(() => (Array.isArray(rawValue) ? rawValue : []), [rawValue]);

  const push = useCallback(
    (value: unknown) => {
      formState.setValue(name, [...fields, value]);
    },
    [name, fields, formState],
  );

  const remove = useCallback(
    (index: number) => {
      formState.setValue(
        name,
        fields.filter((_, i) => i !== index),
      );
    },
    [name, fields, formState],
  );

  const move = useCallback(
    (from: number, to: number) => {
      const next = [...fields];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      formState.setValue(name, next);
    },
    [name, fields, formState],
  );

  return { fields, push, remove, move };
}

