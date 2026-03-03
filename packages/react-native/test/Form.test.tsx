import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from '../src/components/Form.js';
import { FormProvider } from '../src/components/FormProvider.js';
import { createDefaultContainer, createFormContainer } from '../src/registry/container.js';
import type { FormSchema, FieldComponentProps } from '../src/types.js';

// ─── Test schemas ───
const simpleSchema: FormSchema = {
  schema: {
    name: { type: 'Text', title: 'Name', placeholder: 'Enter name' },
    email: { type: 'Text', title: 'Email', placeholder: 'Enter email' },
  },
};

const validatedSchema: FormSchema = {
  schema: {
    username: {
      type: 'Text',
      title: 'Username',
      validators: [
        { type: 'required', message: 'Username is required' },
        { type: 'minLength', value: 3, message: 'At least 3 chars' },
      ],
    },
  },
};

// ─── Tests ───

describe('Form rendering from schema', () => {
  it('renders fields defined in schema', () => {
    render(<Form schema={simpleSchema} />);
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('renders labels from title', () => {
    render(<Form schema={simpleSchema} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('uses initial values', () => {
    render(<Form schema={simpleSchema} values={{ name: 'Alice', email: 'alice@test.com' }} />);
    expect(screen.getByPlaceholderText('Enter name')).toHaveValue('Alice');
    expect(screen.getByPlaceholderText('Enter email')).toHaveValue('alice@test.com');
  });
});

describe('Form onChange callback', () => {
  it('calls onChange when values change', () => {
    const onChange = vi.fn();
    render(<Form schema={simpleSchema} onChange={onChange} />);

    const nameInput = screen.getByPlaceholderText('Enter name');
    fireEvent.change(nameInput, { target: { value: 'Bob' } });

    // onChange should have been called with updated values
    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.name).toBe('Bob');
  });
});

describe('Custom type registration via types prop', () => {
  it('renders custom field type via types prop', () => {
    const RatingField = ({ name, value, onChange }: FieldComponentProps) => (
      <div data-testid="rating-field">Rating: {String(value)}</div>
    );

    const schema: FormSchema = {
      schema: { rating: { type: 'Rating', title: 'Rating' } },
    };

    render(<Form schema={schema} types={{ Rating: RatingField }} />);
    expect(screen.getByTestId('rating-field')).toBeInTheDocument();
  });
});

describe('FormProvider with preset container', () => {
  it('uses container from FormProvider', () => {
    const MockField = ({ name }: FieldComponentProps) => (
      <div data-testid="mock-text">Mock text field</div>
    );

    const container = createDefaultContainer();
    const child = createFormContainer(container, { types: { Text: MockField } });

    render(
      <FormProvider container={child}>
        <Form schema={simpleSchema} />
      </FormProvider>,
    );

    // Should use the mock field, not the default TextField
    expect(screen.getAllByTestId('mock-text')).toHaveLength(2);
  });
});

describe('Validation on blur', () => {
  it('shows error after blur on empty required field', () => {
    render(<Form schema={validatedSchema} />);

    const input = screen.getByTestId('username');
    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(screen.getByRole('alert')).toHaveTextContent('Username is required');
  });

  it('shows minLength error', () => {
    render(<Form schema={validatedSchema} />);

    const input = screen.getByTestId('username');
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.blur(input);

    expect(screen.getByRole('alert')).toHaveTextContent('At least 3 chars');
  });
});

