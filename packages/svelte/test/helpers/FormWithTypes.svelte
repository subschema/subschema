<script lang="ts">
  import Form from '../../src/components/Form.svelte';
  import type { FormSchema } from '../../src/types.js';

  interface Props {
    schema: FormSchema;
    types?: Record<string, unknown>;
    values?: Record<string, unknown>;
    onSubmit?: (values: Record<string, unknown>) => void;
  }

  let { schema, types, values, onSubmit }: Props = $props();
</script>

<Form {schema} {types} {values} {onSubmit} />

