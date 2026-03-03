import type { FormSchema, ValidatorRegistry } from './types.js';
import type { UseFormReturn } from './types.js';
import { getInitialValues } from '@subschema/core';

/**
 * Creates reactive form state using Svelte 5 runes.
 * Equivalent to React's useForm hook.
 */
export function createFormState(
  schema: FormSchema,
  validatorRegistry: ValidatorRegistry,
  initialValues?: Record<string, unknown>,
): UseFormReturn {
  let values = $state<Record<string, unknown>>(getInitialValues(schema, initialValues));
  let errors = $state<Record<string, string>>({});
  let touched = $state<Record<string, boolean>>({});

  const isValid = $derived(Object.keys(errors).length === 0);

  function setValue(name: string, value: unknown): void {
    values = { ...values, [name]: value };
  }

  function setError(name: string, error: string): void {
    errors = { ...errors, [name]: error };
  }

  function setTouched(name: string): void {
    touched = { ...touched, [name]: true };
  }

  function validateField(name: string, value: unknown): string | undefined {
    const fieldSchema = schema.schema[name];
    if (!fieldSchema?.validators) return undefined;

    for (const validatorConfig of fieldSchema.validators) {
      const validatorFn = validatorRegistry[validatorConfig.type];
      if (validatorFn) {
        const error = validatorFn(value, validatorConfig);
        if (error) return error;
      }
    }
    return undefined;
  }

  function validate(): Record<string, string> {
    const newErrors: Record<string, string> = {};
    for (const [name] of Object.entries(schema.schema)) {
      const error = validateField(name, values[name]);
      if (error) newErrors[name] = error;
    }
    errors = newErrors;
    return newErrors;
  }

  function reset(newValues?: Record<string, unknown>): void {
    values = newValues ?? getInitialValues(schema, initialValues);
    errors = {};
    touched = {};
  }

  function handleSubmit(onSubmit: (values: Record<string, unknown>) => void): (e?: Event) => void {
    return (e?: Event) => {
      e?.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length === 0) {
        onSubmit(values);
      }
    };
  }

  return {
    get values() {
      return values;
    },
    get errors() {
      return errors;
    },
    get touched() {
      return touched;
    },
    get isValid() {
      return isValid;
    },
    setValue,
    setError,
    setTouched,
    validate,
    reset,
    handleSubmit,
    validateField,
  };
}
