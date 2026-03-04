import React from 'react';
import type { ConditionalConfig } from '../types';
import { useConditional } from '../hooks/useConditional';
import { useFormState } from './FormStateContext';

export interface ConditionalProps {
  /** Field name to listen to */
  listen: string;
  /** Comparison operator */
  operator: ConditionalConfig['operator'];
  /** Value to compare against */
  value?: unknown;
  children: React.ReactNode;
}

/**
 * Conditional rendering component.
 * Shows/hides children based on another field's value.
 */
export function Conditional({ listen, operator, value, children }: ConditionalProps) {
  const formState = useFormState();
  const isVisible = useConditional({ listen, operator, value }, formState.values);

  if (!isVisible) return null;
  return <>{children}</>;
}

