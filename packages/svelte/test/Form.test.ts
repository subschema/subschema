import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import { tick } from 'svelte';
import Form from '../src/components/Form.svelte';
import FormWithTypes from './helpers/FormWithTypes.svelte';
import FormWithProvider from './helpers/FormWithProvider.svelte';
import { createDefaultContainer, createFormContainer } from '../src/registry/container.js';
import type { FormSchema } from '../src/types.js';

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
  it('renders fields defined in schema', async () => {
    render(Form, { props: { schema: simpleSchema } });
    await tick();
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  it('renders labels from title', async () => {
    render(Form, { props: { schema: simpleSchema } });
    await tick();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders a form element', async () => {
    const { container } = render(Form, { props: { schema: simpleSchema } });
    await tick();
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('uses initial values', async () => {
    render(Form, {
      props: { schema: simpleSchema, values: { name: 'Alice', email: 'alice@test.com' } },
    });
    await tick();
    expect(screen.getByPlaceholderText('Enter name')).toHaveValue('Alice');
    expect(screen.getByPlaceholderText('Enter email')).toHaveValue('alice@test.com');
  });
});

describe('Form submission', () => {
  it('calls onSubmit with values', async () => {
    const onSubmit = vi.fn();
    render(Form, {
      props: {
        schema: simpleSchema,
        values: { name: 'Bob', email: 'bob@test.com' },
        onSubmit,
      },
    });
    await tick();

    const form = document.querySelector('form')!;
    await fireEvent.submit(form);
    await tick();

    expect(onSubmit).toHaveBeenCalledWith({ name: 'Bob', email: 'bob@test.com' });
  });

  it('does not submit when validation fails', async () => {
    const onSubmit = vi.fn();
    render(Form, { props: { schema: validatedSchema, onSubmit } });
    await tick();

    const form = document.querySelector('form')!;
    await fireEvent.submit(form);
    await tick();

    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe('Custom type registration via props (Option B)', () => {
  it('renders custom field type via types prop', async () => {
    const { default: RatingField } = await import('./helpers/RatingField.svelte');
    const schema: FormSchema = {
      schema: { rating: { type: 'Rating', title: 'Rating' } },
    };

    render(FormWithTypes, {
      props: { schema, types: { Rating: RatingField } },
    });
    await tick();
    expect(screen.getByTestId('rating-field')).toBeInTheDocument();
  });
});

describe('FormProvider with preset container (Option C)', () => {
  it('uses container from FormProvider', async () => {
    const { default: MockField } = await import('./helpers/MockField.svelte');

    const container = createDefaultContainer();
    const child = createFormContainer(container, { types: { Text: MockField } });

    render(FormWithProvider, {
      props: { schema: simpleSchema, container: child },
    });
    await tick();

    expect(screen.getAllByTestId('mock-text')).toHaveLength(2);
  });
});

describe('Validation on blur and submit', () => {
  it('shows error after blur on invalid field', async () => {
    render(Form, { props: { schema: validatedSchema } });
    await tick();

    const input = screen.getByRole('textbox');
    await fireEvent.focus(input);
    await fireEvent.blur(input);
    await tick();

    expect(screen.getByRole('alert')).toHaveTextContent('Username is required');
  });

  it('shows minLength error', async () => {
    render(Form, { props: { schema: validatedSchema } });
    await tick();

    const input = screen.getByRole('textbox') as HTMLInputElement;
    // Svelte TextField uses oninput, so we must set value then fire 'input'
    input.value = 'ab';
    await fireEvent.input(input);
    await fireEvent.blur(input);
    await tick();

    expect(screen.getByRole('alert')).toHaveTextContent('At least 3 chars');
  });
});
