import React, { useState } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { FieldComponentProps } from '../types.js';
import { Input } from '../ui/Input.js';
import { cn } from '../ui/utils.js';

/**
 * Autocomplete field using Radix Popover for the dropdown.
 * Filters options based on text input.
 */
export function AutocompleteField({
  name,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  disabled,
}: FieldComponentProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(String(value ?? ''));

  const filtered = (options ?? []).filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Anchor asChild>
        <Input
          id={name}
          name={name}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={(e) => {
            // Delay close to allow click on options
            setTimeout(() => {
              setOpen(false);
              onBlur();
            }, 200);
          }}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
        />
      </PopoverPrimitive.Anchor>
      {open && filtered.length > 0 && (
        <PopoverPrimitive.Content
          className={cn(
            'bg-popover text-popover-foreground z-50 max-h-48 overflow-auto rounded-md border p-1 shadow-md',
          )}
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {filtered.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={cn(
                'hover:bg-accent hover:text-accent-foreground w-full cursor-default rounded-sm px-2 py-1.5 text-left text-sm',
                value === opt.value && 'bg-accent',
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(opt.value);
                setSearch(opt.label);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </PopoverPrimitive.Content>
      )}
    </PopoverPrimitive.Root>
  );
}
