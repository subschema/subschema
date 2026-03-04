import React from 'react';
import { View, Text } from 'react-native';
import { cn } from './utils';

export interface CardProps {
  className?: string;
  children: React.ReactNode;
  testID?: string;
}

export function Card({ className, children, testID }: CardProps) {
  return (
    <View
      className={cn('rounded-lg border border-gray-200 bg-white shadow-sm', className)}
      testID={testID}
    >
      {children}
    </View>
  );
}

export interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return <View className={cn('flex flex-col space-y-1.5 p-6', className)}>{children}</View>;
}

export interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

export function CardTitle({ className, children }: CardTitleProps) {
  return (
    <Text className={cn('text-2xl leading-none font-semibold tracking-tight', className)}>
      {children}
    </Text>
  );
}

export interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export function CardContent({ className, children }: CardContentProps) {
  return <View className={cn('p-6 pt-0', className)}>{children}</View>;
}
