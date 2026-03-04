import React from 'react';
import { Text } from 'react-native';
import { cn } from './utils';

export interface LabelProps {
  className?: string;
  children: React.ReactNode;
  testID?: string;
}

export function Label({ className, children, testID }: LabelProps) {
  return (
    <Text
      className={cn('text-sm leading-none font-medium text-gray-900', className)}
      testID={testID}
    >
      {children}
    </Text>
  );
}
