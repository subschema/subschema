import { createContainer } from '@speajus/diblob';
import type { Container } from '@speajus/diblob';
import {
  createFormContainer as coreCreateFormContainer,
  resolveRegistries as coreResolveRegistries,
  fieldTypes,
  templates,
  validators,
} from '@subschema/core';
import type { FormContainerOverrides } from '@subschema/core';
import {
  createDefaultFieldTypes,
  createDefaultTemplates,
  createDefaultValidators,
} from './defaults.js';

/**
 * Creates a default diblob container with all built-in Svelte field types,
 * templates, and validators registered.
 */
export function createDefaultContainer(): Container {
  const container = createContainer();
  container.register(fieldTypes, createDefaultFieldTypes);
  container.register(templates, createDefaultTemplates);
  container.register(validators, createDefaultValidators);
  return container;
}

/**
 * Creates a child container with overrides.
 */
export function createFormContainer(
  parent: Container,
  overrides: FormContainerOverrides,
): Container {
  return coreCreateFormContainer(parent, overrides);
}

/**
 * Resolve registry values from a container.
 */
export function resolveRegistries(container: Container) {
  return coreResolveRegistries(container);
}
