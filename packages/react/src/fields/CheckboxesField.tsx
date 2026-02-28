import React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import type { FieldComponentProps } from '../types.js';
import { Label } from '../ui/Label.js';
import { cn } from '../ui/utils.js';

export function CheckboxesField({ name, value, onChange, onBlur, options, disabled }: FieldComponentProps) {
  const selected = Array.isArray(value) ? value : [];

  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...selected, optionValue]);
    } else {
      onChange(selected.filter((v: unknown) => v !== optionValue));
    }
  };

  return (
    <div className="space-y-2" role="group" aria-label={name}>
      {(options ?? []).map((opt) => (
        <div key={opt.value} className="flex items-center space-x-2">
          <CheckboxPrimitive.Root
            id={`${name}-${opt.value}`}
            checked={selected.includes(opt.value)}
            onCheckedChange={(checked) => handleChange(opt.value, checked === true)}
            onBlur={onBlur}
            disabled={disabled}
            className={cn(
              'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
            )}
          >
            <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
          <Label htmlFor={`${name}-${opt.value}`}>{opt.label}</Label>
        </div>
      ))}
    </div>
  );
}

