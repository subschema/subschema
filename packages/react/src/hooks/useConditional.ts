import { useMemo } from 'react';
import type { ConditionalConfig } from '../types.js';

/**
 * Evaluate a conditional configuration against current form values.
 * Returns true if the field should be visible.
 */
export function useConditional(
  config: ConditionalConfig | undefined,
  values: Record<string, unknown>,
): boolean {
  return useMemo(() => {
    if (!config) return true;
    return evaluateCondition(config, values);
  }, [config, values]);
}

export function evaluateCondition(
  config: ConditionalConfig,
  values: Record<string, unknown>,
): boolean {
  const fieldValue = values[config.listen];

  switch (config.operator) {
    case 'equals':
      return fieldValue === config.value;
    case 'notEquals':
      return fieldValue !== config.value;
    case 'truthy':
      return !!fieldValue;
    case 'falsy':
      return !fieldValue;
    case 'regex':
      if (typeof fieldValue === 'string' && typeof config.value === 'string') {
        return new RegExp(config.value).test(fieldValue);
      }
      return false;
    case 'contains':
      if (typeof fieldValue === 'string' && typeof config.value === 'string') {
        return fieldValue.includes(config.value);
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(config.value);
      }
      return false;
    default:
      return true;
  }
}

