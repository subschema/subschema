import React, { useState } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { FieldComponentProps } from '../types.js';
import { Button } from '../ui/Button.js';
import { cn } from '../ui/utils.js';

/**
 * Date field using a simple date input with popover styling.
 * Uses Radix Popover for the dropdown calendar feel.
 * For a full calendar, integrate react-day-picker; this is a functional baseline.
 */
export function DateField({
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
}: FieldComponentProps) {
  const [open, setOpen] = useState(false);
  const dateStr = value ? String(value) : '';

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <Button
          id={name}
          variant="outline"
          type="button"
          disabled={disabled}
          onBlur={onBlur}
          className={cn(
            'w-full justify-start text-left font-normal',
            !dateStr && 'text-muted-foreground',
          )}
        >
          {dateStr || placeholder || 'Pick a date'}
        </Button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className="bg-popover text-popover-foreground z-50 rounded-md border p-4 shadow-md"
          align="start"
        >
          <input
            type="date"
            value={dateStr}
            onChange={(e) => {
              onChange(e.target.value);
              setOpen(false);
            }}
            className="rounded border px-2 py-1 text-sm"
          />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
