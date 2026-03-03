import { setContext, getContext } from 'svelte';
import type { FormContextValue, UseFormReturn } from './types.js';

// ──────────────────────────────────────────────
// Form Container Context (replaces FormContainerContext + FormProvider)
// ──────────────────────────────────────────────

const FORM_CONTAINER_KEY = Symbol('subschema-form-container');

export function setFormContainerContext(value: FormContextValue): void {
  setContext(FORM_CONTAINER_KEY, value);
}

export function getFormContainerContext(): FormContextValue {
  const ctx = getContext<FormContextValue | undefined>(FORM_CONTAINER_KEY);
  if (!ctx) {
    throw new Error(
      'Form container context not found. ' +
        'Wrap your form in <FormProvider> or use <Form schema={...}>.',
    );
  }
  return ctx;
}

export function getFormContainerContextOptional(): FormContextValue | undefined {
  try {
    return getContext<FormContextValue | undefined>(FORM_CONTAINER_KEY);
  } catch {
    return undefined;
  }
}

// ──────────────────────────────────────────────
// Form State Context (replaces FormStateContext)
// ──────────────────────────────────────────────

const FORM_STATE_KEY = Symbol('subschema-form-state');

export function setFormStateContext(value: UseFormReturn): void {
  setContext(FORM_STATE_KEY, value);
}

export function getFormStateContext(): UseFormReturn {
  const ctx = getContext<UseFormReturn | undefined>(FORM_STATE_KEY);
  if (!ctx) {
    throw new Error('Form state context not found. Must be used within a <Form> component.');
  }
  return ctx;
}
