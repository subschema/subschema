<script lang="ts">
  import type { FieldComponentProps } from '../types.js';
  import { cn } from '../ui/utils.js';

  let { name, value, onChange, onBlur, options, disabled }: FieldComponentProps = $props();
</script>

<div class="space-y-2" role="radiogroup" aria-label={name}>
  {#each options ?? [] as opt}
    <div class="flex items-center space-x-2">
      <input
        type="radio"
        id={`${name}-${opt.value}`}
        {name}
        value={opt.value}
        checked={String(value ?? '') === opt.value}
        onchange={() => onChange(opt.value)}
        onblur={onBlur}
        {disabled}
        class={cn(
          'border-primary text-primary ring-offset-background focus-visible:ring-ring aspect-square h-4 w-4 rounded-full border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
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

