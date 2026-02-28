import { useState, useCallback } from 'react';
import { Form, Button, cn } from '@subschema/react';
import type { FormSchema } from '@subschema/react';
import type { ExampleDef } from './examples';
import { FormValuesWrapper } from './FormValuesWrapper';

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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{example.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{example.description}</p>
      </div>

      {submitted && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="font-medium text-green-800 dark:text-green-200 mb-2">✅ Form submitted!</p>
          <pre className="text-xs overflow-auto text-green-700 dark:text-green-300">{JSON.stringify(submitted, null, 2)}</pre>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">JSON Schema</h3>
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
            <p className="text-sm text-red-500">Parse error: {parseError}</p>
          )}
        </div>

        {/* Rendered form */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Live Preview</h3>
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-900 min-h-80">
            {!parseError && (
              <FormValuesWrapper onValuesChange={setValues}>
                <Form key={formKey} schema={parsedSchema} onSubmit={handleSubmit}>
                  <div className="pt-4">
                    <Button type="submit">Submit</Button>
                  </div>
                </Form>
              </FormValuesWrapper>
            )}
          </div>
        </div>
      </div>

      {/* Live values */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <div className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 -mb-px">
            Form Values
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-950">
          <pre className="text-sm overflow-auto max-h-64 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 p-4 rounded">
            {JSON.stringify(values, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

