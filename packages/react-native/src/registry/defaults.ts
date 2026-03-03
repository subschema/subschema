import type { FieldTypeRegistry, TemplateRegistry, ValidatorRegistry } from '../types.js';
import { TextField } from '../fields/TextField.js';
import { NumberField } from '../fields/NumberField.js';
import { PasswordField } from '../fields/PasswordField.js';
import { TextAreaField } from '../fields/TextAreaField.js';
import { SelectField } from '../fields/SelectField.js';
import { CheckboxField } from '../fields/CheckboxField.js';
import { CheckboxesField } from '../fields/CheckboxesField.js';
import { RadioField } from '../fields/RadioField.js';
import { DateField } from '../fields/DateField.js';
import { AutocompleteField } from '../fields/AutocompleteField.js';
import { HiddenField } from '../fields/HiddenField.js';
import { ListField } from '../fields/ListField.js';
import { ObjectField } from '../fields/ObjectField.js';
import { DefaultTemplate } from '../components/DefaultTemplate.js';
import { defaultValidators } from '../validation/validators.js';

/** Built-in field type registry */
export function createDefaultFieldTypes(): FieldTypeRegistry {
  return {
    Text: TextField,
    Number: NumberField,
    Password: PasswordField,
    TextArea: TextAreaField,
    Select: SelectField,
    Checkbox: CheckboxField,
    Checkboxes: CheckboxesField,
    Radio: RadioField,
    Date: DateField,
    Autocomplete: AutocompleteField,
    Hidden: HiddenField,
    List: ListField,
    Object: ObjectField,
  };
}

/** Built-in template registry */
export function createDefaultTemplates(): TemplateRegistry {
  return {
    Default: DefaultTemplate,
  };
}

/** Built-in validator registry */
export function createDefaultValidators(): ValidatorRegistry {
  return { ...defaultValidators };
}

