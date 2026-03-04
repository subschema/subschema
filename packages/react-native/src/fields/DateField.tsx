import React from 'react';
import type { FieldComponentProps } from '../types';
import { Input } from '../ui/Input';

/**
 * Date field using a simple TextInput with date format hint.
 * For a full native date picker, integrate @react-native-community/datetimepicker.
 */
export function DateField({
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
      value={value ? String(value) : ''}
      onChangeText={(text) => onChange(text)}
      onBlur={onBlur}
      placeholder={placeholder ?? 'YYYY-MM-DD'}
      editable={!disabled}
    />
  );
}

