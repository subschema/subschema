<script lang="ts">
  import { Form, Button, cn } from '@subschema/svelte';
  import type { FormSchema } from '@subschema/svelte';
  import type { ExampleDef } from './examples';
  import StepPanel from './StepPanel.svelte';

  interface Props {
    example: ExampleDef;
  }

  let { example }: Props = $props();

  let schemaText = $state(JSON.stringify(example.schema, null, 2));
  let parsedSchema = $state<FormSchema>(example.schema);
  let parseError = $state<string | null>(null);
  let submitted = $state<Record<string, unknown> | null>(null);
  let values = $state<Record<string, unknown>>({});
  let formKey = $state(0);

  function handleSchemaChange(text: string) {
    schemaText = text;
    try {
      const parsed = JSON.parse(text) as FormSchema;
      if (parsed && typeof parsed === 'object' && parsed.schema) {
        parsedSchema = parsed;
        parseError = null;
        formKey += 1;
      } else {
        parseError = 'Schema must have a "schema" property';
      }
    } catch (e) {
      parseError = (e as Error).message;
    }
  }

  function handleSubmit(vals: Record<string, unknown>) {
    submitted = vals;
    setTimeout(() => (submitted = null), 5000);
  }

  function handleChange(vals: Record<string, unknown>) {
    values = vals;
  }
</script>

<div class="space-y-8">
  <div>
    <h2 class="text-2xl font-bold">{example.title}</h2>
    <p class="mt-1 text-gray-600 dark:text-gray-400">{example.description}</p>
  </div>

  <!-- Hero: Editor + Live Form side by side -->
  <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_auto_1fr]">
    <!-- Edit Schema -->
    <StepPanel step={1} title="Edit Schema" subtitle="Modify JSON directly" color="blue">
      {#snippet children()}
        <textarea
          value={schemaText}
          oninput={(e) => handleSchemaChange((e.target as HTMLTextAreaElement).value)}
          class={cn(
            'h-80 w-full resize-none rounded-lg border p-4 font-mono text-sm',
            'bg-gray-50 dark:bg-gray-900',
            parseError
              ? 'border-red-400 dark:border-red-600'
              : 'border-gray-200 dark:border-gray-800',
          )}
          spellcheck="false"
        ></textarea>
        {#if parseError}
          <p class="mt-1 text-sm text-red-500">Parse error: {parseError}</p>
        {/if}
      {/snippet}
    </StepPanel>

    <div class="hidden items-center justify-center pt-12 text-2xl text-gray-400 lg:flex">→</div>
    <div class="flex justify-center text-xl text-gray-400 lg:hidden">↓</div>

    <!-- Live Form -->
    <div class="min-h-80 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
      {#if !parseError}
        {#key formKey}
          <Form schema={parsedSchema} onSubmit={handleSubmit} onChange={handleChange}>
            {#snippet children()}
              <div class="pt-4">
                <Button type="submit">Submit</Button>
              </div>
            {/snippet}
          </Form>
        {/key}
      {/if}
      {#if submitted}
        <div class="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/30">
          <p class="mb-1 text-sm font-medium text-green-800 dark:text-green-200">✅ Form submitted!</p>
          <pre class="overflow-auto text-xs text-green-700 dark:text-green-300">{JSON.stringify(submitted, null, 2)}</pre>
        </div>
      {/if}
    </div>
  </div>

  <!-- Under the Hood -->
  <div>
    <div class="mb-4 flex items-center gap-3">
      <div class="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
      <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Under the Hood</span>
      <div class="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
    </div>

    <StepPanel step={2} title="Form Values" subtitle="Live state as you type" color="emerald">
      {#snippet children()}
        <pre class="max-h-80 overflow-auto rounded bg-gray-50 p-4 text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200">{JSON.stringify(values, null, 2)}</pre>
      {/snippet}
    </StepPanel>
  </div>
</div>

