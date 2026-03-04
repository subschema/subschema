module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|nativewind|react-native-css-interop|@speajus))',
  ],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/__mocks__/fileMock.js',
  },
};
