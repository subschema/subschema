import type { ValidatorFn, ValidatorConfig } from './types.js';

export const requiredValidator: ValidatorFn = (value: unknown, config: ValidatorConfig) => {
  if (
    value === undefined ||
    value === null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return config.message ?? 'This field is required';
  }
  return undefined;
};

export const minLengthValidator: ValidatorFn = (value: unknown, config: ValidatorConfig) => {
  const min = Number(config.value);
  if (typeof value === 'string' && value.length < min) {
    return config.message ?? `Must be at least ${min} characters`;
  }
  return undefined;
};

export const maxLengthValidator: ValidatorFn = (value: unknown, config: ValidatorConfig) => {
  const max = Number(config.value);
  if (typeof value === 'string' && value.length > max) {
    return config.message ?? `Must be at most ${max} characters`;
  }
  return undefined;
};

export const patternValidator: ValidatorFn = (value: unknown, config: ValidatorConfig) => {
  if (typeof value === 'string' && typeof config.value === 'string') {
    const regex = new RegExp(config.value);
    if (!regex.test(value)) {
      return config.message ?? `Does not match required pattern`;
    }
  }
  return undefined;
};

export const minValueValidator: ValidatorFn = (value: unknown, config: ValidatorConfig) => {
  const min = Number(config.value);
  const num = Number(value);
  if (!isNaN(num) && num < min) {
    return config.message ?? `Must be at least ${min}`;
  }
  return undefined;
};

export const maxValueValidator: ValidatorFn = (value: unknown, config: ValidatorConfig) => {
  const max = Number(config.value);
  const num = Number(value);
  if (!isNaN(num) && num > max) {
    return config.message ?? `Must be at most ${max}`;
  }
  return undefined;
};

/** Default validator registry */
export const defaultValidators: Record<string, ValidatorFn> = {
  required: requiredValidator,
  minLength: minLengthValidator,
  maxLength: maxLengthValidator,
  pattern: patternValidator,
  minValue: minValueValidator,
  maxValue: maxValueValidator,
};
