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

type Tab = 'schema' | 'values';

export function PresetPage({ example }: { example: ExampleDef }) {
  const [tab, setTab] = useState<Tab>('schema');
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});

  // Create a preset container that overrides Text field with UpperCaseTextField
  const presetContainer = useMemo(() => {
    const base = createDefaultContainer();
    return createFormContainer(base, { types: { Text: UpperCaseTextField } });
  }, []);

  const handleSubmit = useCallback((vals: Record<string, unknown>) => {
    setSubmitted(vals);
    setTimeout(() => setSubmitted(null), 5000);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{example.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{example.description}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          This example uses <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{'<FormProvider container={preset}>'}</code> to
          override the <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">Text</code> field type with an auto-uppercase variant.
        </p>
      </div>

      {submitted && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="font-medium text-green-800 dark:text-green-200 mb-2">✅ Form submitted!</p>
          <pre className="text-xs overflow-auto text-green-700 dark:text-green-300">{JSON.stringify(submitted, null, 2)}</pre>
        </div>
      )}

      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-900">
          <FormProvider container={presetContainer}>
            <Form schema={example.schema} onSubmit={handleSubmit} onChange={setValues}>
              <div className="pt-4">
                <Button type="submit">Submit</Button>
              </div>
            </Form>
          </FormProvider>
      </div>

      {/* Tabs */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          {[{ id: 'schema' as Tab, label: 'JSON Schema' }, { id: 'values' as Tab, label: 'Form Values' }].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn('px-4 py-2 text-sm font-medium transition border-b-2 -mb-px',
                tab === t.id ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              )}>{t.label}</button>
          ))}
        </div>
        <div className="p-4 bg-white dark:bg-gray-950">
          {tab === 'schema' && (
            <pre className="text-sm overflow-auto max-h-96 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded">{JSON.stringify(example.schema, null, 2)}</pre>
          )}
          {tab === 'values' && (
            <pre className="text-sm overflow-auto max-h-96 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded">{JSON.stringify(values, null, 2)}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

