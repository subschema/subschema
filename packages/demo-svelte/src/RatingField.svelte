<script lang="ts">
  import { cn } from '@subschema/svelte';
  import type { FieldComponentProps } from '@subschema/svelte';

  let { value, onChange, error }: FieldComponentProps = $props();

  let rating = $derived(typeof value === 'number' ? value : 0);
  const stars = [1, 2, 3, 4, 5];
</script>

<div>
  <div class="flex gap-1">
    {#each stars as star}
      <button
        type="button"
        onclick={() => onChange(star)}
        class={cn(
          'text-2xl transition-colors',
          star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600',
        )}
      >
        ★
      </button>
    {/each}
  </div>
  {#if rating > 0}
    <span class="ml-1 text-sm text-gray-500">{rating}/5</span>
  {/if}
  {#if error}
    <p class="mt-1 text-sm text-red-500">{error}</p>
  {/if}
</div>

