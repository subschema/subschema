<script lang="ts">
  import { Form, Button } from '@subschema/svelte';
  import type { ExampleDef } from './examples';
  import StepPanel from './StepPanel.svelte';

  interface Props {
    example: ExampleDef;
  }

  let { example }: Props = $props();

  let submitted = $state<Record<string, unknown> | null>(null);
  let values = $state<Record<string, unknown>>({});
  let copied = $state(false);

  function handleSubmit(vals: Record<string, unknown>) {
    submitted = vals;
    setTimeout(() => (submitted = null), 5000);
  }

  function copySchema() {
    navigator.clipboard.writeText(JSON.stringify(example.schema, null, 2));
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }

  function handleChange(vals: Record<string, unknown>) {
    values = vals;
  }
</script>

<div class="space-y-8">
  <!-- Title -->
  <div>
    <h2 class="text-2xl font-bold">{example.title}</h2>
    <p class="mt-1 text-gray-600 dark:text-gray-400">{example.description}</p>
  </div>

  <!-- Hero: Live Form -->
  <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
    <Form schema={example.schema} onSubmit={handleSubmit} onChange={handleChange}>
      {#snippet children()}
        <div class="pt-4">
          <Button type="submit">Submit</Button>
        </div>
      {/snippet}
    </Form>
    {#if submitted}
      <div class="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/30">
        <p class="mb-1 text-sm font-medium text-green-800 dark:text-green-200">
          ✅ Form submitted!
        </p>
        <pre class="overflow-auto text-xs text-green-700 dark:text-green-300">{JSON.stringify(submitted, null, 2)}</pre>
      </div>
    {/if}
  </div>

  <!-- Under the Hood -->
  <div>
    <div class="mb-4 flex items-center gap-3">
      <div class="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
      <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Under the Hood</span>
      <div class="h-px flex-1 bg-gray-200 dark:bg-gray-800"></div>
    </div>

    <div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
      <!-- Step 1: TypeSpec -->
      <StepPanel step={1} title="TypeSpec" subtitle=".tsp source" color="blue">
        {#snippet children()}
          {#if example.typespec}
            <pre class="max-h-80 overflow-auto rounded bg-gray-50 p-4 text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200">{example.typespec}</pre>
          {:else}
            <p class="py-4 text-sm text-gray-400 italic dark:text-gray-500">No TypeSpec source</p>
          {/if}
        {/snippet}
      </StepPanel>

      <div class="hidden items-center justify-center pt-12 text-2xl text-gray-400 lg:flex">→</div>
      <div class="flex justify-center text-xl text-gray-400 lg:hidden">↓</div>

      <!-- Step 2: JSON Schema -->
      <StepPanel step={2} title="JSON Schema" subtitle="Compiled output" color="indigo">
        {#snippet children()}
          <div class="relative">
            <button
              onclick={copySchema}
              class="absolute top-2 right-2 rounded bg-gray-100 px-2 py-1 text-xs transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
            <pre class="max-h-80 overflow-auto rounded bg-gray-50 p-4 text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200">{JSON.stringify(example.schema, null, 2)}</pre>
          </div>
        {/snippet}
      </StepPanel>

      <div class="hidden items-center justify-center pt-12 text-2xl text-gray-400 lg:flex">→</div>
      <div class="flex justify-center text-xl text-gray-400 lg:hidden">↓</div>

      <!-- Step 3: Form Values -->
      <StepPanel step={3} title="Form Values" subtitle="Live state as you type" color="emerald">
        {#snippet children()}
          <pre class="max-h-80 overflow-auto rounded bg-gray-50 p-4 text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200">{JSON.stringify(values, null, 2)}</pre>
        {/snippet}
      </StepPanel>
    </div>
  </div>
</div>

