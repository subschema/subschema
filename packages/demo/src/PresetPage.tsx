import { useState, useCallback, useMemo } from 'react';
import { Form, FormProvider, Button, cn, createDefaultContainer, createFormContainer } from '@subschema/react';
import type { FieldComponentProps } from '@subschema/react';
import type { ExampleDef } from './examples';

/** A custom "UpperCase" text field that converts input to uppercase — registered via preset */
function UpperCaseTextField({ name, value, onChange, onBlur, placeholder, error }: FieldComponentProps) {
  return (
    <div>
      <input
        name={name}
        type="text"
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      <p className="text-xs text-gray-400 mt-1">This field auto-uppercases (custom preset type)</p>
    </div>
  );
}

import { StepPanel } from './ExamplePage';

export function PresetPage({ example }: { example: ExampleDef }) {
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [copied, setCopied] = useState(false);

  // Create a preset container that overrides Text field with UpperCaseTextField
  const presetContainer = useMemo(() => {
    const base = createDefaultContainer();
    return createFormContainer(base, { types: { Text: UpperCaseTextField } });
  }, []);

  const handleSubmit = useCallback((vals: Record<string, unknown>) => {
    setSubmitted(vals);
    setTimeout(() => setSubmitted(null), 5000);
  }, []);

  const copySchema = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(example.schema, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [example.schema]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">{example.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{example.description}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          This example uses <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{'<FormProvider container={preset}>'}</code> to
          override the <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">Text</code> field type with an auto-uppercase variant.
        </p>
      </div>

      {/* Hero: Live Form */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 shadow-sm p-6">
        <FormProvider container={presetContainer}>
          <Form schema={example.schema} onSubmit={handleSubmit} onChange={setValues}>
            <div className="pt-4">
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </FormProvider>
        {submitted && (
          <div className="mt-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="font-medium text-green-800 dark:text-green-200 mb-1 text-sm">✅ Form submitted!</p>
            <pre className="text-xs overflow-auto text-green-700 dark:text-green-300">{JSON.stringify(submitted, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Under the Hood */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Under the Hood</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 items-start">
          {/* Step 1: TypeSpec */}
          <StepPanel step={1} title="TypeSpec" subtitle=".tsp source" color="blue">
            {example.typespec ? (
              <pre className="text-sm overflow-auto max-h-80 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded">
                {example.typespec}
              </pre>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500 italic py-4">No TypeSpec source</p>
            )}
          </StepPanel>

          <div className="hidden lg:flex items-center justify-center text-gray-400 text-2xl pt-12">→</div>
          <div className="lg:hidden flex justify-center text-gray-400 text-xl">↓</div>

          {/* Step 2: JSON Schema */}
          <StepPanel step={2} title="JSON Schema" subtitle="Compiled output" color="indigo">
            <div className="relative">
              <button onClick={copySchema} className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <pre className="text-sm overflow-auto max-h-80 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded">{JSON.stringify(example.schema, null, 2)}</pre>
            </div>
          </StepPanel>

          <div className="hidden lg:flex items-center justify-center text-gray-400 text-2xl pt-12">→</div>
          <div className="lg:hidden flex justify-center text-gray-400 text-xl">↓</div>

          {/* Step 3: Form Values */}
          <StepPanel step={3} title="Form Values" subtitle="Live state as you type" color="emerald">
            <pre className="text-sm overflow-auto max-h-80 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded">{JSON.stringify(values, null, 2)}</pre>
          </StepPanel>
        </div>
      </div>
    </div>
  );
}

