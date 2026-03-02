import React from 'react';
import type { FieldComponentProps } from '../types.js';
import { Input } from '../ui/Input.js';

export function NumberField({
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
}: FieldComponentProps) {
  return (
    <Input
      id={name}
      name={name}
      type="number"
      value={value === '' || value === undefined || value === null ? '' : String(value)}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === '' ? '' : Number(v));
      }}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}
