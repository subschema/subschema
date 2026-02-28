import React from 'react';
import type { TemplateComponentProps } from '../types.js';
import { Label } from '../ui/Label.js';
import { cn } from '../ui/utils.js';

/**
 * Default template wrapper for form fields.
 * Provides label, description text, and error message display.
 * Uses shadcn/ui Label component.
 */
export function DefaultTemplate({ name, label, description, error, children }: TemplateComponentProps) {
  return (
    <div className={cn('space-y-2')} data-field={name}>
      {label && (
        <Label htmlFor={name} className={cn(error && 'text-destructive')}>
          {label}
        </Label>
      )}
      {children}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

