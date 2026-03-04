import React from 'react';
import { View, Text } from 'react-native';
import type { FieldSchema, FieldsetConfig } from '../types';
import { Field } from './Field';
import { cn } from '../ui/utils';

export interface FieldSetProps {
  config: FieldsetConfig;
  schema: Record<string, FieldSchema>;
}

/**
 * Groups fields together with an optional legend.
 * Uses View instead of HTML fieldset element.
 */
export function FieldSet({ config, schema }: FieldSetProps) {
  return (
    <View className={cn('gap-4 rounded-lg border border-gray-200 p-4')}>
      {config.legend && <Text className="px-2 text-lg font-semibold">{config.legend}</Text>}
      {config.fields.map((fieldName) => {
        const fieldSchema = schema[fieldName];
        if (!fieldSchema) return null;
        return <Field key={fieldName} name={fieldName} fieldSchema={fieldSchema} />;
      })}
    </View>
  );
}
