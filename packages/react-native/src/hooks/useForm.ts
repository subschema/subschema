import { useCallback, useMemo, useRef, useState } from 'react';
import type { FormSchema, FormState, UseFormReturn, ValidatorConfig } from '../types';
import { useFormContainer } from './useFormContainer';
import { getInitialValues } from '@subschema/core';

/**
 * Form state management hook.
 * Manages values, errors, touched state, validation, and submission.
 */
export function useForm(
  schema: FormSchema,
  initialValues?: Record<string, unknown>,
): UseFormReturn {
  const { validators: validatorRegistry } = useFormContainer();

  const [state, setState] = useState<FormState>(() => ({
    values: getInitialValues(schema, initialValues),
    errors: {},
    touched: {},
  }));

  const schemaRef = useRef(schema);
  schemaRef.current = schema;

  const setValue = useCallback((name: string, value: unknown) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [name]: value },
    }));
  }, []);

  const setError = useCallback((name: string, error: string) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [name]: error },
    }));
  }, []);

  const setTouched = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [name]: true },
    }));
  }, []);

  const validateField = useCallback(
    (name: string, value: unknown): string | undefined => {
      const fieldSchema = schemaRef.current.schema[name];
      if (!fieldSchema?.validators) return undefined;

      for (const validatorConfig of fieldSchema.validators) {
        const validatorFn = validatorRegistry[validatorConfig.type];
        if (validatorFn) {
          const error = validatorFn(value, validatorConfig);
          if (error) return error;
        }
      }
      return undefined;
    },
    [validatorRegistry],
  );

  const validate = useCallback((): Record<string, string> => {
    const errors: Record<string, string> = {};
    const currentSchema = schemaRef.current;
    for (const [name] of Object.entries(currentSchema.schema)) {
      const error = validateField(name, state.values[name]);
      if (error) errors[name] = error;
    }
    setState((prev) => ({ ...prev, errors }));
    return errors;
  }, [state.values, validateField]);

  const reset = useCallback(
    (values?: Record<string, unknown>) => {
      setState({
        values: values ?? getInitialValues(schemaRef.current, initialValues),
        errors: {},
        touched: {},
      });
    },
    [initialValues],
  );

  const handleSubmit = useCallback(
    (onSubmit: (values: Record<string, unknown>) => void) => {
      return () => {
        const errors = validate();
        if (Object.keys(errors).length === 0) {
          onSubmit(state.values);
        }
      };
    },
    [validate, state.values],
  );

  const isValid = useMemo(() => Object.keys(state.errors).length === 0, [state.errors]);

  return {
    ...state,
    setValue,
    setError,
    setTouched,
    validate,
    reset,
    handleSubmit,
    isValid,
    validateField,
  };
}

