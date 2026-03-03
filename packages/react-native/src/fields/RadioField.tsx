import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { FieldComponentProps } from '../types.js';
import { cn } from '../ui/utils.js';

export function RadioField({
  name,
  value,
  onChange,
  onBlur,
  options,
  disabled,
}: FieldComponentProps) {
  const currentValue = String(value ?? '');

  return (
    <View className="gap-2" testID={name}>
      {(options ?? []).map((opt) => {
        const isSelected = currentValue === opt.value;
        return (
          <Pressable
            key={opt.value}
            disabled={disabled}
            onPress={() => {
              onChange(opt.value);
              onBlur();
            }}
            className="flex-row items-center gap-2"
          >
            <View
              className={cn(
                'h-5 w-5 items-center justify-center rounded-full border',
                isSelected ? 'border-blue-600' : 'border-gray-300',
                disabled && 'opacity-50',
              )}
            >
              {isSelected && <View className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
            </View>
            <Text className="text-sm text-gray-900">{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

