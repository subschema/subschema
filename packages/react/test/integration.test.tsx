import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from '../src/components/Form.js';
import { FormProvider } from '../src/components/FormProvider.js';
import { createDefaultContainer, createFormContainer } from '../src/registry/container.js';
import type { FormSchema, FieldComponentProps } from '../src/types.js';

// ── Load expected JSON schemas ──
import contactFormSchema from '../../typespec-subschema/examples/expected/contact-form.json';
import userProfileSchema from '../../typespec-subschema/examples/expected/user-profile.json';
import conditionalFormSchema from '../../typespec-subschema/examples/expected/conditional-form.json';

// ═══════════════════════════════════════════════
// Contact Form — flat form with validation
// ═══════════════════════════════════════════════

describe('Integration: Contact Form', () => {
  const schema = contactFormSchema as FormSchema;

  it('renders all fields', () => {
    render(<Form schema={schema} />);
    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tell us more...')).toBeInTheDocument();
    expect(screen.getByText('Subject')).toBeInTheDocument();
  });

  it('blocks submit when required fields are empty', () => {
    const onSubmit = vi.fn();
    render(<Form schema={schema} onSubmit={onSubmit} />);
    fireEvent.submit(document.querySelector('form')!);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows required error after blur on empty name', () => {
    render(<Form schema={schema} />);
    const input = screen.getByPlaceholderText('Enter your full name');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(screen.getByRole('alert')).toHaveTextContent('Name is required');
  });

  it('shows pattern validation error for invalid email', () => {
    render(<Form schema={schema} values={{ name: 'Alice', email: 'bad' }} />);
    const emailInput = screen.getByPlaceholderText('you@example.com');
    fireEvent.blur(emailInput);
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });

  it('submits successfully with valid data', () => {
    const onSubmit = vi.fn();
    render(
      <Form
        schema={schema}
        values={{
          name: 'Alice',
          email: 'alice@test.com',
          subject: 'General Inquiry',
          message: 'Hello',
        }}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.submit(document.querySelector('form')!);
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Alice',
      email: 'alice@test.com',
      subject: 'General Inquiry',
      message: 'Hello',
    });
  });

  it('snapshot: renders correct HTML structure', () => {
    const { container } = render(<Form schema={schema} />);
    expect(container.querySelector('form')).toMatchSnapshot();
  });
});

// ═══════════════════════════════════════════════
// User Profile — nested Object + conditional
// ═══════════════════════════════════════════════

