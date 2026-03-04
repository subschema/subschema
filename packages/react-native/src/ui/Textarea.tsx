import React, { forwardRef } from 'react';
import { TextInput } from 'react-native';
import type { TextInput as TextInputType } from 'react-native';
import { cn } from './utils';

export interface TextareaProps {
  className?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  editable?: boolean;
  numberOfLines?: number;
  testID?: string;
}

const Textarea = forwardRef<TextInputType, TextareaProps>(
  ({ className, editable = true, numberOfLines = 4, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        multiline
        numberOfLines={numberOfLines}
        className={cn(
          'min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400',
          !editable && 'opacity-50',
          className,
        )}
        editable={editable}
        textAlignVertical="top"
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };

