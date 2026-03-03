import { useMemo } from 'react';
import { useFormContainer } from './useFormContainer.js';
import type { ValidatorConfig } from '../types.js';

/**
 * Run a chain of validators against a value.
 * Returns the first error message found, or undefined if all pass.
 */
export function useValidation(
  validatorConfigs: ValidatorConfig[] | undefined,
  value: unknown,
): string | undefined {
  const { validators: validatorRegistry } = useFormContainer();

  return useMemo(() => {
    if (!validatorConfigs || validatorConfigs.length === 0) return undefined;

    for (const config of validatorConfigs) {
      const validatorFn = validatorRegistry[config.type];
      if (validatorFn) {
        const error = validatorFn(value, config);
        if (error) return error;
      }
    }
    return undefined;
  }, [validatorConfigs, value, validatorRegistry]);
}

