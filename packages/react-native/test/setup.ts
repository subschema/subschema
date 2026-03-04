import '@testing-library/jest-dom/vitest';
import React from 'react';

/**
 * Mock react-native module for jsdom testing.
 * Maps RN primitives to simple HTML elements so @testing-library/react works.
 */
vi.mock('react-native', () => {
  const RN: Record<string, unknown> = {};

  // View → div
  RN.View = React.forwardRef(({ className, testID, ...props }: any, ref: any) =>
    React.createElement('div', { ...props, 'data-testid': testID, ref }),
  );
  (RN.View as any).displayName = 'View';

  // Text → span
  RN.Text = React.forwardRef(
    ({ className, accessibilityRole, testID, ...props }: any, ref: any) => {
      const extra: Record<string, unknown> = { 'data-testid': testID, ref };
      if (accessibilityRole === 'alert') extra.role = 'alert';
      return React.createElement('span', { ...props, ...extra });
    },
  );
  (RN.Text as any).displayName = 'Text';

  // TextInput → input
  RN.TextInput = React.forwardRef(
    (
      {
        className,
        onChangeText,
        editable,
        testID,
        secureTextEntry,
        keyboardType,
        autoCapitalize,
        ...props
      }: any,
      ref: any,
    ) =>
      React.createElement('input', {
        ...props,
        'data-testid': testID,
        ref,
        disabled: editable === false,
        type: secureTextEntry ? 'password' : 'text',
        onChange: onChangeText ? (e: any) => onChangeText(e.target.value) : undefined,
      }),
  );
  (RN.TextInput as any).displayName = 'TextInput';

  // Pressable → button
  RN.Pressable = React.forwardRef(
    ({ className, onPress, testID, disabled, ...props }: any, ref: any) =>
      React.createElement('button', {
        ...props,
        'data-testid': testID,
        ref,
        type: 'button',
        disabled,
        onClick: onPress,
      }),
  );
  (RN.Pressable as any).displayName = 'Pressable';

  // ScrollView → div
  RN.ScrollView = React.forwardRef(({ className, testID, ...props }: any, ref: any) =>
    React.createElement('div', { ...props, 'data-testid': testID, ref }),
  );
  (RN.ScrollView as any).displayName = 'ScrollView';

  // FlatList → renders items in a div
  RN.FlatList = React.forwardRef(
    ({ data, renderItem, keyExtractor, className, testID, ...props }: any, ref: any) =>
      React.createElement(
        'div',
        { 'data-testid': testID, ref },
        (data ?? []).map((item: any, index: number) => {
          const key = keyExtractor ? keyExtractor(item, index) : String(index);
          return React.createElement(React.Fragment, { key }, renderItem({ item, index }));
        }),
      ),
  );
  (RN.FlatList as any).displayName = 'FlatList';

  // Modal → div with visibility toggle
  RN.Modal = ({ visible, children, transparent, animationType, ...props }: any) => {
    if (!visible) return null;
    return React.createElement(
      'div',
      { 'data-testid': 'modal', role: 'dialog', ...props },
      children,
    );
  };
  (RN.Modal as any).displayName = 'Modal';

  // Switch → input[type=checkbox]
  RN.Switch = React.forwardRef(
    ({ value, onValueChange, testID, disabled, ...props }: any, ref: any) =>
      React.createElement('input', {
        type: 'checkbox',
        checked: !!value,
        'data-testid': testID,
        ref,
        disabled,
        onChange: onValueChange ? () => onValueChange(!value) : undefined,
      }),
  );
  (RN.Switch as any).displayName = 'Switch';

  // StyleSheet.create → identity function
  RN.StyleSheet = {
    create: (styles: any) => styles,
    flatten: (style: any) => (Array.isArray(style) ? Object.assign({}, ...style) : (style ?? {})),
  };

  // Platform
  RN.Platform = { OS: 'web', select: (obj: any) => obj.web ?? obj.default };

  return RN;
});

// Polyfill ResizeObserver for jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver;
