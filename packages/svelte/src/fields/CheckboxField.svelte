<script lang="ts">
  import type { FieldComponentProps } from '../types.js';
  import { cn } from '../ui/utils.js';

  let { name, value, onChange, onBlur, disabled }: FieldComponentProps = $props();
</script>

<input
  type="checkbox"
  id={name}
  {name}
  checked={Boolean(value)}
  onchange={(e) => onChange(e.currentTarget.checked)}
  onblur={onBlur}
  {disabled}
  class={cn(
    'peer border-primary ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-4 w-4 shrink-0 rounded-sm border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  )}
/>

