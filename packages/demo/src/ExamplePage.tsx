import { useState, useCallback } from 'react';
import { Form, Button, cn } from '@subschema/react';
import type { ExampleDef } from './examples';

type Tab = 'schema' | 'typespec' | 'values';

export function ExamplePage({ example }: { example: ExampleDef }) {
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

  const tabs: { id: Tab; label: string; show: boolean }[] = [
    { id: 'schema', label: 'JSON Schema', show: true },
    { id: 'typespec', label: 'TypeSpec', show: !!example.typespec },
    { id: 'values', label: 'Form Values', show: true },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{example.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{example.description}</p>
      </div>

      {/* Toast for submitted values */}
      {submitted && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="font-medium text-green-800 dark:text-green-200 mb-2">✅ Form submitted!</p>
          <pre className="text-xs overflow-auto text-green-700 dark:text-green-300">{JSON.stringify(submitted, null, 2)}</pre>
        </div>
      )}

      {/* Rendered Form */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-white dark:bg-gray-900">
          <Form schema={example.schema} onSubmit={handleSubmit} onChange={setValues}>
            <div className="pt-4">
              <Button type="submit">Submit</Button>
            </div>
          </Form>
      </div>

      {/* Tabs */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          {tabs.filter(t => t.show).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'px-4 py-2 text-sm font-medium transition border-b-2 -mb-px',
                tab === t.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-4 bg-white dark:bg-gray-950">
          {tab === 'schema' && (
            <div className="relative">
              <button
                onClick={copySchema}
                className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
              <pre className="text-sm overflow-auto max-h-96 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded">
                {JSON.stringify(example.schema, null, 2)}
              </pre>
            </div>
          )}
          {tab === 'typespec' && example.typespec && (
            <pre className="text-sm overflow-auto max-h-96 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded">
              {example.typespec}
            </pre>
          )}
          {tab === 'values' && (
            <pre className="text-sm overflow-auto max-h-96 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded">
              {JSON.stringify(values, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

