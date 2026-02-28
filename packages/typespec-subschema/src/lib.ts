import { createTypeSpecLibrary } from "@typespec/compiler";

export const $lib = createTypeSpecLibrary({
  name: "@subschema/typespec",
  diagnostics: {
    "invalid-field-type": {
      severity: "error",
      messages: {
        default: "Invalid field type. Must be a non-empty string.",
      },
    },
    "invalid-template-name": {
      severity: "error",
      messages: {
        default: "Invalid template name. Must be a non-empty string.",
      },
    },
    "invalid-options": {
      severity: "error",
      messages: {
        default: "Options must contain at least one value.",
      },
    },
    "invalid-placeholder": {
      severity: "error",
      messages: {
        default: "Placeholder text must be a non-empty string.",
      },
    },
    "invalid-conditional": {
      severity: "error",
      messages: {
        default: "Conditional expression must be a non-empty string.",
      },
    },
  },
  state: {
    field: { description: "State for the @field decorator" },
    template: { description: "State for the @template decorator" },
    fieldset: { description: "State for the @fieldset decorator" },
    conditional: { description: "State for the @conditional decorator" },
    options: { description: "State for the @options decorator" },
    placeholder: { description: "State for the @placeholder decorator" },
    formConfig: { description: "State for the @formConfig decorator" },
  },
} as const);

export const { reportDiagnostic, createDiagnostic } = $lib;
export const StateKeys = $lib.stateKeys;

