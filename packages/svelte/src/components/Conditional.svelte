<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ConditionalConfig } from '@subschema/core';
  import { evaluateCondition } from '@subschema/core';
  import { getFormStateContext } from '../context.js';

  interface Props {
    /** Field name to listen to */
    listen: string;
    /** Comparison operator */
    operator: ConditionalConfig['operator'];
    /** Value to compare against */
    value?: unknown;
    children: Snippet;
  }

  let { listen, operator, value, children }: Props = $props();

  const formState = getFormStateContext();

  const isVisible = $derived(
    evaluateCondition({ listen, operator, value }, formState.values),
  );
</script>

{#if isVisible}
  {@render children()}
{/if}

