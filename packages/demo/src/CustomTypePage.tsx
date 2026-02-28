import { useState, useCallback } from 'react';
import { Form, Button, cn } from '@subschema/react';
import type { FieldComponentProps } from '@subschema/react';
import type { ExampleDef } from './examples';
import { FormValuesWrapper } from './FormValuesWrapper';

/** Custom star rating field component implementing FieldComponentProps */
function RatingField({ value, onChange, title, error }: FieldComponentProps) {
  const rating = typeof value === 'number' ? value : 0;

  return (
    <div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={cn(
              'text-2xl transition-colors',
              star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
            )}
          >
            ★
          </button>
        ))}
      </div>
      {rating > 0 && <span className="text-sm text-gray-500 ml-1">{rating}/5</span>}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

type Tab = 'schema' | 'values';

export function CustomTypePage({ example }: { example: ExampleDef }) {
  const [tab, setTab] = useState<Tab>('schema');
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [copied, setCopied] = useState(false);

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{example.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{example.description}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          The <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">Rating</code> field is a custom component passed via{' '}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{'<Form types={{ Rating: RatingField }}>'}</code>
        </p>
      </div>

      {submitted && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="font-medium text-green-800 dark:text-green-200 mb-2">✅ Form submitted!</p>
          <pre className="text-xs overflow-auto text-green-700 dark:text-green-300">{JSON.stringify(submitted, null, 2)}</pre>
        </div>
      )}

      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-900">
        <FormValuesWrapper onValuesChange={setValues}>
          <Form schema={example.schema} types={{ Rating: RatingField }} onSubmit={handleSubmit}>
            <div className="pt-4">
              <Button type="submit">Submit</Button>
            </div>
          </Form>
        </FormValuesWrapper>
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
            <div className="relative">
              <button onClick={copySchema} className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <pre className="text-sm overflow-auto max-h-96 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded">{JSON.stringify(example.schema, null, 2)}</pre>
            </div>
          )}
          {tab === 'values' && (
            <pre className="text-sm overflow-auto max-h-96 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded">{JSON.stringify(values, null, 2)}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

