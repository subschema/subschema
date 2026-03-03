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
// Validator types
// ──────────────────────────────────────────────

/** Validator function: returns error string or undefined */
export type ValidatorFn = (value: unknown, config: ValidatorConfig) => string | undefined;

// ──────────────────────────────────────────────
// Registry types (framework-agnostic)
// ──────────────────────────────────────────────

/** Generic registry for field type components */
export type FieldTypeRegistry = Record<string, unknown>;

/** Generic registry for template components */
export type TemplateRegistry = Record<string, unknown>;

/** Registry for validator functions */
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
