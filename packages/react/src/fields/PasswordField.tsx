import React from 'react';
import type { FieldComponentProps } from '../types.js';
import { Input } from '../ui/Input.js';

export function PasswordField({
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
      type="password"
      value={String(value ?? '')}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}
