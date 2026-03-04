import React from 'react';
import { View } from 'react-native';
import type { FieldComponentProps } from '../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useFieldArray } from '../hooks/useFieldArray';
import { useFormState } from '../components/FormStateContext';

/**
 * List/array field. Allows adding and removing items.
 */
export function ListField({ name }: FieldComponentProps) {
  const formState = useFormState();
  const { fields, push, remove } = useFieldArray(name, formState);

  return (
    <View className="gap-2">
      {fields.map((item, index) => (
        <View key={index} className="flex-row items-center gap-2">
          <View className="flex-1">
            <Input
              value={String(item ?? '')}
              onChangeText={(text) => {
                const newFields = [...fields];
                newFields[index] = text;
                formState.setValue(name, newFields);
              }}
            />
          </View>
          <Button variant="destructive" size="sm" onPress={() => remove(index)}>
            Remove
          </Button>
        </View>
      ))}
      <Button variant="outline" size="sm" onPress={() => push('')}>
        Add Item
      </Button>
    </View>
  );
}

