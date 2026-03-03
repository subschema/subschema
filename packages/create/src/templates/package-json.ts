import type { TemplateData } from '../types.js';

export function generatePackageJson(data: TemplateData): string {
  const pkg = {
    name: `@subschema/${data.packageName}`,
    version: '0.1.0',
    type: 'module',
    description: `Subschema ${data.kind} component: ${data.name}`,
    main: 'dist/index.js',
    types: 'dist/index.d.ts',
    exports: {
      '.': {
        types: './dist/index.d.ts',
        default: './dist/index.js',
      },
    },
    scripts: {
      build: 'tsc -p tsconfig.json',
      test: 'vitest run',
      clean: 'rimraf dist',
    },
    peerDependencies: {
      '@subschema/react': '^0.1.0',
      '@speajus/diblob': '^1.0.0',
      react: '^19.0.0',
    },
    devDependencies: {
      '@subschema/react': '^0.1.0',
      '@types/react': '^19.0.0',
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      rimraf: '^6.0.0',
      typescript: '~5.7.0',
      vitest: '^3.0.0',
    },
    files: ['dist'],
    license: 'MIT',
  };
  return JSON.stringify(pkg, null, 2) + '\n';
}
