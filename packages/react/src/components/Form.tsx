import React, { useContext, useMemo } from 'react';
import type { FormSchema, FieldTypeRegistry, TemplateRegistry, ValidatorRegistry, FieldComponent, TemplateComponent, ValidatorFn } from '../types.js';
import { FormContainerContext } from './FormProvider.js';
import { FormStateContext } from './FormStateContext.js';
import { Field } from './Field.js';
import { FieldSet } from './FieldSet.js';
import { useForm } from '../hooks/useForm.js';
import { createDefaultContainer, createFormContainer, resolveRegistries } from '../registry/container.js';
import { cn } from '../ui/utils.js';

export interface FormProps {
  /** Form schema definition */
  schema: FormSchema;
  /** Form submission handler */
  onSubmit?: (values: Record<string, unknown>) => void;
  /** Initial form values */
  values?: Record<string, unknown>;
  /** Custom field type overrides (Option B) */
  types?: Record<string, FieldComponent>;
  /** Custom template overrides */
  templates?: Record<string, TemplateComponent>;
  /** Custom validator overrides */
  validators?: Record<string, ValidatorFn>;
  /** Additional className */
  className?: string;
  children?: React.ReactNode;
}

/**
 * Top-level Form component.
 *
 * Creates or inherits a diblob container. When types/templates/validators
 * props are provided, creates a child container with those overrides (Option B).
 *
 * @example
 * ```tsx
 * <Form schema={mySchema} onSubmit={handleSubmit} />
 *
 * // With custom types (Option B)
 * <Form schema={mySchema} types={{ Rating: RatingField }} onSubmit={handleSubmit} />
 * ```
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
}: FormProps) {
  const parentCtx = useContext(FormContainerContext);

  // Build container context: inherit from parent or create default,
  // then apply prop overrides
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
}

function FormInner({ schema, onSubmit, initialValues, className, children }: FormInnerProps) {
  const formState = useForm(schema, initialValues);
  const handler = formState.handleSubmit(onSubmit ?? (() => {}));

  // Determine field rendering order
  const fieldsetFieldNames = new Set(
    (schema.fieldsets ?? []).flatMap((fs) => fs.fields),
  );
  const ungroupedFields = Object.keys(schema.schema).filter(
    (name) => !fieldsetFieldNames.has(name),
  );

  return (
    <FormStateContext.Provider value={formState}>
      <form onSubmit={handler} className={cn('space-y-4', className)} noValidate>
        {/* Render fieldsets */}
        {schema.fieldsets?.map((fs, i) => (
          <FieldSet key={`fieldset-${i}`} config={fs} schema={schema.schema} />
        ))}
        {/* Render ungrouped fields */}
        {ungroupedFields.map((name) => (
          <Field key={name} name={name} fieldSchema={schema.schema[name]} />
        ))}
        {children}
      </form>
    </FormStateContext.Provider>
  );
}

