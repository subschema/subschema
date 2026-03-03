import type { FormSchema } from '@subschema/react';

export interface ExampleDef {
  id: string;
  title: string;
  description: string;
  schema: FormSchema;
  typespec?: string;
}

// ── Contact Form (from contact-form.json) ──
const contactSchema: FormSchema = {
  schema: {
    name: {
      type: 'Text',
      title: 'Name',
      placeholder: 'Enter your full name',
      validators: [{ type: 'required', message: 'Name is required' }],
    },
    email: {
      type: 'Text',
      title: 'Email',
      placeholder: 'you@example.com',
      validators: [
        { type: 'required', message: 'Email is required' },
        { type: 'pattern', value: '^[^@]+@[^@]+\\.[^@]+$', message: 'Invalid email format' },
      ],
    },
    subject: {
      type: 'Select',
      title: 'Subject',
      options: [
        { label: 'General Inquiry', value: 'General Inquiry' },
        { label: 'Bug Report', value: 'Bug Report' },
        { label: 'Feature Request', value: 'Feature Request' },
      ],
    },
    message: { type: 'TextArea', title: 'Message', placeholder: 'Tell us more...' },
  },
};

const contactTypespec = `import "@subschema/typespec";
using Subschema;

@formConfig
model ContactForm {
  @field("Text") @placeholder("Enter your full name") name: string;
  @field("Text") @placeholder("you@example.com") email: string;
  @field("Select") @options("General Inquiry", "Bug Report", "Feature Request") subject: string;
  @field("TextArea") @placeholder("Tell us more...") message: string;
}`;

const loginTypespec = `import "@subschema/typespec";
using Subschema;

@formConfig
model LoginForm {
  @field("Text") @placeholder("you@example.com")
  email: string;

  @field("Password")
  password: string;
}`;

// ── Login Form ──
const loginSchema: FormSchema = {
  schema: {
    email: {
      type: 'Text',
      title: 'Email',
      placeholder: 'you@example.com',
      validators: [
        { type: 'required', message: 'Email is required' },
        { type: 'pattern', value: '^[^@]+@[^@]+\\.[^@]+$', message: 'Invalid email' },
      ],
    },
    password: {
      type: 'Password',
      title: 'Password',
      validators: [{ type: 'required', message: 'Password is required' }],
    },
  },
};

const signupTypespec = `import "@subschema/typespec";
using Subschema;

@formConfig
model SignupForm {
  @field("Text") @placeholder("Jane Doe")
  name: string;

  @field("Text") @placeholder("you@example.com")
  email: string;

  @field("Password")
  password: string;

  @field("Password")
  confirmPassword: string;

  @field("Checkbox")
  terms: boolean;
}`;

// ── Signup Form ──
const signupSchema: FormSchema = {
  schema: {
    name: {
      type: 'Text',
      title: 'Full Name',
      placeholder: 'Jane Doe',
      validators: [{ type: 'required', message: 'Name is required' }],
    },
    email: {
      type: 'Text',
      title: 'Email',
      placeholder: 'you@example.com',
      validators: [{ type: 'required', message: 'Email is required' }],
    },
    password: {
      type: 'Password',
      title: 'Password',
      validators: [
        { type: 'required', message: 'Password is required' },
        { type: 'minLength', value: 8, message: 'At least 8 characters' },
      ],
    },
    confirmPassword: {
      type: 'Password',
      title: 'Confirm Password',
      validators: [
        { type: 'required', message: 'Please confirm password' },
        { type: 'pattern', value: '', message: 'Passwords must match' },
      ],
    },
    terms: {
      type: 'Checkbox',
      title: 'I agree to the terms and conditions',
      validators: [{ type: 'required', message: 'You must agree to the terms' }],
    },
  },
};

