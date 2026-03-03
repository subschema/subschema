import React from 'react';
import { View, Text } from 'react-native';
import type { TemplateComponentProps } from '../types.js';
import { Label } from '../ui/Label.js';
import { cn } from '../ui/utils.js';

/**
 * Default template wrapper for form fields.
 * Provides label, description text, and error message display.
 * Uses React Native View/Text with NativeWind styling.
 */
export function DefaultTemplate({
  name,
  label,
  description,
  error,
  children,
}: TemplateComponentProps) {
  return (
    <View className={cn('gap-2')} testID={`field-${name}`}>
      {label && (
        <Label className={cn(error && 'text-red-500')}>
          {label}
        </Label>
      )}
      {children}
      {description && (
        <Text className="text-sm text-gray-500">{description}</Text>
      )}
      {error && (
        <Text className="text-sm font-medium text-red-500" accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
}

