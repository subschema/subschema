import type { TemplateData } from '../types.js';
import { generatePackageJson } from './package-json.js';
import { generateTsconfig } from './tsconfig-tpl.js';
import {
  generateFieldComponent,
  generateTemplateComponent,
  generateValidatorFunction,
} from './component.js';
import { generateTypes } from './types-tpl.js';
import { generateBarrel } from './barrel.js';
import { generateSchemaTsp } from './schema-tsp.js';
import { generateLlmsTxt } from './llms-txt.js';
import { generateReadme } from './readme.js';
import { generateTest } from './test-tpl.js';

export interface GeneratedFile {
  path: string;
  content: string;
}

/** Generate all files for a component skeleton */
export function generateFiles(data: TemplateData): GeneratedFile[] {
  const files: GeneratedFile[] = [
    { path: 'package.json', content: generatePackageJson(data) },
    { path: 'tsconfig.json', content: generateTsconfig() },
    { path: 'README.md', content: generateReadme(data) },
    { path: 'llms.txt', content: generateLlmsTxt(data) },
    { path: 'src/types.ts', content: generateTypes(data) },
    { path: 'src/index.ts', content: generateBarrel(data) },
  ];

  // Component / function file
  switch (data.kind) {
    case 'field':
      files.push({
        path: `src/${data.fullName}.tsx`,
        content: generateFieldComponent(data),
      });
      break;
    case 'template':
      files.push({
        path: `src/${data.fullName}.tsx`,
        content: generateTemplateComponent(data),
      });
      break;
    case 'validator':
      files.push({
        path: `src/${data.fullName}.ts`,
        content: generateValidatorFunction(data),
      });
      break;
  }

  // Schema TypeSpec
  files.push({ path: 'src/schema.tsp', content: generateSchemaTsp(data) });

  // Test file
  files.push({
    path: `test/${data.fullName}.test.tsx`,
    content: generateTest(data),
  });

  return files;
}

