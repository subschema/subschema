import { createBlob, createContainer } from '@speajus/diblob';
import type { Container } from '@speajus/diblob';
import type {
  FieldTypeRegistry,
  TemplateRegistry,
  ValidatorRegistry,
  ValidatorFn,
} from './types.js';

// ──────────────────────────────────────────────
// Blobs (diblob registry tokens)
// ──────────────────────────────────────────────

/**
 * Blob for the field type registry.
 * Maps type names (e.g. "Text", "Select") to framework-specific field components.
 */
export const fieldTypes = createBlob<FieldTypeRegistry>();

/**
 * Blob for the template registry.
 * Maps template names to wrapper components (label, error display, etc.).
 */
export const templates = createBlob<TemplateRegistry>();

/**
 * Blob for the validator registry.
 * Maps validator names (e.g. "required", "minLength") to validator functions.
 */
export const validators = createBlob<ValidatorRegistry>();

// ──────────────────────────────────────────────
// Container factories
// ──────────────────────────────────────────────

/**
 * Creates a default diblob container with all built-in field types,
 * templates, and validators registered.
 *
 * Framework packages should call this and then register their own
 * field type and template factories.
 */
export function createDefaultContainer(): Container {
  return createContainer();
}

/**
 * Overrides for creating a form-scoped container.
 * Uses generic Record types instead of framework-specific component types.
 */
export interface FormContainerOverrides {
  types?: Record<string, unknown>;
  templates?: Record<string, unknown>;
  validators?: Record<string, ValidatorFn>;
}

/**
 * Creates a child container from a parent, merging in overrides.
 * Used by framework Form components when types/templates/validators props are provided.
 */
export function createFormContainer(
  parent: Container,
  overrides: FormContainerOverrides,
): Container {
  const child = createContainer(parent);

  if (overrides.types) {
    const parentTypes = parent.resolve(fieldTypes) as FieldTypeRegistry;
    child.register(fieldTypes, () => ({ ...parentTypes, ...overrides.types }));
  }

  if (overrides.templates) {
    const parentTemplates = parent.resolve(templates) as TemplateRegistry;
    child.register(templates, () => ({ ...parentTemplates, ...overrides.templates }));
  }

  if (overrides.validators) {
    const parentValidators = parent.resolve(validators) as ValidatorRegistry;
    child.register(validators, () => ({ ...parentValidators, ...overrides.validators }));
  }

  return child;
}

/**
 * Resolve registry values from a container synchronously.
 * All our factories are sync, so resolve returns T directly.
 */
export function resolveRegistries(container: Container) {
  return {
    fieldTypes: container.resolve(fieldTypes) as FieldTypeRegistry,
    templates: container.resolve(templates) as TemplateRegistry,
    validators: container.resolve(validators) as ValidatorRegistry,
  };
}
