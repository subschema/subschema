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

const equalsSchema: FormSchema = {
  schema: {
    country: {
      type: 'Select',
      title: 'Country',
      options: [
        { label: 'US', value: 'us' },
        { label: 'Other', value: 'other' },
      ],
    },
    state: {
      type: 'Text',
      title: 'State',
      placeholder: 'Enter state',
      conditional: { listen: 'country', operator: 'equals', value: 'us' },
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

    // Click the checkbox to make subscribe truthy
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('hides field again when condition becomes falsy', () => {
    render(<Form schema={conditionalSchema} />);

    const checkbox = screen.getByRole('checkbox');
    // Show
    fireEvent.click(checkbox);
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();

    // Hide
    fireEvent.click(checkbox);
    expect(screen.queryByPlaceholderText('Enter email')).not.toBeInTheDocument();
  });
});
