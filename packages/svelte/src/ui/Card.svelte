<script lang="ts">
  import { cn } from './utils.js';
  import type { Snippet } from 'svelte';

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className, children }: Props = $props();
</script>

<div class={cn('bg-card text-card-foreground rounded-lg border shadow-sm', className)}>
  {#if children}
    {@render children()}
  {/if}
</div>

