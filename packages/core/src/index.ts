// ── Types ──
export type {
  FormSchema,
  FieldSchema,
  OptionItem,
  ValidatorConfig,
  ConditionalConfig,
  FieldsetConfig,
  ValidatorFn,
  FieldTypeRegistry,
  TemplateRegistry,
  ValidatorRegistry,
  FormState,
  FormActions,
} from './types.js';

// ── Validators ──
export {
  requiredValidator,
  minLengthValidator,
  maxLengthValidator,
  patternValidator,
  minValueValidator,
  maxValueValidator,
  defaultValidators,
} from './validators.js';

// ── Conditional evaluation ──
export { evaluateCondition } from './conditional.js';

// ── Form state ──
export { getInitialValues } from './form-state.js';

// ── Field resolution ──
export { findClosestMatch, levenshtein } from './field-resolution.js';

// ── Registry / DI ──
export {
  fieldTypes,
  templates,
  validators,
  createDefaultContainer,
  createFormContainer,
  resolveRegistries,
} from './registry.js';
export type { FormContainerOverrides } from './registry.js';

// ── UI utility ──
export { cn } from './utils.js';
