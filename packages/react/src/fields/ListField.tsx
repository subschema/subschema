import React from 'react';
import type { FieldComponentProps } from '../types.js';
import { Button } from '../ui/Button.js';
import { useFieldArray } from '../hooks/useFieldArray.js';
import { useFormState } from '../components/FormStateContext.js';

/**
 * List/array field. Allows adding and removing items.
 * Uses shadcn Button for add/remove controls.
 */
export function ListField({ name, fieldSchema }: FieldComponentProps) {
  const formState = useFormState();
  const { fields, push, remove } = useFieldArray(name, formState);

  return (
    <div className="space-y-2">
      {fields.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={String(item ?? '')}
            onChange={(e) => {
              const newFields = [...fields];
              newFields[index] = e.target.value;
              formState.setValue(name, newFields);
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => remove(index)}
          >
            Remove
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => push('')}
      >
        Add Item
      </Button>
    </div>
  );
}

