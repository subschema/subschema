import type { ComponentType, ReactNode } from 'react';

// ──────────────────────────────────────────────
// Schema types
// ──────────────────────────────────────────────

export interface FormSchema {
  schema: Record<string, FieldSchema>;
  fieldsets?: FieldsetConfig[];
}

export interface FieldSchema {
  type: string;
  title?: string;
  description?: string;
  placeholder?: string;
  options?: OptionItem[];
  validators?: ValidatorConfig[];
  conditional?: ConditionalConfig;
  subSchema?: FormSchema;
  /** Default value */
  default?: unknown;
  /** For array/list fields: item schema */
  itemSchema?: FieldSchema;
  /** Additional field-specific props */
  [key: string]: unknown;
}

export interface OptionItem {
  label: string;
  value: string;
}

export interface ValidatorConfig {
  type: string;
  message?: string;
  value?: unknown;
}

export interface ConditionalConfig {
  /** Field name to listen to */
  listen: string;
  /** Operator for comparison */
  operator: 'equals' | 'notEquals' | 'truthy' | 'falsy' | 'regex' | 'contains';
  /** Value to compare against (for equals/notEquals/regex/contains) */
  value?: unknown;
}

export interface FieldsetConfig {
  legend?: string;
  fields: string[];
}

// ──────────────────────────────────────────────
// Registry types
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

/** Validator function: returns error string or undefined */
export type ValidatorFn = (value: unknown, config: ValidatorConfig) => string | undefined;

/** Registry maps */
export type FieldTypeRegistry = Record<string, FieldComponent>;
export type TemplateRegistry = Record<string, TemplateComponent>;
export type ValidatorRegistry = Record<string, ValidatorFn>;

// ──────────────────────────────────────────────
// Form state types
// ──────────────────────────────────────────────

export interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export interface FormActions {
  setValue: (name: string, value: unknown) => void;
  setError: (name: string, error: string) => void;
  setTouched: (name: string) => void;
  validate: () => Record<string, string>;
  reset: (values?: Record<string, unknown>) => void;
}

export interface UseFormReturn extends FormState, FormActions {
  handleSubmit: (onSubmit: (values: Record<string, unknown>) => void) => (e?: React.FormEvent) => void;
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

