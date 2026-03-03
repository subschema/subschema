import { useContext } from 'react';
import { FormContainerContext } from '../components/FormProvider.js';
import type { FormContextValue } from '../types.js';

/**
 * Access the current form container context.
 * Must be used within a <FormProvider> or <Form>.
 */
export function useFormContainer(): FormContextValue {
  const ctx = useContext(FormContainerContext);
  if (!ctx) {
    throw new Error(
      'useFormContainer must be used within a <FormProvider> or <Form>. ' +
        'Wrap your form in <FormProvider container={container}> or use <Form schema={...}>.',
    );
  }
  return ctx;
}

