import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Form } from '../src/components/Form.js';
import type { FormSchema } from '../src/types.js';

describe('Field resolution errors with "did you mean?" suggestions', () => {
  it('throws helpful error for unknown field type', () => {
    const schema: FormSchema = {
      schema: { field1: { type: 'Textt' } },
    };

    // Suppress React error boundary noise
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Form schema={schema} />)).toThrow(/Field type "Textt" not found/);
    expect(() => render(<Form schema={schema} />)).toThrow(/Did you mean: "Text"\?/);

    spy.mockRestore();
  });

  it('lists available types in error message', () => {
    const schema: FormSchema = {
      schema: { field1: { type: 'Nonexistent' } },
    };

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Form schema={schema} />)).toThrow(/Available: .*Text.*Select.*Checkbox/);

    spy.mockRestore();
  });
});

