import { createContext, useContext } from 'react';
import type { UseFormReturn } from '../types.js';

/**
 * React context for sharing form state (values, errors, touched) down the tree.
 * Separate from FormContainerContext which holds the diblob container.
 */
export const FormStateContext = createContext<UseFormReturn | null>(null);

export function useFormState(): UseFormReturn {
  const ctx = useContext(FormStateContext);
  if (!ctx) {
    throw new Error('useFormState must be used within a <Form> component.');
  }
  return ctx;
}

