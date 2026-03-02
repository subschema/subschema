import { useState, useCallback, useMemo } from 'react';
import {
  Form,
  FormProvider,
  Button,
  cn,
  createDefaultContainer,
  createFormContainer,
} from '@subschema/react';
import type { FieldComponentProps } from '@subschema/react';
import type { ExampleDef } from './examples';

/** A custom "UpperCase" text field that converts input to uppercase — registered via preset */
function UpperCaseTextField({
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
}: FieldComponentProps) {
  return (
    <div>
      <input
        name={name}
        type="text"
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      <p className="mt-1 text-xs text-gray-400">This field auto-uppercases (custom preset type)</p>
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
        <p className="mt-1 text-gray-600 dark:text-gray-400">{example.description}</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          This example uses{' '}
          <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
            {'<FormProvider container={preset}>'}
          </code>{' '}
          to override the <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">Text</code>{' '}
          field type with an auto-uppercase variant.
        </p>
      </div>

      {/* Hero: Live Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <FormProvider container={presetContainer}>
          <Form schema={example.schema} onSubmit={handleSubmit} onChange={setValues}>
            <div className="pt-4">
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </FormProvider>
        {submitted && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/30">
            <p className="mb-1 text-sm font-medium text-green-800 dark:text-green-200">
              ✅ Form submitted!
            </p>
            <pre className="overflow-auto text-xs text-green-700 dark:text-green-300">
              {JSON.stringify(submitted, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Under the Hood */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Under the Hood
          </span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        </div>

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {/* Step 1: TypeSpec */}
          <StepPanel step={1} title="TypeSpec" subtitle=".tsp source" color="blue">
            {example.typespec ? (
              <pre className="max-h-80 overflow-auto rounded bg-gray-50 p-4 text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                {example.typespec}
              </pre>
            ) : (
              <p className="py-4 text-sm text-gray-400 italic dark:text-gray-500">
                No TypeSpec source
              </p>
            )}
          </StepPanel>

          <div className="hidden items-center justify-center pt-12 text-2xl text-gray-400 lg:flex">
            →
          </div>
          <div className="flex justify-center text-xl text-gray-400 lg:hidden">↓</div>

          {/* Step 2: JSON Schema */}
          <StepPanel step={2} title="JSON Schema" subtitle="Compiled output" color="indigo">
            <div className="relative">
              <button
                onClick={copySchema}
                className="absolute top-2 right-2 rounded bg-gray-100 px-2 py-1 text-xs transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <pre className="max-h-80 overflow-auto rounded bg-gray-50 p-4 text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                {JSON.stringify(example.schema, null, 2)}
              </pre>
            </div>
          </StepPanel>

          <div className="hidden items-center justify-center pt-12 text-2xl text-gray-400 lg:flex">
            →
          </div>
          <div className="flex justify-center text-xl text-gray-400 lg:hidden">↓</div>

          {/* Step 3: Form Values */}
          <StepPanel step={3} title="Form Values" subtitle="Live state as you type" color="emerald">
            <pre className="max-h-80 overflow-auto rounded bg-gray-50 p-4 text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200">
              {JSON.stringify(values, null, 2)}
            </pre>
          </StepPanel>
        </div>
      </div>
    </div>
  );
}
