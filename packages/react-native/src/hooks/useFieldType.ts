import { useFormContainer } from './useFormContainer.js';
import type { FieldComponent } from '../types.js';
import { findClosestMatch } from '@subschema/core';

/**
 * Resolve a field component by type name from the diblob container.
 * Throws a helpful error with "did you mean?" suggestions if not found.
 */
export function useFieldType(typeName: string): FieldComponent {
  const { fieldTypes } = useFormContainer();

  const component = fieldTypes[typeName];
  if (component) return component;

  const available = Object.keys(fieldTypes);
  const suggestion = findClosestMatch(typeName, available);

  let message = `Field type "${typeName}" not found.\nAvailable: ${available.join(', ')}`;
  if (suggestion) {
    message += `\nDid you mean: "${suggestion}"?`;
  }

  throw new Error(message);
}

