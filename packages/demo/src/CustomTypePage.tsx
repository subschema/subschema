import { useState, useCallback } from 'react';
import { Form, Button, cn } from '@subschema/react';
import type { FieldComponentProps } from '@subschema/react';
import type { ExampleDef } from './examples';
import { StepPanel } from './ExamplePage';

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

export function CustomTypePage({ example }: { example: ExampleDef }) {
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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{example.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{example.description}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          The <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">Rating</code> field is a custom component passed via{' '}
          <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{'<Form types={{ Rating: RatingField }}>'}</code>
        </p>
      </div>

      {/* Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 items-start">
        {/* Step 1: TypeSpec */}
        <StepPanel step={1} title="TypeSpec" subtitle="Author your schema" color="blue">
          {example.typespec ? (
            <pre className="text-sm overflow-auto max-h-96 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded">
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
            <pre className="text-sm overflow-auto max-h-96 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded">{JSON.stringify(example.schema, null, 2)}</pre>
          </div>
        </StepPanel>

        <div className="hidden lg:flex items-center justify-center text-gray-400 text-2xl pt-12">→</div>
        <div className="lg:hidden flex justify-center text-gray-400 text-xl">↓</div>

        {/* Steps 3+4: Form + Values stacked */}
        <div className="space-y-4">
          <StepPanel step={3} title="Live Form" subtitle="Rendered from schema" color="violet">
            <div className="bg-white dark:bg-gray-950 rounded p-2">
              <Form schema={example.schema} types={{ Rating: RatingField }} onSubmit={handleSubmit} onChange={setValues}>
                <div className="pt-4">
                  <Button type="submit">Submit</Button>
                </div>
              </Form>
              {submitted && (
                <div className="mt-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="font-medium text-green-800 dark:text-green-200 mb-1 text-sm">✅ Form submitted!</p>
                  <pre className="text-xs overflow-auto text-green-700 dark:text-green-300">{JSON.stringify(submitted, null, 2)}</pre>
                </div>
              )}
            </div>
          </StepPanel>

          <div className="flex justify-center text-gray-400 text-xl">↓</div>

          <StepPanel step={4} title="Form Values" subtitle="Live state as you type" color="emerald">
            <pre className="text-sm overflow-auto max-h-96 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded">{JSON.stringify(values, null, 2)}</pre>
          </StepPanel>
        </div>
      </div>
    </div>
  );
}

