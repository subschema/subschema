import { createContainer } from '@speajus/diblob';
import type { Container } from '@speajus/diblob';
import type { FieldTypeRegistry, TemplateRegistry, ValidatorRegistry } from '../types.js';
import { fieldTypes, templates, validators } from './blobs.js';
import { createDefaultFieldTypes, createDefaultTemplates, createDefaultValidators } from './defaults.js';

/**
 * Creates a default diblob container with all built-in field types,
 * templates, and validators registered.
 */
export function createDefaultContainer(): Container {
  const container = createContainer();
  container.register(fieldTypes, createDefaultFieldTypes);
  container.register(templates, createDefaultTemplates);
  container.register(validators, createDefaultValidators);
  return container;
}

export interface FormContainerOverrides {
  types?: Record<string, React.ComponentType<any>>;
  templates?: Record<string, React.ComponentType<any>>;
  validators?: Record<string, (value: unknown, config: any) => string | undefined>;
}

/**
 * Creates a child container from a parent, merging in overrides.
 * Used by <Form> when types/templates/validators props are provided.
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

