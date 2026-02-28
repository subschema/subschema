import type { TemplateData } from '../types.js';

export function generateTypes(data: TemplateData): string {
  if (data.kind === 'validator') {
    return `import type { ValidatorConfig } from '@subschema/react';

export interface ${data.name}ValidatorConfig extends ValidatorConfig {
  type: '${data.name}';
${data.props.map(p => `  ${p.name}?: ${p.type};`).join('\n')}
}
`;
  }

  const propsLines = data.props.length > 0
    ? data.props.map(p => {
      const defaultComment = p.hasDefault ? ` (default: ${JSON.stringify(p.default)})` : '';
      return `  /** ${p.name}${defaultComment} */\n  ${p.name}?: ${p.type};`;
    }).join('\n')
    : '  // Add custom configuration properties here';

  return `/** Configuration for ${data.name} ${data.kind} in schema */
export interface ${data.name}Config {
  type: '${data.name}';
${propsLines}
}
`;
}

