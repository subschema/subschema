import type { TemplateData } from '../types.js';

export function generateBarrel(data: TemplateData): string {
  if (data.kind === 'validator') {
    return `export { ${data.nameCamel}Validator } from './${data.fullName}.js';\nexport type { ${data.name}ValidatorConfig } from './types.js';\n`;
  }
  return `export { ${data.fullName} } from './${data.fullName}.js';\nexport type { ${data.name}Config } from './types.js';\n`;
}

