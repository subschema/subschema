<script lang="ts">
  import { cn } from './utils.js';
  import type { Snippet } from 'svelte';

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className, children }: Props = $props();
</script>

<div class={cn('flex flex-col space-y-1.5 p-6', className)}>
  {#if children}
    {@render children()}
  {/if}
</div>

