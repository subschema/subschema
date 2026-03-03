import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { tick } from 'svelte';
import Form from '../src/components/Form.svelte';
import type { FormSchema } from '../src/types.js';

const conditionalSchema: FormSchema = {
  schema: {
    subscribe: { type: 'Checkbox', title: 'Subscribe to newsletter' },
    email: {
      type: 'Text',
      title: 'Email',
      placeholder: 'Enter email',
      conditional: { listen: 'subscribe', operator: 'truthy' },
    },
  },
};

describe('Conditional field show/hide', () => {
  it('hides field when condition is falsy', async () => {
    render(Form, { props: { schema: conditionalSchema } });
    await tick();
    // Email should not be visible when subscribe is false (default)
    expect(screen.queryByPlaceholderText('Enter email')).not.toBeInTheDocument();
  });

  it('shows field when condition becomes truthy', async () => {
    render(Form, { props: { schema: conditionalSchema } });
    await tick();

    // Click the checkbox to make subscribe truthy
    const checkbox = screen.getByRole('checkbox');
    await fireEvent.click(checkbox);
    await tick();

    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('hides field again when condition becomes falsy', async () => {
    render(Form, { props: { schema: conditionalSchema } });
    await tick();

    const checkbox = screen.getByRole('checkbox');
    // Show
    await fireEvent.click(checkbox);
    await tick();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();

    // Hide
    await fireEvent.click(checkbox);
    await tick();
    expect(screen.queryByPlaceholderText('Enter email')).not.toBeInTheDocument();
  });
});

