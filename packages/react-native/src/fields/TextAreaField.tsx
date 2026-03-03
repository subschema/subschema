import React from 'react';
import type { FieldComponentProps } from '../types.js';
import { Textarea } from '../ui/Textarea.js';

export function TextAreaField({
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled,
}: FieldComponentProps) {
  return (
    <Textarea
      testID={name}
      value={String(value ?? '')}
      onChangeText={(text) => onChange(text)}
      onBlur={onBlur}
      placeholder={placeholder}
      editable={!disabled}
    />
  );
}

