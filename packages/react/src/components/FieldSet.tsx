import React from 'react';
import type { FieldSchema, FieldsetConfig } from '../types.js';
import { Field } from './Field.js';
import { cn } from '../ui/utils.js';

export interface FieldSetProps {
  config: FieldsetConfig;
  schema: Record<string, FieldSchema>;
}

/**
 * Groups fields together with an optional legend.
 */
export function FieldSet({ config, schema }: FieldSetProps) {
  return (
    <fieldset className={cn('space-y-4 rounded-lg border p-4')}>
      {config.legend && (
        <legend className="px-2 text-lg font-semibold">{config.legend}</legend>
      )}
      {config.fields.map((fieldName) => {
        const fieldSchema = schema[fieldName];
        if (!fieldSchema) return null;
        return <Field key={fieldName} name={fieldName} fieldSchema={fieldSchema} />;
      })}
    </fieldset>
  );
}

