import { useState, useCallback } from 'react';
import { Form, Button, cn } from '@subschema/react';
import type { FormSchema } from '@subschema/react';
import type { ExampleDef } from './examples';
import { StepPanel } from './ExamplePage';

export function SchemaEditorPage({ example }: { example: ExampleDef }) {
  const [schemaText, setSchemaText] = useState(() => JSON.stringify(example.schema, null, 2));
  const [parsedSchema, setParsedSchema] = useState<FormSchema>(example.schema);
  const [parseError, setParseError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [formKey, setFormKey] = useState(0);

  const handleSchemaChange = useCallback((text: string) => {
    setSchemaText(text);
    try {
      const parsed = JSON.parse(text) as FormSchema;
      if (parsed && typeof parsed === 'object' && parsed.schema) {
        setParsedSchema(parsed);
        setParseError(null);
        setFormKey((k) => k + 1);
      } else {
        setParseError('Schema must have a "schema" property');
      }
    } catch (e) {
      setParseError((e as Error).message);
    }
  }, []);

  const handleSubmit = useCallback((vals: Record<string, unknown>) => {
    setSubmitted(vals);
    setTimeout(() => setSubmitted(null), 5000);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">{example.title}</h2>
        <p className="mt-1 text-gray-600 dark:text-gray-400">{example.description}</p>
      </div>

      {/* Hero: Editor + Live Form side by side */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1fr_auto_1fr]">
        {/* Edit Schema */}
        <StepPanel step={1} title="Edit Schema" subtitle="Modify JSON directly" color="blue">
          <textarea
            value={schemaText}
            onChange={(e) => handleSchemaChange(e.target.value)}
            className={cn(
              'h-80 w-full resize-none rounded-lg border p-4 font-mono text-sm',
              'bg-gray-50 dark:bg-gray-900',
              parseError
                ? 'border-red-400 dark:border-red-600'
                : 'border-gray-200 dark:border-gray-800',
            )}
            spellCheck={false}
          />
          {parseError && <p className="mt-1 text-sm text-red-500">Parse error: {parseError}</p>}
        </StepPanel>

        <div className="hidden items-center justify-center pt-12 text-2xl text-gray-400 lg:flex">
          →
        </div>
        <div className="flex justify-center text-xl text-gray-400 lg:hidden">↓</div>

        {/* Live Form */}
        <div className="min-h-80 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-950">
          {!parseError && (
            <Form key={formKey} schema={parsedSchema} onSubmit={handleSubmit} onChange={setValues}>
              <div className="pt-4">
                <Button type="submit">Submit</Button>
              </div>
            </Form>
          )}
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

        <StepPanel step={2} title="Form Values" subtitle="Live state as you type" color="emerald">
          <pre className="max-h-80 overflow-auto rounded bg-gray-50 p-4 text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            {JSON.stringify(values, null, 2)}
          </pre>
        </StepPanel>
      </div>
    </div>
  );
}
