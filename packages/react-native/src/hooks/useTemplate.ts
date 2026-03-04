import { useFormContainer } from './useFormContainer';
import type { TemplateComponent } from '../types';

/**
 * Resolve a template component by name from the diblob container.
 * Returns the Default template if no name is specified.
 */
export function useTemplate(templateName?: string): TemplateComponent {
  const { templates } = useFormContainer();
  const name = templateName ?? 'Default';
  const component = templates[name];
  if (!component) {
    throw new Error(
      `Template "${name}" not found. Available: ${Object.keys(templates).join(', ')}`,
    );
  }
  return component;
}

