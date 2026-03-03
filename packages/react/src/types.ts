import type { ComponentType, ReactNode } from 'react';

// ──────────────────────────────────────────────
// Re-export schema types from @subschema/core
// ──────────────────────────────────────────────

export type {
  FormSchema,
  FieldSchema,
  OptionItem,
  ValidatorConfig,
  ConditionalConfig,
  FieldsetConfig,
  ValidatorFn,
  FormState,
  FormActions,
} from '@subschema/core';

import type { FieldSchema, OptionItem, ValidatorConfig } from '@subschema/core';

// ──────────────────────────────────────────────
// React-specific registry & component types
// ──────────────────────────────────────────────

/** Props passed to every field component */
export interface FieldComponentProps {
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  title?: string;
  description?: string;
  options?: OptionItem[];
  fieldSchema: FieldSchema;
}

/** A React component that renders a form field */
export type FieldComponent = ComponentType<FieldComponentProps>;

/** Props passed to template wrapper components */
export interface TemplateComponentProps {
  name: string;
  label?: string;
  description?: string;
  error?: string;
  children: ReactNode;
}

/** A React component that wraps a field with label, error, etc. */
export type TemplateComponent = ComponentType<TemplateComponentProps>;

/** Registry maps (React-specific: uses React ComponentType) */
export type FieldTypeRegistry = Record<string, FieldComponent>;
export type TemplateRegistry = Record<string, TemplateComponent>;
export type ValidatorRegistry = Record<
  string,
  (value: unknown, config: ValidatorConfig) => string | undefined
>;

// ──────────────────────────────────────────────
// React-specific hook return types
// ──────────────────────────────────────────────

import type { FormState, FormActions } from '@subschema/core';

export interface UseFormReturn extends FormState, FormActions {
  handleSubmit: (
    onSubmit: (values: Record<string, unknown>) => void,
  ) => (e?: React.FormEvent) => void;
  isValid: boolean;
  validateField: (name: string, value: unknown) => string | undefined;
}

export interface UseFieldReturn {
  value: unknown;
  error: string | undefined;
  touched: boolean;
  onChange: (value: unknown) => void;
  onBlur: () => void;
}

export interface UseFieldArrayReturn {
  fields: unknown[];
  push: (value: unknown) => void;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
}

// ──────────────────────────────────────────────
// Context types
// ──────────────────────────────────────────────

export interface FormContextValue {
  fieldTypes: FieldTypeRegistry;
  templates: TemplateRegistry;
  validators: ValidatorRegistry;
  containerRef: unknown; // diblob Container
}
