<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { FormSchema, FormContextValue } from '../types.js';
  import type { ValidatorFn } from '@subschema/core';
  import type { Container } from '@speajus/diblob';
  import {
    createFormContainer,
    resolveRegistries,
    createDefaultContainer,
  } from '../registry/container.js';
  import {
    getFormContainerContextOptional,
    setFormContainerContext,
    setFormStateContext,
  } from '../context.js';
  import { createFormState } from '../form-state.svelte.js';
  import { cn } from '../ui/utils.js';
  import Field from './Field.svelte';
  import FieldSet from './FieldSet.svelte';

  interface Props {
    /** Form schema definition */
    schema: FormSchema;
    /** Form submission handler */
    onSubmit?: (values: Record<string, unknown>) => void;
    /** Initial form values */
    values?: Record<string, unknown>;
    /** Custom field type overrides */
    types?: Record<string, unknown>;
    /** Custom template overrides */
    templates?: Record<string, unknown>;
    /** Custom validator overrides */
    validators?: Record<string, ValidatorFn>;
    /** Additional className */
    className?: string;
    children?: Snippet;
    /** When true, renders a <div> instead of <form> */
    nested?: boolean;
    /** Called whenever form values change */
    onChange?: (values: Record<string, unknown>) => void;
  }

  let {
    schema,
    onSubmit,
    values: initialValues,
    types,
    templates: templateOverrides,
    validators: validatorOverrides,
    className,
    children,
    nested,
    onChange,
  }: Props = $props();

  // Build container context
  const parentCtx = getFormContainerContextOptional();
  const parentContainer = parentCtx
    ? (parentCtx.containerRef as Container)
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
  const ctxValue: FormContextValue = {
    ...registries,
    containerRef: container,
  } as FormContextValue;

  setFormContainerContext(ctxValue);

  // Create form state
  const formState = createFormState(
    schema,
    ctxValue.validators,
    initialValues,
  );
  setFormStateContext(formState);

  const handler = formState.handleSubmit(onSubmit ?? (() => {}));

  // Watch for value changes — guard against infinite loops with nested ObjectField
  let prevValuesJson = $state(JSON.stringify(formState.values));
  $effect(() => {
    const currentJson = JSON.stringify(formState.values);
    if (currentJson !== prevValuesJson) {
      prevValuesJson = currentJson;
      onChange?.(formState.values);
    }
  });

  // Determine field rendering order
  const fieldsetFieldNames = new Set((schema.fieldsets ?? []).flatMap((fs) => fs.fields));
  const ungroupedFields = Object.keys(schema.schema).filter(
    (name) => !fieldsetFieldNames.has(name),
  );
</script>

{#if nested}
  <div class={cn('space-y-4', className)}>
    {#each schema.fieldsets ?? [] as fs, i}
      <FieldSet config={fs} schema={schema.schema} />
    {/each}
    {#each ungroupedFields as fieldName}
      <Field name={fieldName} fieldSchema={schema.schema[fieldName]} />
    {/each}
    {#if children}
      {@render children()}
    {/if}
  </div>
{:else}
  <form onsubmit={handler} novalidate class={cn('space-y-4', className)}>
    {#each schema.fieldsets ?? [] as fs, i}
      <FieldSet config={fs} schema={schema.schema} />
    {/each}
    {#each ungroupedFields as fieldName}
      <Field name={fieldName} fieldSchema={schema.schema[fieldName]} />
    {/each}
    {#if children}
      {@render children()}
    {/if}
  </form>
{/if}

