import type { TemplateData } from '../types.js';
import {
  formatPropsLine,
  formatSchemaExample,
  formatTypeSpecExample,
  formatFormExample,
  formatRegistration,
} from './llms-txt.js';

export function generateReadme(data: TemplateData): string {
  return `# @subschema/${data.packageName}

A Subschema ${data.kind} component: **${data.name}**.

## Installation

\`\`\`bash
pnpm add @subschema/${data.packageName}
\`\`\`

## Props

${formatPropsLine(data)}

## Usage

### Schema

\`\`\`json
${formatSchemaExample(data)}
\`\`\`

### TypeSpec

\`\`\`
${formatTypeSpecExample(data)}
\`\`\`

### React

\`\`\`tsx
import { Form } from '@subschema/react';

${formatFormExample(data)}
\`\`\`

### Registration

\`\`\`typescript
import { ${data.kind === 'validator' ? `${data.nameCamel}Validator` : data.fullName} } from '@subschema/${data.packageName}';

${formatRegistration(data)}
\`\`\`

## License

MIT
`;
}

