import type { FieldTypeRegistry, TemplateRegistry, ValidatorRegistry } from '../types.js';
import TextField from '../fields/TextField.svelte';
import NumberField from '../fields/NumberField.svelte';
import PasswordField from '../fields/PasswordField.svelte';
import TextAreaField from '../fields/TextAreaField.svelte';
import SelectField from '../fields/SelectField.svelte';
import CheckboxField from '../fields/CheckboxField.svelte';
import CheckboxesField from '../fields/CheckboxesField.svelte';
import RadioField from '../fields/RadioField.svelte';
import DateField from '../fields/DateField.svelte';
import AutocompleteField from '../fields/AutocompleteField.svelte';
import HiddenField from '../fields/HiddenField.svelte';
import ListField from '../fields/ListField.svelte';
import ObjectField from '../fields/ObjectField.svelte';
import DefaultTemplate from '../components/DefaultTemplate.svelte';
import { defaultValidators } from '@subschema/core';

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
  } as FieldTypeRegistry;
}

/** Built-in template registry */
export function createDefaultTemplates(): TemplateRegistry {
  return {
    Default: DefaultTemplate,
  } as TemplateRegistry;
}

/** Built-in validator registry */
export function createDefaultValidators(): ValidatorRegistry {
  return { ...defaultValidators };
}

