<script lang="ts">
  import type { FieldComponentProps } from '../types.js';
  import type { FormSchema } from '@subschema/core';
  import { createContainer } from '@speajus/diblob';
  import type { Container } from '@speajus/diblob';
  import Card from '../ui/Card.svelte';
  import CardHeader from '../ui/CardHeader.svelte';
  import CardTitle from '../ui/CardTitle.svelte';
  import CardContent from '../ui/CardContent.svelte';
  import { getFormContainerContext } from '../context.js';
  import Form from '../components/Form.svelte';

  let { name, value, onChange, fieldSchema }: FieldComponentProps = $props();

  const { containerRef } = getFormContainerContext();
  const childContainer = createContainer(containerRef as Container);

  const subSchema = fieldSchema.subSchema as FormSchema | undefined;
  const objectValue = $derived(
    (typeof value === 'object' && value !== null ? value : {}) as Record<string, unknown>,
  );
</script>

{#if subSchema}
  <Card>
    {#if fieldSchema.title}
      <CardHeader>
        <CardTitle>{fieldSchema.title}</CardTitle>
      </CardHeader>
    {/if}
    <CardContent>
      <Form
        schema={subSchema}
        values={objectValue}
        onSubmit={(childValues) => onChange(childValues)}
        onChange={(childValues) => onChange(childValues)}
        nested
      />
    </CardContent>
  </Card>
{:else}
  <div>ObjectField: missing subSchema for "{name}"</div>
{/if}

