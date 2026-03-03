import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { tick } from 'svelte';
import Form from '../src/components/Form.svelte';
import FormWithTypes from './helpers/FormWithTypes.svelte';
import FormWithProvider from './helpers/FormWithProvider.svelte';
import { createDefaultContainer, createFormContainer } from '../src/registry/container.js';
import type { FormSchema } from '../src/types.js';

// ── Load expected JSON schemas ──
import contactFormSchema from '../../typespec-subschema/examples/expected/contact-form.json';
import userProfileSchema from '../../typespec-subschema/examples/expected/user-profile.json';
import conditionalFormSchema from '../../typespec-subschema/examples/expected/conditional-form.json';

// ═══════════════════════════════════════════════
// Contact Form — flat form with validation
// ═══════════════════════════════════════════════

describe('Integration: Contact Form', () => {
  const schema = contactFormSchema as FormSchema;

  it('renders all fields', async () => {
    render(Form, { props: { schema } });
    await tick();
    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tell us more...')).toBeInTheDocument();
    expect(screen.getByText('Subject')).toBeInTheDocument();
  });

  it('blocks submit when required fields are empty', async () => {
    const onSubmit = vi.fn();
    render(Form, { props: { schema, onSubmit } });
    await tick();
    await fireEvent.submit(document.querySelector('form')!);
    await tick();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows required error after blur on empty name', async () => {
    render(Form, { props: { schema } });
    await tick();
    const input = screen.getByPlaceholderText('Enter your full name');
    await fireEvent.focus(input);
    await fireEvent.blur(input);
    await tick();
    expect(screen.getByRole('alert')).toHaveTextContent('Name is required');
  });

  it('shows pattern validation error for invalid email', async () => {
    render(Form, { props: { schema, values: { name: 'Alice', email: 'bad' } } });
    await tick();
    const emailInput = screen.getByPlaceholderText('you@example.com');
    await fireEvent.blur(emailInput);
    await tick();
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });

  it('submits successfully with valid data', async () => {
    const onSubmit = vi.fn();
    render(Form, {
      props: {
        schema,
        values: {
          name: 'Alice',
          email: 'alice@test.com',
          subject: 'General Inquiry',
          message: 'Hello',
        },
        onSubmit,
      },
    });
    await tick();
    await fireEvent.submit(document.querySelector('form')!);
    await tick();
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Alice',
      email: 'alice@test.com',
      subject: 'General Inquiry',
      message: 'Hello',
    });
  });
});

// ═══════════════════════════════════════════════
// User Profile — nested Object + conditional
// ═══════════════════════════════════════════════

