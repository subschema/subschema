import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Form } from '../src/components/Form.js';
import { FormProvider } from '../src/components/FormProvider.js';
import { createDefaultContainer, createFormContainer } from '../src/registry/container.js';
import { fieldTypes } from '../src/registry/blobs.js';
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

const conditionalSchema: FormSchema = {
  schema: {
    hasAddress: { type: 'Checkbox', title: 'Has Address' },
    street: {
      type: 'Text',
      title: 'Street',
      conditional: { listen: 'hasAddress', operator: 'truthy' },
    },
  },
};

const nestedSchema: FormSchema = {
  schema: {
    name: { type: 'Text', title: 'Name' },
    address: {
      type: 'Object',
      title: 'Address',
      subSchema: {
        schema: {
          street: { type: 'Text', title: 'Street' },
          city: { type: 'Text', title: 'City' },
        },
      },
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

  it('renders a form element', () => {
    const { container } = render(<Form schema={simpleSchema} />);
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('uses initial values', () => {
    render(<Form schema={simpleSchema} values={{ name: 'Alice', email: 'alice@test.com' }} />);
    expect(screen.getByPlaceholderText('Enter name')).toHaveValue('Alice');
    expect(screen.getByPlaceholderText('Enter email')).toHaveValue('alice@test.com');
  });
});

describe('Form submission', () => {
  it('calls onSubmit with values', () => {
    const onSubmit = vi.fn();
    render(
      <Form
        schema={simpleSchema}
        values={{ name: 'Bob', email: 'bob@test.com' }}
        onSubmit={onSubmit}
      />,
    );

    const form = document.querySelector('form')!;
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Bob', email: 'bob@test.com' });
  });

  it('does not submit when validation fails', () => {
    const onSubmit = vi.fn();
    render(<Form schema={validatedSchema} onSubmit={onSubmit} />);

    const form = document.querySelector('form')!;
    fireEvent.submit(form);

    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe('Custom type registration via props (Option B)', () => {
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

describe('FormProvider with preset container (Option C)', () => {
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

describe('Validation on blur and submit', () => {
  it('shows error after blur on invalid field', () => {
    render(<Form schema={validatedSchema} />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(screen.getByRole('alert')).toHaveTextContent('Username is required');
  });

  it('shows minLength error', () => {
    render(<Form schema={validatedSchema} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.blur(input);

    expect(screen.getByRole('alert')).toHaveTextContent('At least 3 chars');
  });
});
