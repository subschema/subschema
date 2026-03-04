import React, { createContext, useMemo } from 'react';
import type { Container } from '@speajus/diblob';
import type { FormContextValue } from '../types';
import { resolveRegistries } from '../registry/container';

/**
 * React context holding the diblob container and resolved registries.
 */
export const FormContainerContext = createContext<FormContextValue | null>(null);

export interface FormProviderProps {
  /** A pre-configured diblob container */
  container: Container;
  children: React.ReactNode;
}

/**
 * Provides a diblob container to the form tree via React context.
 */
export function FormProvider({ container, children }: FormProviderProps) {
  const contextValue = useMemo<FormContextValue>(() => {
    const registries = resolveRegistries(container);
    return {
      ...registries,
      containerRef: container,
    };
  }, [container]);

  return (
    <FormContainerContext.Provider value={contextValue}>{children}</FormContainerContext.Provider>
  );
}
