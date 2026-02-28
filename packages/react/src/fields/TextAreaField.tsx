import React from 'react';
import type { FieldComponentProps } from '../types.js';
import { Textarea } from '../ui/Textarea.js';

export function TextAreaField({ name, value, onChange, onBlur, placeholder, disabled }: FieldComponentProps) {
  return (
    <Textarea
      id={name}
      name={name}
      value={String(value ?? '')}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}

