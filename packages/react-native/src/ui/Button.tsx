import React from 'react';
import { Pressable, Text } from 'react-native';
import { cn } from './utils';

export interface ButtonProps {
  className?: string;
  textClassName?: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
  testID?: string;
}

const variantClasses: Record<string, string> = {
  default: 'bg-blue-600',
  destructive: 'bg-red-600',
  outline: 'border border-gray-300 bg-white',
  secondary: 'bg-gray-200',
  ghost: '',
};

const variantTextClasses: Record<string, string> = {
  default: 'text-white',
  destructive: 'text-white',
  outline: 'text-gray-900',
  secondary: 'text-gray-900',
  ghost: 'text-gray-900',
};

const sizeClasses: Record<string, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3',
  lg: 'h-11 px-8',
};

export function Button({
  className,
  textClassName,
  onPress,
  disabled = false,
  variant = 'default',
  size = 'default',
  children,
  testID,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        'flex-row items-center justify-center rounded-md',
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50',
        className,
      )}
      testID={testID}
    >
      {typeof children === 'string' ? (
        <Text className={cn('text-sm font-medium', variantTextClasses[variant], textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
