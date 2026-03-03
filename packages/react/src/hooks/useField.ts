import { useCallback } from 'react';
import type { FieldSchema, UseFieldReturn } from '../types.js';

interface FormStateRef {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setValue: (name: string, value: unknown) => void;
  setTouched: (name: string) => void;
  validateField?: (name: string, value: unknown) => string | undefined;
  setError: (name: string, error: string) => void;
}

/**
 * Hook for individual field state.
 * Provides value, error, touched, onChange, and onBlur for a named field.
 */
export function useField(
  name: string,
  _fieldSchema: FieldSchema,
  formState: FormStateRef,
): UseFieldReturn {
  const value = formState.values[name] ?? '';
  const error = formState.errors[name];
  const touched = formState.touched[name] ?? false;

  const onChange = useCallback(
    (newValue: unknown) => {
      formState.setValue(name, newValue);
      // Clear error on change
      if (formState.errors[name]) {
        formState.setError(name, '');
      }
    },
    [name, formState],
  );

  const onBlur = useCallback(() => {
    formState.setTouched(name);
    // Validate on blur
    if (formState.validateField) {
      const error = formState.validateField(name, formState.values[name]);
      if (error) {
        formState.setError(name, error);
      }
    }
  }, [name, formState]);

  return { value, error: error || undefined, touched, onChange, onBlur };
}
