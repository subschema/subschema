import { useMemo } from 'react';
import type { ConditionalConfig } from '../types.js';
import { evaluateCondition } from '@subschema/core';

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

export { evaluateCondition } from '@subschema/core';