// ── User Profile (from user-profile.json) ──
const profileSchema: FormSchema = {
  schema: {
    username: {
      type: 'Text',
      title: 'Username',
      placeholder: 'Username',
      validators: [
        { type: 'required', message: 'Username is required' },
        { type: 'minLength', value: 3, message: 'At least 3 characters' },
      ],
    },
    email: {
      type: 'Text',
      title: 'Email',
      placeholder: 'you@example.com',
      validators: [{ type: 'required', message: 'Email is required' }],
    },
    address: {
      type: 'Object',
      title: 'Address',
      subSchema: {
        schema: {
          street: { type: 'Text', title: 'Street', placeholder: '123 Main St' },
          city: { type: 'Text', title: 'City', placeholder: 'City' },
          state: { type: 'Text', title: 'State', placeholder: 'State' },
          zip: { type: 'Text', title: 'Zip', placeholder: '12345' },
        },
      },
    },
    hasPhone: { type: 'Checkbox', title: 'Has Phone' },
    phone: {
      type: 'Text',
      title: 'Phone',
      placeholder: '555-0100',
      conditional: { listen: 'hasPhone', operator: 'truthy' },
    },
  },
};

const profileTypespec = `import "@subschema/typespec";
using Subschema;

model Address {
  @field("Text") @placeholder("123 Main St") street: string;
  @field("Text") @placeholder("City") city: string;
  @field("Text") @placeholder("State") state: string;
  @field("Text") @placeholder("12345") zip: string;
}

@formConfig
model UserProfile {
  @field("Text") @placeholder("Username") username: string;
  @field("Text") @placeholder("you@example.com") email: string;
  address: Address;
  @field("Checkbox") hasPhone: boolean;
  @field("Text") @placeholder("555-0100") @conditional("hasPhone", "truthy") phone: string;
}`;

// ── Conditional Form (from conditional-form.json) ──
const conditionalSchema: FormSchema = {
  schema: {
    firstName: { type: 'Text', title: 'First Name', placeholder: 'First name' },
    lastName: { type: 'Text', title: 'Last Name', placeholder: 'Last name' },
    contactMethod: {
      type: 'Select',
      title: 'Contact Method',
      options: [
        { label: 'Email', value: 'Email' },
        { label: 'Phone', value: 'Phone' },
        { label: 'Mail', value: 'Mail' },
      ],
    },
    contactEmail: {
      type: 'Text',
      title: 'Contact Email',
      placeholder: 'you@example.com',
      conditional: { listen: 'contactMethod', operator: 'equals', value: 'Email' },
    },
    contactPhone: {
      type: 'Text',
      title: 'Contact Phone',
      placeholder: '555-0100',
      conditional: { listen: 'contactMethod', operator: 'equals', value: 'Phone' },
    },
    newsletter: { type: 'Checkbox', title: 'Newsletter' },
    frequency: {
      type: 'Select',
      title: 'Frequency',
      options: [
        { label: 'Daily', value: 'Daily' },
        { label: 'Weekly', value: 'Weekly' },
        { label: 'Monthly', value: 'Monthly' },
      ],
      conditional: { listen: 'newsletter', operator: 'truthy' },
    },
  },
  fieldsets: [
    { legend: 'Personal Information', fields: ['firstName', 'lastName'] },
    {
      legend: 'Preferences',
      fields: ['contactMethod', 'contactEmail', 'contactPhone', 'newsletter', 'frequency'],
    },
  ],
};

const conditionalTypespec = `import "@subschema/typespec";
using Subschema;

@fieldset("Personal Information")
model PersonalInfo {
  @field("Text") @placeholder("First name") firstName: string;
  @field("Text") @placeholder("Last name") lastName: string;
}

@fieldset("Preferences")
model Preferences {
  @field("Select") @options("Email", "Phone", "Mail") contactMethod: string;
  @field("Text") @placeholder("you@example.com") @conditional("contactMethod", "equals") contactEmail: string;
  @field("Text") @placeholder("555-0100") @conditional("contactMethod", "equals") contactPhone: string;
  @field("Checkbox") newsletter: boolean;
  @field("Select") @options("Daily", "Weekly", "Monthly") @conditional("newsletter", "truthy") frequency: string;
}

@formConfig
model ConditionalForm { ...PersonalInfo; ...Preferences; }`;

