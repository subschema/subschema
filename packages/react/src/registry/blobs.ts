import { createBlob } from '@speajus/diblob';
import type { FieldTypeRegistry, TemplateRegistry, ValidatorRegistry } from '../types.js';

/**
 * Blob for the field type registry.
 * Maps type names (e.g. "Text", "Select") to React field components.
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
