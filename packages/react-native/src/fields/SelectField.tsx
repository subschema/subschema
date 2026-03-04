import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList } from 'react-native';
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
    <View>
      <Pressable
        testID={name}
        disabled={disabled}
        onPress={() => setOpen(true)}
        className={cn(
          'h-10 w-full flex-row items-center justify-between rounded-md border border-gray-300 bg-white px-3',
          disabled && 'opacity-50',
        )}
      >
        <Text className={cn('text-sm', selectedLabel ? 'text-gray-900' : 'text-gray-400')}>
          {selectedLabel ?? placeholder ?? 'Select...'}
        </Text>
        <Text className="text-gray-400">▼</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable
          className="flex-1 items-center justify-center bg-black/50"
          onPress={() => {
            setOpen(false);
            onBlur();
          }}
        >
          <View className="m-8 max-h-[60%] w-[80%] rounded-lg bg-white shadow-lg">
            <View className="border-b border-gray-200 p-4">
              <Text className="text-base font-medium text-gray-900">
                {placeholder ?? 'Select...'}
              </Text>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Pressable
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
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