describe('Integration: User Profile', () => {
  const schema = userProfileSchema as FormSchema;

  it('renders top-level and nested address fields', async () => {
    render(Form, { props: { schema } });
    await tick();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    // Nested address fields
    expect(screen.getByPlaceholderText('123 Main St')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('City')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('State')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('12345')).toBeInTheDocument();
  });

  it('renders Address as a nested Object with heading', async () => {
    render(Form, { props: { schema } });
    await tick();
    const heading = screen.getByRole('heading', { name: 'Address' });
    expect(heading).toBeInTheDocument();
  });

  it('hides phone field when hasPhone is unchecked', async () => {
    render(Form, { props: { schema } });
    await tick();
    expect(screen.queryByPlaceholderText('555-0100')).not.toBeInTheDocument();
  });

  it('shows phone field when hasPhone checkbox is clicked', async () => {
    render(Form, { props: { schema } });
    await tick();
    const checkbox = screen.getByRole('checkbox');
    await fireEvent.click(checkbox);
    await tick();
    expect(screen.getByPlaceholderText('555-0100')).toBeInTheDocument();
  });

  it('shows required error after blur on empty username', async () => {
    render(Form, { props: { schema } });
    await tick();
    const input = screen.getByPlaceholderText('Username');
    await fireEvent.focus(input);
    await fireEvent.blur(input);
    await tick();
    expect(screen.getByRole('alert')).toHaveTextContent('Username is required');
  });

  it('validates minLength on username', async () => {
    render(Form, { props: { schema } });
    await tick();
    const input = screen.getByPlaceholderText('Username') as HTMLInputElement;
    // Svelte TextField uses oninput, so we must set value then fire 'input'
    input.value = 'ab';
    await fireEvent.input(input);
    await fireEvent.blur(input);
    await tick();
    expect(screen.getByText('At least 3 characters')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════
// Conditional Form — fieldsets + multiple conditionals
// ═══════════════════════════════════════════════

describe('Integration: Conditional Form', () => {
  const schema = conditionalFormSchema as FormSchema;

  it('renders fieldset legends', async () => {
    render(Form, { props: { schema } });
    await tick();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
  });

  it('renders fields inside fieldsets', async () => {
    render(Form, { props: { schema } });
    await tick();
    expect(screen.getByPlaceholderText('First name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last name')).toBeInTheDocument();
    expect(screen.getByText('Contact Method')).toBeInTheDocument();
  });

  it('hides conditional fields by default', async () => {
    render(Form, { props: { schema } });
    await tick();
    // contactEmail and contactPhone are hidden (conditional on contactMethod equals)
    expect(screen.queryByPlaceholderText('you@example.com')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('555-0100')).not.toBeInTheDocument();
  });

  it('hides frequency when newsletter is unchecked', async () => {
    render(Form, { props: { schema } });
    await tick();
    expect(screen.queryByText('Frequency')).not.toBeInTheDocument();
  });

  it('shows frequency when newsletter checkbox is clicked', async () => {
    render(Form, { props: { schema } });
    await tick();
    const checkbox = screen.getByRole('checkbox');
    await fireEvent.click(checkbox);
    await tick();
    expect(screen.getByText('Frequency')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════
// Custom type registration (Option B)
// ═══════════════════════════════════════════════

describe('Integration: Custom type registration (Option B)', () => {
  it('renders a custom field type passed via types prop', async () => {
    const { default: StarRating } = await import('./helpers/StarRating.svelte');

    const schema: FormSchema = {
      schema: {
        name: { type: 'Text', title: 'Name', placeholder: 'Name' },
        rating: { type: 'StarRating', title: 'Rating' },
      },
    };

    render(FormWithTypes, {
      props: { schema, types: { StarRating } },
    });
    await tick();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByTestId('star-rating')).toBeInTheDocument();
    expect(screen.getByText('Stars: none')).toBeInTheDocument();
  });

  it('custom type receives initial values', async () => {
    const { default: ColorPicker } = await import('./helpers/ColorPicker.svelte');

    const schema: FormSchema = {
      schema: { color: { type: 'ColorPicker', title: 'Color' } },
    };

    render(FormWithTypes, {
      props: { schema, types: { ColorPicker }, values: { color: '#ff0000' } },
    });
    await tick();
    expect(screen.getByText('Color: #ff0000')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════
// Preset composition via FormProvider (Option C)
// ═══════════════════════════════════════════════

describe('Integration: Preset composition (Option C)', () => {
  it('child Form inherits types from FormProvider container', async () => {
    const { default: CustomText } = await import('./helpers/CustomText.svelte');

    const container = createDefaultContainer();
    const child = createFormContainer(container, { types: { Text: CustomText } });

    const schema: FormSchema = {
      schema: {
        name: { type: 'Text', title: 'Name' },
        email: { type: 'Text', title: 'Email' },
      },
    };

    render(FormWithProvider, {
      props: { schema, container: child },
    });
    await tick();

    expect(screen.getAllByTestId('custom-text')).toHaveLength(2);
  });

  it('Form-level types override FormProvider types', async () => {
    const { default: ProviderText } = await import('./helpers/ProviderText.svelte');
    const { default: FormText } = await import('./helpers/FormText.svelte');

    const container = createDefaultContainer();
    const child = createFormContainer(container, { types: { Text: ProviderText } });

    const schema: FormSchema = {
      schema: { name: { type: 'Text', title: 'Name' } },
    };

    render(FormWithProvider, {
      props: { schema, container: child, types: { Text: FormText } },
    });
    await tick();

    expect(screen.getByTestId('form-text')).toBeInTheDocument();
    expect(screen.queryByTestId('provider-text')).not.toBeInTheDocument();
  });
});

