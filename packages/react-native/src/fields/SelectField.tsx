import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import type { FieldComponentProps } from '../types';
import { cn } from '../ui/utils';

export function SelectField({
  name,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  disabled,
}: FieldComponentProps) {
  const [open, setOpen] = useState(false);
  const items = options ?? [];
  const selectedLabel = items.find((opt) => opt.value === String(value ?? ''))?.label;

  return (
    <View className="relative z-10">
      <Pressable
        testID={name}
        disabled={disabled}
        onPress={() => setOpen((prev) => !prev)}
        className={cn(
          'h-10 w-full flex-row items-center justify-between rounded-md border border-gray-300 bg-white px-3',
          disabled && 'opacity-50',
        )}
      >
        <Text className={cn('text-sm', selectedLabel ? 'text-gray-900' : 'text-gray-400')}>
          {selectedLabel ?? placeholder ?? 'Select...'}
        </Text>
        <Text className="text-gray-400">{open ? '▲' : '▼'}</Text>
      </Pressable>

      {open && (
        <View className="absolute top-11 left-0 right-0 z-50 max-h-60 rounded-md border border-gray-200 bg-white shadow-lg">
          <ScrollView nestedScrollEnabled>
            {items.map((item) => (
              <Pressable
                key={item.value}
                onPress={() => {
                  onChange(item.value);
                  setOpen(false);
                  onBlur();
                }}
                className={cn(
                  'px-4 py-3',
                  value === item.value && 'bg-blue-50',
                )}
              >
                <Text
                  className={cn(
                    'text-sm',
                    value === item.value ? 'font-medium text-blue-600' : 'text-gray-900',
                  )}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

