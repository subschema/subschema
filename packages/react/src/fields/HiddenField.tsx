import React from 'react';
import type { FieldComponentProps } from '../types.js';

export function HiddenField({ name, value }: FieldComponentProps) {
  return <input type="hidden" name={name} value={String(value ?? '')} />;
}
