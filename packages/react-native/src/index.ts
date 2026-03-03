// @subschema/react-native - React Native form engine with diblob DI

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

// ── Hooks ──
export { useFormContainer } from './hooks/useFormContainer.js';
export { useFieldType } from './hooks/useFieldType.js';
export { useTemplate } from './hooks/useTemplate.js';
export { useForm } from './hooks/useForm.js';
export { useField } from './hooks/useField.js';
export { useFieldArray } from './hooks/useFieldArray.js';
export { useConditional } from './hooks/useConditional.js';
export { useValidation } from './hooks/useValidation.js';

// ── Components ──
export { FormProvider, FormContainerContext } from './components/FormProvider.js';
export { Form } from './components/Form.js';
export { useFormState, FormStateContext } from './components/FormStateContext.js';
export { Field } from './components/Field.js';
export { FieldSet } from './components/FieldSet.js';
export { Conditional } from './components/Conditional.js';
export { DefaultTemplate } from './components/DefaultTemplate.js';

// ── Built-in field types ──
export { TextField } from './fields/TextField.js';
export { NumberField } from './fields/NumberField.js';
export { PasswordField } from './fields/PasswordField.js';
export { TextAreaField } from './fields/TextAreaField.js';
export { SelectField } from './fields/SelectField.js';
export { CheckboxField } from './fields/CheckboxField.js';
export { CheckboxesField } from './fields/CheckboxesField.js';
export { RadioField } from './fields/RadioField.js';
export { DateField } from './fields/DateField.js';
export { AutocompleteField } from './fields/AutocompleteField.js';
export { HiddenField } from './fields/HiddenField.js';
export { ListField } from './fields/ListField.js';
export { ObjectField } from './fields/ObjectField.js';

// ── Validators ──
export { defaultValidators } from './validation/validators.js';

// ── UI primitives (re-export for consumers) ──
export { Input } from './ui/Input.js';
export { Textarea } from './ui/Textarea.js';
export { Button } from './ui/Button.js';
export { Label } from './ui/Label.js';
export { Card, CardHeader, CardTitle, CardContent } from './ui/Card.js';
export { cn } from './ui/utils.js';

