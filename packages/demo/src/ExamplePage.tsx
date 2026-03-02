import { useState, useCallback, type ReactNode } from 'react';
import { Form, Button, cn } from '@subschema/react';
import type { ExampleDef } from './examples';

const stepColors: Record<string, string> = {
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  emerald: 'bg-emerald-500',
};

export function StepPanel({ step, title, subtitle, color, children }: {
  step: number; title: string; subtitle: string; color: string; children: ReactNode;
}) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <span className={cn('w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center', stepColors[color])}>
          {step}
        </span>
        <div>
          <span className="font-medium text-sm">{title}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{subtitle}</span>
        </div>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

export function ExamplePage({ example }: { example: ExampleDef }) {
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
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold">{example.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{example.description}</p>
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

        {/* Arrow 1→2 */}
        <div className="hidden lg:flex items-center justify-center text-gray-400 text-2xl pt-12">→</div>
        <div className="lg:hidden flex justify-center text-gray-400 text-xl">↓</div>

        {/* Step 2: JSON Schema */}
        <StepPanel step={2} title="JSON Schema" subtitle="Compiled output" color="indigo">
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
        </StepPanel>

        {/* Arrow 2→3 */}
        <div className="hidden lg:flex items-center justify-center text-gray-400 text-2xl pt-12">→</div>
        <div className="lg:hidden flex justify-center text-gray-400 text-xl">↓</div>

        {/* Steps 3+4: Form + Values stacked */}
        <div className="space-y-4">
          <StepPanel step={3} title="Live Form" subtitle="Rendered from schema" color="violet">
            <div className="bg-white dark:bg-gray-950 rounded p-2">
              <Form schema={example.schema} onSubmit={handleSubmit} onChange={setValues}>
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
            <pre className="text-sm overflow-auto max-h-96 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded">
              {JSON.stringify(values, null, 2)}
            </pre>
          </StepPanel>
        </div>
      </div>
    </div>
  );
}

