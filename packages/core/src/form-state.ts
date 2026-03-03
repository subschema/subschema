import type { FormSchema } from './types.js';

/**
 * Compute initial form values from a schema, optionally merging provided values.
 * For each field, uses the provided value if present, otherwise falls back to
 * the field's default, or a sensible zero-value based on the field type.
 */
export function getInitialValues(
  schema: FormSchema,
  provided?: Record<string, unknown>,
): Record<string, unknown> {
  const values: Record<string, unknown> = {};
  for (const [name, field] of Object.entries(schema.schema)) {
    if (provided && name in provided) {
      values[name] = provided[name];
    } else if (field.default !== undefined) {
      values[name] = field.default;
    } else if (field.type === 'Object') {
      values[name] = {};
    } else if (field.type === 'List' || field.type === 'Checkboxes') {
      values[name] = [];
    } else if (field.type === 'Checkbox') {
      values[name] = false;
    } else {
      values[name] = '';
    }
  }
  return values;
}
