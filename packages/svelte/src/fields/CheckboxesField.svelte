<script lang="ts">
  import type { FieldComponentProps } from '../types.js';
  import { cn } from '../ui/utils.js';

  let { name, value, onChange, onBlur, options, disabled }: FieldComponentProps = $props();

  const selected = $derived(Array.isArray(value) ? value : []);

  function handleChange(optionValue: string, checked: boolean) {
    if (checked) {
      onChange([...selected, optionValue]);
    } else {
      onChange(selected.filter((v: unknown) => v !== optionValue));
    }
  }
</script>

<div class="space-y-2" role="group" aria-label={name}>
  {#each options ?? [] as opt}
    <div class="flex items-center space-x-2">
      <input
        type="checkbox"
        id={`${name}-${opt.value}`}
        checked={selected.includes(opt.value)}
        onchange={(e) => handleChange(opt.value, e.currentTarget.checked)}
        onblur={onBlur}
        {disabled}
        class={cn(
          'peer border-primary ring-offset-background focus-visible:ring-ring h-4 w-4 shrink-0 rounded-sm border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        )}
      />
      <label
        for={`${name}-${opt.value}`}
        class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {opt.label}
      </label>
    </div>
  {/each}
</div>

