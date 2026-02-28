import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import type { FieldComponentProps } from '../types.js';
import { cn } from '../ui/utils.js';

export function SelectField({ name, value, onChange, onBlur, options, placeholder, disabled }: FieldComponentProps) {
  return (
    <SelectPrimitive.Root
      value={String(value ?? '')}
      onValueChange={(v) => onChange(v)}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        id={name}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        )}
        onBlur={onBlur}
      >
        <SelectPrimitive.Value placeholder={placeholder ?? 'Select...'} />
        <SelectPrimitive.Icon />
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className={cn(
            'relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
          )}
        >
          <SelectPrimitive.Viewport className="p-1">
            {(options ?? []).map((opt) => (
              <SelectPrimitive.Item
                key={opt.value}
                value={opt.value}
                className={cn(
                  'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground',
                )}
              >
                <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

