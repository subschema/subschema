import type { TemplateData } from '../types.js';

export function generateTest(data: TemplateData): string {
  if (data.kind === 'validator') {
    return `import { describe, it, expect } from 'vitest';
import { ${data.nameCamel}Validator } from '../src/index.js';

describe('${data.nameCamel}Validator', () => {
  it('should return undefined for empty values', () => {
    expect(${data.nameCamel}Validator('', { type: '${data.name}' })).toBeUndefined();
    expect(${data.nameCamel}Validator(null, { type: '${data.name}' })).toBeUndefined();
  });

  it('should return undefined for valid values', () => {
    expect(${data.nameCamel}Validator('test', { type: '${data.name}' })).toBeUndefined();
  });
});
`;
  }

  return `import { describe, it, expect } from 'vitest';

describe('${data.fullName}', () => {
  it('should be importable', async () => {
    const mod = await import('../src/index.js');
    expect(mod.${data.fullName}).toBeDefined();
  });
});
`;
}

