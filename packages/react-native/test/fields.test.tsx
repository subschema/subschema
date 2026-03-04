import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from '../src/components/Form.js';
import type { FormSchema } from '../src/types.js';

// ─── TextField ───
describe('TextField', () => {
  const schema: FormSchema = {
    schema: {
      name: { type: 'Text', title: 'Name', placeholder: 'Enter name' },
    },
  };

  it('renders an input with placeholder', () => {
    render(<Form schema={schema} />);
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
  });

  it('renders with initial value', () => {
    render(<Form schema={schema} values={{ name: 'Alice' }} />);
    expect(screen.getByPlaceholderText('Enter name')).toHaveValue('Alice');
  });

  it('updates value on change', () => {
    const onChange = vi.fn();
    render(<Form schema={schema} onChange={onChange} />);

    const input = screen.getByPlaceholderText('Enter name');
    fireEvent.change(input, { target: { value: 'Bob' } });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.name).toBe('Bob');
  });
});

// ─── NumberField ───
describe('NumberField', () => {
  const schema: FormSchema = {
    schema: {
      age: { type: 'Number', title: 'Age', placeholder: 'Enter age' },
    },
  };

  it('renders an input', () => {
    render(<Form schema={schema} />);
    expect(screen.getByPlaceholderText('Enter age')).toBeInTheDocument();
  });

  it('renders with initial numeric value', () => {
    render(<Form schema={schema} values={{ age: 25 }} />);
    expect(screen.getByPlaceholderText('Enter age')).toHaveValue('25');
  });
});

// ─── CheckboxField ───
describe('CheckboxField', () => {
  const schema: FormSchema = {
    schema: {
      agree: { type: 'Checkbox', title: 'I agree' },
    },
  };

  it('renders a clickable element', () => {
    render(<Form schema={schema} />);
    // CheckboxField renders as a Pressable (button in mock)
    expect(screen.getByTestId('agree')).toBeInTheDocument();
  });

  it('toggles value on click', () => {
    const onChange = vi.fn();
    render(<Form schema={schema} onChange={onChange} />);

    const checkbox = screen.getByTestId('agree');
    fireEvent.click(checkbox);

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.agree).toBe(true);
  });
});

// ─── SelectField ───
describe('SelectField', () => {
  const schema: FormSchema = {
    schema: {
      color: {
        type: 'Select',
        title: 'Color',
        placeholder: 'Pick a color',
        options: [
          { label: 'Red', value: 'red' },
          { label: 'Blue', value: 'blue' },
          { label: 'Green', value: 'green' },
        ],
      },
    },
  };

  it('renders with placeholder text', () => {
    render(<Form schema={schema} />);
    expect(screen.getByText('Pick a color')).toBeInTheDocument();
  });

  it('opens modal on press and shows options', () => {
    render(<Form schema={schema} />);

    // Click the select trigger (Pressable → button)
    const trigger = screen.getByTestId('color');
    fireEvent.click(trigger);

    // Modal should now be visible with options
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
    expect(screen.getByText('Green')).toBeInTheDocument();
  });
});
