import React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type { FieldComponentProps } from '../types.js';
import { Label } from '../ui/Label.js';
import { cn } from '../ui/utils.js';

export function RadioField({
  name,
  value,
  onChange,
  onBlur,
  options,
  disabled,
}: FieldComponentProps) {
  return (
    <RadioGroupPrimitive.Root
      value={String(value ?? '')}
      onValueChange={(v) => onChange(v)}
      disabled={disabled}
      className="space-y-2"
    >
      {(options ?? []).map((opt) => (
        <div key={opt.value} className="flex items-center space-x-2">
          <RadioGroupPrimitive.Item
            id={`${name}-${opt.value}`}
            value={opt.value}
            onBlur={onBlur}
            className={cn(
              'border-primary text-primary ring-offset-background focus-visible:ring-ring aspect-square h-4 w-4 rounded-full border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
              <span className="h-2.5 w-2.5 rounded-full bg-current" />
            </RadioGroupPrimitive.Indicator>
          </RadioGroupPrimitive.Item>
          <Label htmlFor={`${name}-${opt.value}`}>{opt.label}</Label>
        </div>
      ))}
    </RadioGroupPrimitive.Root>
  );
}
