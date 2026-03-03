import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from '../src/components/Form.js';
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
  it('hides field when condition is falsy', () => {
    render(<Form schema={conditionalSchema} />);
    // Email should not be visible when subscribe is false (default)
    expect(screen.queryByPlaceholderText('Enter email')).not.toBeInTheDocument();
  });

  it('shows field when condition becomes truthy', () => {
    render(<Form schema={conditionalSchema} />);

    // Click the checkbox (Pressable rendered as button)
    const checkbox = screen.getByTestId('subscribe');
    fireEvent.click(checkbox);

    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('hides field again when condition becomes falsy', () => {
    render(<Form schema={conditionalSchema} />);

    const checkbox = screen.getByTestId('subscribe');
    // Show
    fireEvent.click(checkbox);
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();

    // Hide
    fireEvent.click(checkbox);
    expect(screen.queryByPlaceholderText('Enter email')).not.toBeInTheDocument();
  });
});