const fieldTypesTypespec = `import "@subschema/typespec";
using Subschema;

/** Showcase of every built-in field type. */
@formConfig
model AllFieldTypes {
  // Basic text input
  @field("Text") @placeholder("A text field") textField: string;

  // Numeric input
  @field("Number") @placeholder("42") numberField: int32;

  // Masked password input
  @field("Password") @placeholder("••••••••") passwordField: string;

  // Multi-line text
  @field("TextArea") @placeholder("A longer text...") textAreaField: string;

  // Dropdown select
  @field("Select") @options("Option A", "Option B", "Option C") selectField: string;

  // Single boolean checkbox
  @field("Checkbox") checkboxField: boolean;

  // Multi-select checkboxes
  @field("Checkboxes") @options("Red", "Green", "Blue") checkboxesField: string[];

  // Radio button group
  @field("Radio") @options("Small", "Medium", "Large") radioField: string;

  // Date picker
  @field("Date") dateField: string;

  // Autocomplete / combobox
  @field("Autocomplete") @options("Apple", "Banana", "Cherry", "Grape") autocompleteField: string;

  // Hidden field (not rendered)
  @field("Hidden") hiddenField: string;

  // Repeatable list of items
  @field("List") listField: string[];
}`;

// ── All Field Types ──
const fieldTypesSchema: FormSchema = {
  schema: {
    textField: { type: 'Text', title: 'Text', placeholder: 'A text field' },
    numberField: { type: 'Number', title: 'Number', placeholder: '42' },
    passwordField: { type: 'Password', title: 'Password', placeholder: '••••••••' },
    textAreaField: { type: 'TextArea', title: 'TextArea', placeholder: 'A longer text...' },
    selectField: {
      type: 'Select',
      title: 'Select',
      options: [
        { label: 'Option A', value: 'a' },
        { label: 'Option B', value: 'b' },
        { label: 'Option C', value: 'c' },
      ],
    },
    checkboxField: { type: 'Checkbox', title: 'Checkbox' },
    checkboxesField: {
      type: 'Checkboxes',
      title: 'Checkboxes',
      options: [
        { label: 'Red', value: 'red' },
        { label: 'Green', value: 'green' },
        { label: 'Blue', value: 'blue' },
      ],
    },
    radioField: {
      type: 'Radio',
      title: 'Radio',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
    },
    dateField: { type: 'Date', title: 'Date' },
    autocompleteField: {
      type: 'Autocomplete',
      title: 'Autocomplete',
      options: [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
        { label: 'Cherry', value: 'cherry' },
        { label: 'Grape', value: 'grape' },
      ],
    },
    hiddenField: { type: 'Hidden', title: 'Hidden', default: 'secret-value' },
    listField: {
      type: 'List',
      title: 'List (Tags)',
      itemSchema: { type: 'Text', placeholder: 'Add item' },
    },
  },
};

const validationTypespec = `import "@subschema/typespec";
using Subschema;

/** Showcase of all validator types. */
@formConfig
model ValidationShowcase {
  @field("Text") required: string;
  @field("Text") minLength: string;
  @field("Text") maxLength: string;
  @field("Text") @placeholder("you@example.com") pattern: string;
  @field("Number") minValue: int32;
  @field("Number") maxValue: int32;
}`;

// ── Validation Showcase ──
const validationSchema: FormSchema = {
  schema: {
    required: {
      type: 'Text',
      title: 'Required Field',
      validators: [{ type: 'required', message: 'This field is required' }],
    },
    minLength: {
      type: 'Text',
      title: 'Min Length (3)',
      validators: [{ type: 'minLength', value: 3, message: 'At least 3 characters' }],
    },
    maxLength: {
      type: 'Text',
      title: 'Max Length (10)',
      validators: [{ type: 'maxLength', value: 10, message: 'At most 10 characters' }],
    },
    pattern: {
      type: 'Text',
      title: 'Pattern (email)',
      placeholder: 'you@example.com',
      validators: [
        { type: 'pattern', value: '^[^@]+@[^@]+\\.[^@]+$', message: 'Must be a valid email' },
      ],
    },
    minValue: {
      type: 'Number',
      title: 'Min Value (1)',
      validators: [{ type: 'minValue', value: 1, message: 'Must be at least 1' }],
    },
    maxValue: {
      type: 'Number',
      title: 'Max Value (100)',
      validators: [{ type: 'maxValue', value: 100, message: 'Must be at most 100' }],
    },
  },
};

