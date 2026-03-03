<script lang="ts">
  import type { FieldComponentProps } from '../types.js';
  import Button from '../ui/Button.svelte';
  import { getFormStateContext } from '../context.js';
  import { createFieldArray } from '../field-array.svelte.js';

  let { name, fieldSchema }: FieldComponentProps = $props();

  const formState = getFormStateContext();
  const { fields, push, remove } = createFieldArray(name, formState);
</script>

<div class="space-y-2">
  {#each fields as item, index}
    <div class="flex items-center gap-2">
      <input
        class="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
        value={String(item ?? '')}
        oninput={(e) => {
          const newFields = [...fields];
          newFields[index] = e.currentTarget.value;
          formState.setValue(name, newFields);
        }}
      />
      <Button type="button" variant="destructive" size="sm" onclick={() => remove(index)}>
        {#snippet children()}
          Remove
        {/snippet}
      </Button>
    </div>
  {/each}
  <Button type="button" variant="outline" size="sm" onclick={() => push('')}>
    {#snippet children()}
      Add Item
    {/snippet}
  </Button>
</div>

