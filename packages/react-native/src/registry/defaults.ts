import type { FieldTypeRegistry, TemplateRegistry, ValidatorRegistry } from '../types';
import { TextField } from '../fields/TextField';
import { NumberField } from '../fields/NumberField';
import { PasswordField } from '../fields/PasswordField';
import { TextAreaField } from '../fields/TextAreaField';
import { SelectField } from '../fields/SelectField';
import { CheckboxField } from '../fields/CheckboxField';
import { CheckboxesField } from '../fields/CheckboxesField';
import { RadioField } from '../fields/RadioField';
import { DateField } from '../fields/DateField';
import { AutocompleteField } from '../fields/AutocompleteField';
import { HiddenField } from '../fields/HiddenField';
import { ListField } from '../fields/ListField';
import { ObjectField } from '../fields/ObjectField';
import { DefaultTemplate } from '../components/DefaultTemplate';
import { defaultValidators } from '../validation/validators';

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
