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
} from './types';

// ── Registry (diblob blobs & container factories) ──
export { fieldTypes, templates, validators } from './registry/blobs';
export {
  createDefaultContainer,
  createFormContainer,
  resolveRegistries,
} from './registry/container';
export {
  createDefaultFieldTypes,
  createDefaultTemplates,
  createDefaultValidators,
} from './registry/defaults';

// ── Hooks ──
export { useFormContainer } from './hooks/useFormContainer';
export { useFieldType } from './hooks/useFieldType';
export { useTemplate } from './hooks/useTemplate';
export { useForm } from './hooks/useForm';
export { useField } from './hooks/useField';
export { useFieldArray } from './hooks/useFieldArray';
export { useConditional } from './hooks/useConditional';
export { useValidation } from './hooks/useValidation';

// ── Components ──
export { FormProvider, FormContainerContext } from './components/FormProvider';
export { Form } from './components/Form';
export { useFormState, FormStateContext } from './components/FormStateContext';
export { Field } from './components/Field';
export { FieldSet } from './components/FieldSet';
export { Conditional } from './components/Conditional';
export { DefaultTemplate } from './components/DefaultTemplate';

// ── Built-in field types ──
export { TextField } from './fields/TextField';
export { NumberField } from './fields/NumberField';
export { PasswordField } from './fields/PasswordField';
export { TextAreaField } from './fields/TextAreaField';
export { SelectField } from './fields/SelectField';
export { CheckboxField } from './fields/CheckboxField';
export { CheckboxesField } from './fields/CheckboxesField';
export { RadioField } from './fields/RadioField';
export { DateField } from './fields/DateField';
export { AutocompleteField } from './fields/AutocompleteField';
export { HiddenField } from './fields/HiddenField';
export { ListField } from './fields/ListField';
export { ObjectField } from './fields/ObjectField';

// ── Validators ──
export { defaultValidators } from './validation/validators';

// ── UI primitives (re-export for consumers) ──
export { Input } from './ui/Input';
export { Textarea } from './ui/Textarea';
export { Button } from './ui/Button';
export { Label } from './ui/Label';
export { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
export { cn } from './ui/utils';

