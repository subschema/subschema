import './global.css';

import React from 'react';
import { Alert, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Form, Button, useFormState } from '@subschema/react-native';
import type { FormSchema } from '@subschema/core';

const schema: FormSchema = {
  schema: {
    firstName: {
      type: 'Text',
      title: 'First Name',
      placeholder: 'Enter your first name',
      validators: [{ type: 'required', message: 'First name is required' }],
    },
    lastName: {
      type: 'Text',
      title: 'Last Name',
      placeholder: 'Enter your last name',
      validators: [{ type: 'required', message: 'Last name is required' }],
    },
    email: {
      type: 'Text',
      title: 'Email',
      placeholder: 'you@example.com',
      validators: [
        { type: 'required', message: 'Email is required' },
        { type: 'pattern', value: '^[^@]+@[^@]+\\.[^@]+$', message: 'Invalid email' },
      ],
    },
    age: {
      type: 'Number',
      title: 'Age',
      placeholder: '25',
      validators: [
        { type: 'minValue', value: 1, message: 'Must be at least 1' },
        { type: 'maxValue', value: 150, message: 'Must be at most 150' },
      ],
    },
    password: {
      type: 'Password',
      title: 'Password',
      placeholder: 'Enter a password',
      validators: [
        { type: 'required', message: 'Password is required' },
        { type: 'minLength', value: 6, message: 'At least 6 characters' },
      ],
    },
    bio: {
      type: 'TextArea',
      title: 'Bio',
      placeholder: 'Tell us about yourself...',
    },
    country: {
      type: 'Select',
      title: 'Country',
      placeholder: 'Select a country',
      options: [
        { label: 'United States', value: 'us' },
        { label: 'Canada', value: 'ca' },
        { label: 'United Kingdom', value: 'uk' },
        { label: 'Germany', value: 'de' },
        { label: 'France', value: 'fr' },
        { label: 'Australia', value: 'au' },
        { label: 'Japan', value: 'jp' },
      ],
    },
    newsletter: {
      type: 'Checkbox',
      title: 'Subscribe to newsletter',
    },
    gender: {
      type: 'Radio',
      title: 'Gender',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
        { label: 'Prefer not to say', value: 'na' },
      ],
    },
  },
  fieldsets: [
    { legend: 'Personal Information', fields: ['firstName', 'lastName', 'email', 'age'] },
    { legend: 'Security', fields: ['password'] },
    { legend: 'About You', fields: ['bio', 'country'] },
    { legend: 'Preferences', fields: ['newsletter', 'gender'] },
  ],
};

function SubmitButton() {
  const formState = useFormState();

  const handleSubmit = () => {
    const errors = formState.validate();
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      Alert.alert('Validation Error', 'Please fix the errors above.');
      return;
    }
    console.log('Form values:', JSON.stringify(formState.values, null, 2));
    Alert.alert('Success', 'Form submitted!\n\nCheck console for values.');
  };

  return (
    <Button onPress={handleSubmit} size="lg" className="mt-4">
      Submit
    </Button>
  );
}

function App(): React.JSX.Element {
  const handleSubmit = (values: Record<string, unknown>) => {
    console.log('Form submitted:', JSON.stringify(values, null, 2));
    Alert.alert('Success', 'Form submitted!\n\nCheck console for values.');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
        <ScrollView
          className="flex-1"
          contentContainerClassName="p-4 pb-12"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Subschema Demo
          </Text>
          <Text className="text-sm text-gray-500 mb-6">
            React Native form engine — powered by @subschema/react-native
          </Text>

          <Form schema={schema} onSubmit={handleSubmit}>
            <SubmitButton />
          </Form>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
