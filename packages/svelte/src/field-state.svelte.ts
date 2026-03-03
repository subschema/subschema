import type { FieldSchema, UseFieldReturn, UseFormReturn } from './types.js';

/**
 * Creates field-level reactive state from form state.
 * Equivalent to React's useField hook.
 */
export function createFieldState(
  name: string,
  _fieldSchema: FieldSchema,
  formState: UseFormReturn,
): UseFieldReturn {
  const value = $derived(formState.values[name] ?? '');
  const error = $derived(formState.errors[name] || undefined);
  const touched = $derived(formState.touched[name] ?? false);

  function onChange(newValue: unknown): void {
    formState.setValue(name, newValue);
    // Clear error on change
    if (formState.errors[name]) {
      formState.setError(name, '');
    }
  }

  function onBlur(): void {
    formState.setTouched(name);
    // Validate on blur
    if (formState.validateField) {
      const err = formState.validateField(name, formState.values[name]);
      if (err) {
        formState.setError(name, err);
      }
    }
  }

  return {
    get value() { return value; },
    get error() { return error; },
    get touched() { return touched; },
    onChange,
    onBlur,
  };
}

