<script lang="ts">
  import type { FieldSchema, FieldsetConfig } from '../types.js';
  import { cn } from '../ui/utils.js';
  import Field from './Field.svelte';

  interface Props {
    config: FieldsetConfig;
    schema: Record<string, FieldSchema>;
  }

  let { config, schema }: Props = $props();
</script>

<fieldset class={cn('space-y-4 rounded-lg border p-4')}>
  {#if config.legend}
    <legend class="px-2 text-lg font-semibold">{config.legend}</legend>
  {/if}
  {#each config.fields as fieldName}
    {#if schema[fieldName]}
      <Field name={fieldName} fieldSchema={schema[fieldName]} />
    {/if}
  {/each}
</fieldset>

