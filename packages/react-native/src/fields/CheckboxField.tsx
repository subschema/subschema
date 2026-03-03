import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { FieldComponentProps } from '../types.js';
import { cn } from '../ui/utils.js';

export function CheckboxField({
  name,
  value,
  onChange,
  onBlur,
  disabled,
}: FieldComponentProps) {
  const checked = Boolean(value);

  return (
    <Pressable
      testID={name}
      disabled={disabled}
      onPress={() => {
        onChange(!checked);
        onBlur();
      }}
      className="flex-row items-center"
    >
      <View
        className={cn(
          'h-5 w-5 items-center justify-center rounded border',
          checked ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white',
          disabled && 'opacity-50',
        )}
      >
        {checked && <Text className="text-xs font-bold text-white">✓</Text>}
      </View>
    </Pressable>
  );
}

