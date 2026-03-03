import React from 'react';
import type { FieldComponentProps } from '../types.js';
import { Input } from '../ui/Input.js';

export function TextField({
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
}: FieldComponentProps) {
  return (
    <Input
      testID={name}
      value={String(value ?? '')}
      onChangeText={(text) => onChange(text)}
      onBlur={onBlur}
      placeholder={placeholder}
      editable={!disabled}
    />
  );
}

