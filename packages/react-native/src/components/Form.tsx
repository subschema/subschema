import React, { useContext, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import type {
  FormSchema,
  FieldComponent,
  TemplateComponent,
  ValidatorFn,
} from '../types.js';
import { FormContainerContext } from './FormProvider.js';
import { FormStateContext } from './FormStateContext.js';
import { Field } from './Field.js';
import { FieldSet } from './FieldSet.js';
import { useForm } from '../hooks/useForm.js';
import {
  createDefaultContainer,
  createFormContainer,
  resolveRegistries,
} from '../registry/container.js';
import { cn } from '../ui/utils.js';

export interface FormProps {
  /** Form schema definition */
  schema: FormSchema;
  /** Form submission handler */
  onSubmit?: (values: Record<string, unknown>) => void;
  /** Initial form values */
  values?: Record<string, unknown>;
  /** Custom field type overrides */
  types?: Record<string, FieldComponent>;
  /** Custom template overrides */
  templates?: Record<string, TemplateComponent>;
  /** Custom validator overrides */
  validators?: Record<string, ValidatorFn>;
  /** Additional className for NativeWind */
  className?: string;
  children?: React.ReactNode;
  /** Called whenever form values change */
  onChange?: (values: Record<string, unknown>) => void;
}

/**
 * Top-level Form component for React Native.
 * Uses View instead of HTML form element.
 * Submit is triggered via onSubmit callback, not HTML form submission.
 */
export function Form({
  schema,
  onSubmit,
  values: initialValues,
  types,
  templates: templateOverrides,
  validators: validatorOverrides,
  className,
  children,
  onChange,
}: FormProps) {
  const parentCtx = useContext(FormContainerContext);

  const ctxValue = useMemo(() => {
    const parentContainer = parentCtx
      ? (parentCtx.containerRef as import('@speajus/diblob').Container)
      : createDefaultContainer();

    const hasOverrides = types || templateOverrides || validatorOverrides;
    const container = hasOverrides
      ? createFormContainer(parentContainer, {
          types,
          templates: templateOverrides,
          validators: validatorOverrides,
        })
      : parentContainer;

    const registries = resolveRegistries(container);
    return { ...registries, containerRef: container };
  }, [parentCtx, types, templateOverrides, validatorOverrides]);

  return (
    <FormContainerContext.Provider value={ctxValue}>
      <FormInner
        schema={schema}
        onSubmit={onSubmit}
        initialValues={initialValues}
        className={className}
        onChange={onChange}
      >
        {children}
      </FormInner>
    </FormContainerContext.Provider>
  );
}

interface FormInnerProps {
  schema: FormSchema;
  onSubmit?: (values: Record<string, unknown>) => void;
  initialValues?: Record<string, unknown>;
  className?: string;
  children?: React.ReactNode;
  onChange?: (values: Record<string, unknown>) => void;
}

function FormInner({
  schema,
  onSubmit,
  initialValues,
  className,
  children,
  onChange,
}: FormInnerProps) {
  const formState = useForm(schema, initialValues);

  useEffect(() => {
    onChange?.(formState.values);
  }, [formState.values, onChange]);

  // Expose submit handler via the onSubmit prop
  // Consumers call formState.handleSubmit(onSubmit) or use a Button with onPress
  const _handler = formState.handleSubmit(onSubmit ?? (() => {}));

  const fieldsetFieldNames = new Set((schema.fieldsets ?? []).flatMap((fs) => fs.fields));
  const ungroupedFields = Object.keys(schema.schema).filter(
    (name) => !fieldsetFieldNames.has(name),
  );

  return (
    <FormStateContext.Provider value={formState}>
      <View className={cn('gap-4', className)}>
        {schema.fieldsets?.map((fs, i) => (
          <FieldSet key={`fieldset-${i}`} config={fs} schema={schema.schema} />
        ))}
        {ungroupedFields.map((name) => (
          <Field key={name} name={name} fieldSchema={schema.schema[name]} />
        ))}
        {children}
      </View>
    </FormStateContext.Provider>
  );
}

