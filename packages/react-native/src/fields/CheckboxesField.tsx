import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { FieldComponentProps } from '../types.js';
import { cn } from '../ui/utils.js';

export function CheckboxesField({
  name,
  value,
  onChange,
  onBlur,
  options,
  disabled,
}: FieldComponentProps) {
  const selected = Array.isArray(value) ? (value as string[]) : [];

  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...selected, optionValue]);
    } else {
      onChange(selected.filter((v) => v !== optionValue));
    }
  };

  return (
    <View className="gap-2" testID={name}>
      {(options ?? []).map((opt) => {
        const isChecked = selected.includes(opt.value);
        return (
          <Pressable
            key={opt.value}
            disabled={disabled}
            onPress={() => {
              handleChange(opt.value, !isChecked);
              onBlur();
            }}
            className="flex-row items-center gap-2"
          >
            <View
              className={cn(
                'h-5 w-5 items-center justify-center rounded border',
                isChecked ? 'border-blue-600 bg-blue-600' : 'border-gray-300 bg-white',
                disabled && 'opacity-50',
              )}
            >
              {isChecked && <Text className="text-xs font-bold text-white">✓</Text>}
            </View>
            <Text className="text-sm text-gray-900">{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