const customTypeTypespec = `import "@subschema/typespec";
using Subschema;

/** Custom star rating component registered via types prop. */
@formConfig
model MovieReview {
  @field("Text") @placeholder("Enter movie name")
  name: string;

  @field("Rating")
  rating: int32;

  @field("TextArea") @placeholder("What did you think?")
  review: string;
}`;

// ── Custom Type (Rating) ──
const customTypeSchema: FormSchema = {
  schema: {
    name: {
      type: 'Text',
      title: 'Movie Name',
      placeholder: 'Enter movie name',
      validators: [{ type: 'required', message: 'Name is required' }],
    },
    rating: { type: 'Rating', title: 'Your Rating' },
    review: { type: 'TextArea', title: 'Review', placeholder: 'What did you think?' },
  },
};

const presetTypespec = `import "@subschema/typespec";
using Subschema;

/** Simple form demonstrating preset container overrides. */
@formConfig
model TaskForm {
  @field("Text")
  title: string;

  @field("TextArea")
  description: string;

  @field("Select") @options("Low", "Medium", "High")
  priority: string;
}`;

// ── Preset Demo ──
const presetSchema: FormSchema = {
  schema: {
    title: {
      type: 'Text',
      title: 'Title',
      validators: [{ type: 'required', message: 'Title is required' }],
    },
    description: { type: 'TextArea', title: 'Description' },
    priority: {
      type: 'Select',
      title: 'Priority',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' },
      ],
    },
  },
};

const editorTypespec = `import "@subschema/typespec";
using Subschema;

@formConfig
model SimpleForm {
  @field("Text") @placeholder("Your name")
  name: string;

  @field("Text") @placeholder("you@example.com")
  email: string;
}`;

// ── Schema Editor ──
const editorDefaultSchema: FormSchema = {
  schema: {
    name: {
      type: 'Text',
      title: 'Name',
      placeholder: 'Your name',
      validators: [{ type: 'required', message: 'Required' }],
    },
    email: { type: 'Text', title: 'Email', placeholder: 'you@example.com' },
  },
};

export const examples: ExampleDef[] = [
  {
    id: 'contact',
    title: 'Contact Form',
    description: 'Simple contact form with Text, Select, TextArea and validation.',
    schema: contactSchema,
    typespec: contactTypespec,
  },
  {
    id: 'login',
    title: 'Login',
    description: 'Email + password login form with required validation.',
    schema: loginSchema,
    typespec: loginTypespec,
  },
  {
    id: 'signup',
    title: 'Signup',
    description: 'Registration form with password confirmation and terms checkbox.',
    schema: signupSchema,
    typespec: signupTypespec,
  },
  {
    id: 'profile',
    title: 'User Profile',
    description: 'Nested ObjectField for address with conditional phone field.',
    schema: profileSchema,
    typespec: profileTypespec,
  },
  {
    id: 'conditional',
    title: 'Conditional Fields',
    description: 'Show/hide fields based on select and checkbox values.',
    schema: conditionalSchema,
    typespec: conditionalTypespec,
  },
  {
    id: 'field-types',
    title: 'All Field Types',
    description: 'Showcase of every built-in field type.',
    schema: fieldTypesSchema,
    typespec: fieldTypesTypespec,
  },
  {
    id: 'validation',
    title: 'Validation',
    description:
      'All validator types: required, minLength, maxLength, pattern, minValue, maxValue.',
    schema: validationSchema,
    typespec: validationTypespec,
  },
  {
    id: 'custom-type',
    title: 'Custom Type',
    description: 'Custom star rating component registered via types prop (Option B).',
    schema: customTypeSchema,
    typespec: customTypeTypespec,
  },
  {
    id: 'preset',
    title: 'Preset',
    description: 'FormProvider with a custom preset container (Option C).',
    schema: presetSchema,
    typespec: presetTypespec,
  },
  {
    id: 'editor',
    title: 'Schema Editor',
    description: 'Live JSON schema editor — edit the schema and see the form update.',
    schema: editorDefaultSchema,
    typespec: editorTypespec,
  },
];
