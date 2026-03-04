import React, { forwardRef } from 'react';
import { TextInput } from 'react-native';
import type { TextInput as TextInputType } from 'react-native';
import { cn } from './utils';

export interface InputProps {
  className?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  editable?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  testID?: string;
}

const Input = forwardRef<TextInputType, InputProps>(
  ({ className, editable = true, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          'h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400',
          !editable && 'opacity-50',
          className,
        )}
        editable={editable}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };

