// NativeWind type augmentations for React Native components
// This file must have a top-level import/export to be treated as a module
// so that `declare module` augments rather than replaces.
import 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface PressableProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
  interface SwitchProps {
    className?: string;
  }
}
