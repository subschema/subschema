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
              star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600',
            )}
          >
            ★
          </button>
        ))}
      </div>
      {rating > 0 && <span className="ml-1 text-sm text-gray-500">{rating}/5</span>}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">{example.title}</h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400">{example.description}</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          The <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">Rating</code> field is a
          custom component passed via{' '}
          <code className="rounded bg-gray-100 px-1 dark:bg-gray-800">
            {'<Form types={{ Rating: RatingField }}>'}
          </code>
        </p>
      </div>

      {/* Hero: Live Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <Form
          schema={example.schema}
          types={{ Rating: RatingField }}
          onSubmit={handleSubmit}
          onChange={setValues}
        >
          <div className="pt-4">
            <Button type="submit">Submit</Button>
          </div>
        </Form>
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
