import React, { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import type { FieldComponentProps } from '../types.js';
import { Input } from '../ui/Input.js';
import { cn } from '../ui/utils.js';

/**
 * Autocomplete field using TextInput + filtered FlatList dropdown.
 */
export function AutocompleteField({
  name,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  disabled,
}: FieldComponentProps) {
  const [search, setSearch] = useState(String(value ?? ''));
  const [open, setOpen] = useState(false);

  const filtered = (options ?? []).filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View>
      <Input
        testID={name}
        value={search}
        onChangeText={(text) => {
          setSearch(text);
          setOpen(true);
        }}
        onBlur={() => {
          // Delay close to allow press on options
          setTimeout(() => {
            setOpen(false);
            onBlur();
          }, 200);
        }}
        placeholder={placeholder}
        editable={!disabled}
      />
      {open && filtered.length > 0 && (
        <View className="mt-1 max-h-48 rounded-md border border-gray-200 bg-white shadow-sm">
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.value}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onChange(item.value);
                  setSearch(item.label);
                  setOpen(false);
                }}
                className={cn(
                  'px-3 py-2',
                  value === item.value && 'bg-blue-50',
                )}
              >
                <Text className="text-sm text-gray-900">{item.label}</Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
}