describe('Integration: User Profile', () => {
  const schema = userProfileSchema as FormSchema;

  it('renders top-level and nested address fields', () => {
    render(<Form schema={schema} />);
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    // Nested address fields
    expect(screen.getByPlaceholderText('123 Main St')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('City')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('State')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('12345')).toBeInTheDocument();
  });

  it('renders Address as a nested Object with heading', () => {
    render(<Form schema={schema} />);
    const heading = screen.getByRole('heading', { name: 'Address' });
    expect(heading).toBeInTheDocument();
  });

  it('hides phone field when hasPhone is unchecked', () => {
    render(<Form schema={schema} />);
    expect(screen.queryByPlaceholderText('555-0100')).not.toBeInTheDocument();
  });

  it('shows phone field when hasPhone checkbox is clicked', () => {
    render(<Form schema={schema} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(screen.getByPlaceholderText('555-0100')).toBeInTheDocument();
  });

  it('blocks submit when required fields are empty', () => {
    const onSubmit = vi.fn();
    render(<Form schema={schema} onSubmit={onSubmit} />);
    fireEvent.submit(document.querySelector('form')!);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows required error after blur on empty username', () => {
    render(<Form schema={schema} />);
    const input = screen.getByPlaceholderText('Username');
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(screen.getByRole('alert')).toHaveTextContent('Username is required');
  });

  it('validates minLength on username', () => {
    render(<Form schema={schema} />);
    const input = screen.getByPlaceholderText('Username');
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.blur(input);
    expect(screen.getByText('At least 3 characters')).toBeInTheDocument();
  });

  it('snapshot: renders correct HTML structure', () => {
    const { container } = render(<Form schema={schema} />);
    expect(container.querySelector('form')).toMatchSnapshot();
  });
});

// ═══════════════════════════════════════════════
// Conditional Form — fieldsets + multiple conditionals
// ═══════════════════════════════════════════════

describe('Integration: Conditional Form', () => {
  const schema = conditionalFormSchema as FormSchema;

  it('renders fieldset legends', () => {
    render(<Form schema={schema} />);
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
  });

  it('renders fields inside fieldsets', () => {
    render(<Form schema={schema} />);
    expect(screen.getByPlaceholderText('First name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last name')).toBeInTheDocument();
    expect(screen.getByText('Contact Method')).toBeInTheDocument();
  });

  it('hides conditional fields by default', () => {
    render(<Form schema={schema} />);
    // contactEmail and contactPhone are hidden (conditional on contactMethod equals)
    expect(screen.queryByPlaceholderText('you@example.com')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('555-0100')).not.toBeInTheDocument();
  });

  it('hides frequency when newsletter is unchecked', () => {
    render(<Form schema={schema} />);
    expect(screen.queryByText('Frequency')).not.toBeInTheDocument();
  });

  it('shows frequency when newsletter checkbox is clicked', () => {
    render(<Form schema={schema} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(screen.getByText('Frequency')).toBeInTheDocument();
  });

  it('snapshot: renders correct HTML structure', () => {
    const { container } = render(<Form schema={schema} />);
    expect(container.querySelector('form')).toMatchSnapshot();
  });
});

// ═══════════════════════════════════════════════
// Custom type registration (Option B)
// ═══════════════════════════════════════════════

describe('Integration: Custom type registration (Option B)', () => {
  it('renders a custom field type passed via types prop', () => {
    const StarRating = ({ name, value, onChange }: FieldComponentProps) => (
      <div data-testid="star-rating">
        Stars: {value === undefined || value === '' ? 'none' : String(value)}
      </div>
    );

    const schema: FormSchema = {
      schema: {
        name: { type: 'Text', title: 'Name', placeholder: 'Name' },
        rating: { type: 'StarRating', title: 'Rating' },
      },
    };

    render(<Form schema={schema} types={{ StarRating }} />);
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByTestId('star-rating')).toBeInTheDocument();
    expect(screen.getByText('Stars: none')).toBeInTheDocument();
  });

  it('custom type receives initial values', () => {
    const ColorPicker = ({ name, value }: FieldComponentProps) => (
      <div data-testid="color-picker">Color: {String(value)}</div>
    );

    const schema: FormSchema = {
      schema: { color: { type: 'ColorPicker', title: 'Color' } },
    };

    render(<Form schema={schema} types={{ ColorPicker }} values={{ color: '#ff0000' }} />);
    expect(screen.getByText('Color: #ff0000')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════
// Preset composition via FormProvider (Option C)
// ═══════════════════════════════════════════════

describe('Integration: Preset composition (Option C)', () => {
  it('child Form inherits types from FormProvider container', () => {
    const CustomText = ({ name, value }: FieldComponentProps) => (
      <div data-testid="custom-text">custom: {String(value ?? '')}</div>
    );

    const container = createDefaultContainer();
    const child = createFormContainer(container, { types: { Text: CustomText } });

    const schema: FormSchema = {
      schema: {
        name: { type: 'Text', title: 'Name' },
        email: { type: 'Text', title: 'Email' },
      },
    };

    render(
      <FormProvider container={child}>
        <Form schema={schema} />
      </FormProvider>,
    );

    expect(screen.getAllByTestId('custom-text')).toHaveLength(2);
  });

  it('Form-level types override FormProvider types', () => {
    const ProviderText = ({ name }: FieldComponentProps) => (
      <div data-testid="provider-text">provider</div>
    );
    const FormText = ({ name }: FieldComponentProps) => <div data-testid="form-text">form</div>;

    const container = createDefaultContainer();
    const child = createFormContainer(container, { types: { Text: ProviderText } });

    const schema: FormSchema = {
      schema: { name: { type: 'Text', title: 'Name' } },
    };

    render(
      <FormProvider container={child}>
        <Form schema={schema} types={{ Text: FormText }} />
      </FormProvider>,
    );

    expect(screen.getByTestId('form-text')).toBeInTheDocument();
    expect(screen.queryByTestId('provider-text')).not.toBeInTheDocument();
  });
});
