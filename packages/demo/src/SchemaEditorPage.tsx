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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{example.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{example.description}</p>
      </div>

      {/* Pipeline: 3-step flow */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-start">
        {/* Step 1: Edit Schema */}
        <StepPanel step={1} title="Edit Schema" subtitle="Modify JSON directly" color="blue">
          <textarea
            value={schemaText}
            onChange={(e) => handleSchemaChange(e.target.value)}
            className={cn(
              'w-full h-80 font-mono text-sm p-4 rounded-lg border resize-none',
              'bg-gray-50 dark:bg-gray-900',
              parseError
                ? 'border-red-400 dark:border-red-600'
                : 'border-gray-200 dark:border-gray-800'
            )}
            spellCheck={false}
          />
          {parseError && (
            <p className="text-sm text-red-500 mt-1">Parse error: {parseError}</p>
          )}
        </StepPanel>

        {/* Arrow 1→2 */}
        <div className="hidden lg:flex items-center justify-center text-gray-400 text-2xl pt-12">→</div>
        <div className="lg:hidden flex justify-center text-gray-400 text-xl">↓</div>

        {/* Steps 2+3: Form + Values stacked */}
        <div className="space-y-4">
          <StepPanel step={2} title="Live Form" subtitle="Rendered from schema" color="violet">
            <div className="bg-white dark:bg-gray-950 rounded p-2 min-h-80">
              {!parseError && (
                <Form key={formKey} schema={parsedSchema} onSubmit={handleSubmit} onChange={setValues}>
                  <div className="pt-4">
                    <Button type="submit">Submit</Button>
                  </div>
                </Form>
              )}
              {submitted && (
                <div className="mt-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="font-medium text-green-800 dark:text-green-200 mb-1 text-sm">✅ Form submitted!</p>
                  <pre className="text-xs overflow-auto text-green-700 dark:text-green-300">{JSON.stringify(submitted, null, 2)}</pre>
                </div>
              )}
            </div>
          </StepPanel>

          <div className="flex justify-center text-gray-400 text-xl">↓</div>

          <StepPanel step={3} title="Form Values" subtitle="Live state as you type" color="emerald">
            <pre className="text-sm overflow-auto max-h-64 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded">
              {JSON.stringify(values, null, 2)}
            </pre>
          </StepPanel>
        </div>
      </div>
    </div>
  );
}

