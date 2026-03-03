<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '../ui/utils.js';
  import Label from '../ui/Label.svelte';

  interface Props {
    name: string;
    label?: string;
    description?: string;
    error?: string;
    children: Snippet;
  }

  let { name, label, description, error, children }: Props = $props();
</script>

<div class={cn('space-y-2')} data-field={name}>
  {#if label}
    <Label for={name} class={cn(error && 'text-destructive')}>
      {#snippet children()}
        {label}
      {/snippet}
    </Label>
  {/if}
  {@render children()}
  {#if description}
    <p class="text-muted-foreground text-sm">{description}</p>
  {/if}
  {#if error}
    <p class="text-destructive text-sm font-medium" role="alert">{error}</p>
  {/if}
</div>

