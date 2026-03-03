import { createContainer } from '@speajus/diblob';
import type { Container } from '@speajus/diblob';
import {
  createFormContainer as coreCreateFormContainer,
  resolveRegistries as coreResolveRegistries,
} from '@subschema/core';
import type { FieldTypeRegistry, TemplateRegistry, ValidatorRegistry } from '../types.js';
import { fieldTypes, templates, validators } from './blobs.js';
import {
  createDefaultFieldTypes,
  createDefaultTemplates,
  createDefaultValidators,
} from './defaults.js';

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
 * Delegates to @subschema/core's createFormContainer.
 */
export function createFormContainer(
  parent: Container,
  overrides: FormContainerOverrides,
): Container {
  return coreCreateFormContainer(parent, overrides);
}

/**
 * Resolve registry values from a container synchronously.
 * Delegates to @subschema/core's resolveRegistries with React-specific type casting.
 */
export function resolveRegistries(container: Container) {
  const resolved = coreResolveRegistries(container);
  return {
    fieldTypes: resolved.fieldTypes as unknown as FieldTypeRegistry,
    templates: resolved.templates as unknown as TemplateRegistry,
    validators: resolved.validators as ValidatorRegistry,
  };
}
