import React from 'react';
import type { FieldSchema } from '../types';
import { useFieldType } from '../hooks/useFieldType';
import { useTemplate } from '../hooks/useTemplate';
import { useField } from '../hooks/useField';
import { useConditional } from '../hooks/useConditional';
import { useFormState } from './FormStateContext';

export interface FieldProps {
  name: string;
  fieldSchema: FieldSchema;
}

/**
 * Renders a single form field.
 * Resolves the field type component from the diblob container,
 * wraps it in a template, and handles conditional visibility.
 */
export function Field({ name, fieldSchema }: FieldProps) {
  const formState = useFormState();
  const FieldComponent = useFieldType(fieldSchema.type);
  const Template = useTemplate(fieldSchema.template as string | undefined);
  const isVisible = useConditional(fieldSchema.conditional, formState.values);
  const field = useField(name, fieldSchema, formState);

  if (!isVisible) return null;

  // Hidden fields don't need a template wrapper
  if (fieldSchema.type === 'Hidden') {
    return (
      <FieldComponent
        name={name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        error={field.error}
        fieldSchema={fieldSchema}
      />
    );
  }

  return (
    <Template
      name={name}
      label={fieldSchema.title}
      description={fieldSchema.description}
      error={field.touched ? field.error : undefined}
    >
      <FieldComponent
        name={name}
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        error={field.error}
        placeholder={fieldSchema.placeholder}
        title={fieldSchema.title}
        description={fieldSchema.description}
        options={fieldSchema.options}
        fieldSchema={fieldSchema}
      />
    </Template>
  );
}
