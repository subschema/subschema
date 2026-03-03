<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { Container } from '@speajus/diblob';
  import { resolveRegistries } from '@subschema/core';
  import { setFormContainerContext } from '../context.js';
  import type { FormContextValue } from '../types.js';

  interface Props {
    /** A pre-configured diblob container */
    container: Container;
    children: Snippet;
  }

  let { container, children }: Props = $props();

  const registries = resolveRegistries(container);
  const contextValue: FormContextValue = {
    ...registries,
    containerRef: container,
  } as FormContextValue;

  setFormContainerContext(contextValue);
</script>

{@render children()}

