import { useState, useCallback, type ReactNode } from 'react';
import { Form, Button, cn } from '@subschema/react';
import type { ExampleDef } from './examples';

const stepColors: Record<string, string> = {
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  emerald: 'bg-emerald-500',
};

export function StepPanel({
  step,
  title,
  subtitle,
  color,
  children,
}: {
  step: number;
  title: string;
  subtitle: string;
  color: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
        <span
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white',
            stepColors[color],
          )}
        >
          {step}
        </span>
        <div>
          <span className="text-sm font-medium">{title}</span>
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{subtitle}</span>
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
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold">{example.title}</h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400">{example.description}</p>
      </div>

      {/* Hero: Live Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
        <Form schema={example.schema} onSubmit={handleSubmit} onChange={setValues}>
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
