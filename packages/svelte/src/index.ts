// @subschema/svelte - Modern Svelte 5 form engine with diblob DI

// ── Types ──
export type {
  FormSchema,
  FieldSchema,
  OptionItem,
  ValidatorConfig,
  ConditionalConfig,
  FieldsetConfig,
  FieldComponentProps,
  FieldComponent,
  TemplateComponentProps,
  TemplateComponent,
  ValidatorFn,
  FieldTypeRegistry,
  TemplateRegistry,
  ValidatorRegistry,
  FormState,
  FormActions,
  UseFormReturn,
  UseFieldReturn,
  UseFieldArrayReturn,
  FormContextValue,
} from './types.js';

// ── Registry (diblob blobs & container factories) ──
export { fieldTypes, templates, validators } from './registry/blobs.js';
export {
  createDefaultContainer,
  createFormContainer,
  resolveRegistries,
} from './registry/container.js';
export {
  createDefaultFieldTypes,
  createDefaultTemplates,
  createDefaultValidators,
} from './registry/defaults.js';

// ── State management (replaces React hooks) ──
export { createFormState } from './form-state.svelte.js';
export { createFieldState } from './field-state.svelte.js';
export { createFieldArray } from './field-array.svelte.js';

// ── Context ──
export {
  setFormContainerContext,
  getFormContainerContext,
  getFormContainerContextOptional,
  setFormStateContext,
  getFormStateContext,
} from './context.js';

// ── Components ──
export { default as Form } from './components/Form.svelte';
export { default as FormProvider } from './components/FormProvider.svelte';
export { default as Field } from './components/Field.svelte';
export { default as FieldSet } from './components/FieldSet.svelte';
export { default as Conditional } from './components/Conditional.svelte';
export { default as DefaultTemplate } from './components/DefaultTemplate.svelte';

// ── Built-in field types ──
export { default as TextField } from './fields/TextField.svelte';
export { default as NumberField } from './fields/NumberField.svelte';
export { default as PasswordField } from './fields/PasswordField.svelte';
export { default as TextAreaField } from './fields/TextAreaField.svelte';
export { default as SelectField } from './fields/SelectField.svelte';
export { default as CheckboxField } from './fields/CheckboxField.svelte';
export { default as CheckboxesField } from './fields/CheckboxesField.svelte';
export { default as RadioField } from './fields/RadioField.svelte';
export { default as DateField } from './fields/DateField.svelte';
export { default as AutocompleteField } from './fields/AutocompleteField.svelte';
export { default as HiddenField } from './fields/HiddenField.svelte';
export { default as ListField } from './fields/ListField.svelte';
export { default as ObjectField } from './fields/ObjectField.svelte';

// ── Validators ──
export { defaultValidators } from '@subschema/core';

// ── UI primitives ──
export { default as Button } from './ui/Button.svelte';
export { default as Input } from './ui/Input.svelte';
export { default as Label } from './ui/Label.svelte';
export { default as Textarea } from './ui/Textarea.svelte';
export { default as Card } from './ui/Card.svelte';
export { default as CardHeader } from './ui/CardHeader.svelte';
export { default as CardTitle } from './ui/CardTitle.svelte';
export { default as CardContent } from './ui/CardContent.svelte';

// ── Utilities ──
export { cn } from './ui/utils.js';

