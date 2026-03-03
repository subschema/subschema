<script lang="ts">
  import type { FieldComponentProps } from '../types.js';
  import { cn } from '../ui/utils.js';

  let { name, value, onChange, onBlur, options, placeholder, disabled }: FieldComponentProps = $props();
</script>

<select
  id={name}
  {name}
  {disabled}
  class={cn(
    'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  )}
  onchange={(e) => onChange(e.currentTarget.value)}
  onblur={onBlur}
>
  <option value="" disabled selected={!value}>{placeholder ?? 'Select...'}</option>
  {#each options ?? [] as opt}
    <option value={opt.value} selected={String(value ?? '') === opt.value}>{opt.label}</option>
  {/each}
</select>

