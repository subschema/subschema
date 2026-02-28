import React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import type { FieldComponentProps } from '../types.js';
import { cn } from '../ui/utils.js';

export function CheckboxField({ name, value, onChange, onBlur, disabled }: FieldComponentProps) {
  return (
    <CheckboxPrimitive.Root
      id={name}
      checked={Boolean(value)}
      onCheckedChange={(checked) => onChange(checked === true)}
      onBlur={onBlur}
      disabled={disabled}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      )}
    >
      <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

