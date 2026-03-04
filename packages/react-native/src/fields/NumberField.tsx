import React from 'react';
import type { FieldComponentProps } from '../types';
import { Input } from '../ui/Input';

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
      testID={name}
      value={value === '' || value === undefined || value === null ? '' : String(value)}
      onChangeText={(text) => {
        onChange(text === '' ? '' : Number(text));
      }}
      onBlur={onBlur}
      placeholder={placeholder}
      editable={!disabled}
      keyboardType="numeric"
    />
  );
}

