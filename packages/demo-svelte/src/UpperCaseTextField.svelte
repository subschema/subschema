<script lang="ts">
  import type { FieldComponentProps } from '@subschema/svelte';

  let { name, value, onChange, onBlur, placeholder, error }: FieldComponentProps = $props();
</script>

<div>
  <input
    {name}
    type="text"
    value={typeof value === 'string' ? value : ''}
    oninput={(e) => onChange((e.target as HTMLInputElement).value.toUpperCase())}
    onblur={onBlur}
    {placeholder}
    class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
  />
  {#if error}
    <p class="mt-1 text-sm text-red-500">{error}</p>
  {/if}
  <p class="mt-1 text-xs text-gray-400">This field auto-uppercases (custom preset type)</p>
</div>

