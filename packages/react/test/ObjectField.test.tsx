import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Form } from '../src/components/Form.js';
import type { FormSchema } from '../src/types.js';

const nestedSchema: FormSchema = {
  schema: {
    name: { type: 'Text', title: 'Name', placeholder: 'Enter name' },
    address: {
      type: 'Object',
      title: 'Address',
      subSchema: {
        schema: {
          street: { type: 'Text', title: 'Street', placeholder: 'Enter street' },
          city: { type: 'Text', title: 'City', placeholder: 'Enter city' },
        },
      },
    },
  },
};

describe('Nested ObjectField with child container', () => {
  it('renders nested form fields inside a card', () => {
    render(<Form schema={nestedSchema} />);

    // Parent field
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();

    // Nested fields
    expect(screen.getByPlaceholderText('Enter street')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter city')).toBeInTheDocument();
  });

  it('renders the object title as card header', () => {
    render(<Form schema={nestedSchema} />);
    // "Address" appears both as a label and as an h3 card title
    const heading = screen.getByRole('heading', { name: 'Address' });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H3');
  });

  it('renders deeply nested object schemas', () => {
    const deepSchema: FormSchema = {
      schema: {
        profile: {
          type: 'Object',
          title: 'Profile',
          subSchema: {
            schema: {
              bio: { type: 'TextArea', title: 'Bio', placeholder: 'Enter bio' },
              contact: {
                type: 'Object',
                title: 'Contact Info',
                subSchema: {
                  schema: {
                    phone: { type: 'Text', title: 'Phone', placeholder: 'Enter phone' },
                  },
                },
              },
            },
          },
        },
      },
    };

    render(<Form schema={deepSchema} />);
    expect(screen.getByPlaceholderText('Enter bio')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter phone')).toBeInTheDocument();
  });
});

