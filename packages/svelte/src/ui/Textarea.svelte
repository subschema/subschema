<script lang="ts">
  import { cn } from './utils.js';
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  interface Props extends HTMLTextareaAttributes {
    class?: string;
  }

  let { class: className, ...rest }: Props = $props();
</script>

<textarea
  class={cn(
    'border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
    className,
  )}
  {...rest}
></textarea>

