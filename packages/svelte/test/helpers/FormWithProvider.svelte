<script lang="ts">
  import type { Container } from '@speajus/diblob';
  import Form from '../../src/components/Form.svelte';
  import FormProvider from '../../src/components/FormProvider.svelte';
  import type { FormSchema } from '../../src/types.js';

  interface Props {
    schema: FormSchema;
    container: Container;
    types?: Record<string, unknown>;
    values?: Record<string, unknown>;
    onSubmit?: (values: Record<string, unknown>) => void;
  }

  let { schema, container, types, values, onSubmit }: Props = $props();
</script>

<FormProvider {container}>
  <Form {schema} {types} {values} {onSubmit} />
</FormProvider>

