import React, { useMemo } from 'react';
import { Text } from 'react-native';
import { createContainer } from '@speajus/diblob';
import type { Container } from '@speajus/diblob';
import type { FieldComponentProps, FormSchema } from '../types.js';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card.js';
import { FormProvider } from '../components/FormProvider.js';
import { Form } from '../components/Form.js';
import { useFormContainer } from '../hooks/useFormContainer.js';

/**
 * ObjectField renders a nested form inside a Card.
 * Creates a child diblob container from the parent,
 * inheriting all types/templates/validators.
 */
export function ObjectField({ name, value, onChange, fieldSchema }: FieldComponentProps) {
  const { containerRef } = useFormContainer();

  const childContainer = useMemo(() => {
    return createContainer(containerRef as Container);
  }, [containerRef]);

  const subSchema = fieldSchema.subSchema as FormSchema | undefined;
  if (!subSchema) {
    return <Text>ObjectField: missing subSchema for &quot;{name}&quot;</Text>;
  }

  const objectValue = (typeof value === 'object' && value !== null ? value : {}) as Record<
    string,
    unknown
  >;

  const handleSubmit = (childValues: Record<string, unknown>) => {
    onChange(childValues);
  };

  const handleChildChange = (childValues: Record<string, unknown>) => {
    onChange(childValues);
  };

  return (
    <Card>
      {fieldSchema.title && (
        <CardHeader>
          <CardTitle>{fieldSchema.title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <FormProvider container={childContainer}>
          <Form
            schema={subSchema}
            values={objectValue}
            onSubmit={handleSubmit}
            onChange={handleChildChange}
          />
        </FormProvider>
      </CardContent>
    </Card>
  );
}

