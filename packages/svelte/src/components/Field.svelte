<script lang="ts">
  import type { FieldSchema, FieldComponent, TemplateComponent } from '../types.js';
  import { evaluateCondition } from '@subschema/core';
  import { getFormContainerContext, getFormStateContext } from '../context.js';
  import { createFieldState } from '../field-state.svelte.js';
  import { findClosestMatch } from '@subschema/core';

  interface Props {
    name: string;
    fieldSchema: FieldSchema;
  }

  let { name, fieldSchema }: Props = $props();

  const containerCtx = getFormContainerContext();
  const formState = getFormStateContext();
  const field = createFieldState(name, fieldSchema, formState);

  // Resolve field type
  const FieldComp = $derived.by(() => {
    const comp = containerCtx.fieldTypes[fieldSchema.type];
    if (comp) return comp;

    const available = Object.keys(containerCtx.fieldTypes);
    const suggestion = findClosestMatch(fieldSchema.type, available);
    let message = `Field type "${fieldSchema.type}" not found.\nAvailable: ${available.join(', ')}`;
    if (suggestion) message += `\nDid you mean: "${suggestion}"?`;
    throw new Error(message);
  }) as FieldComponent;

  // Resolve template
  const Template = $derived.by(() => {
    const templateName = (fieldSchema.template as string) ?? 'Default';
    const comp = containerCtx.templates[templateName];
    if (!comp) {
      throw new Error(
        `Template "${templateName}" not found. Available: ${Object.keys(containerCtx.templates).join(', ')}`,
      );
    }
    return comp;
  }) as TemplateComponent;

  // Conditional visibility
  const isVisible = $derived(
    fieldSchema.conditional
      ? evaluateCondition(fieldSchema.conditional, formState.values)
      : true,
  );
</script>

{#if isVisible}
  {#if fieldSchema.type === 'Hidden'}
    <FieldComp
      {name}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={field.error}
      {fieldSchema}
    />
  {:else}
    <Template
      {name}
      label={fieldSchema.title}
      description={fieldSchema.description}
      error={field.touched ? field.error : undefined}
    >
      {#snippet children()}
        <FieldComp
          {name}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={field.error}
          placeholder={fieldSchema.placeholder}
          title={fieldSchema.title}
          description={fieldSchema.description}
          options={fieldSchema.options}
          {fieldSchema}
        />
      {/snippet}
    </Template>
  {/if}
{/if}

