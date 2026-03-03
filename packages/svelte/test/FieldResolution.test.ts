import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import Form from '../src/components/Form.svelte';
import type { FormSchema } from '../src/types.js';

describe('Field resolution errors with "did you mean?" suggestions', () => {
  it('throws helpful error for unknown field type', () => {
    const schema: FormSchema = {
      schema: { field1: { type: 'Textt' } },
    };

    // Suppress error noise
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(Form, { props: { schema } })).toThrow(/Field type "Textt" not found/);
    expect(() => render(Form, { props: { schema } })).toThrow(/Did you mean: "Text"\?/);

    spy.mockRestore();
  });

  it('lists available types in error message', () => {
    const schema: FormSchema = {
      schema: { field1: { type: 'Nonexistent' } },
    };

    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(Form, { props: { schema } })).toThrow(
      /Available: .*Text.*Select.*Checkbox/,
    );

    spy.mockRestore();
  });
});
