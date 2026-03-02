import type { TemplateData } from '../types.js';

/** Shared data formatting used by both llms.txt and README */
export function formatPropsLine(data: TemplateData): string {
  if (data.kind === 'validator') {
    return data.props.length > 0
      ? data.props
          .map(
            (p) =>
              `${p.name} (${p.type}${p.hasDefault ? `, default: ${JSON.stringify(p.default)}` : ''})`,
          )
          .join(', ')
      : 'value (unknown)';
  }
  const allProps = [
    'value (unknown)',
    ...data.props.map(
      (p) =>
        `${p.name} (${p.type}${p.hasDefault ? `, default: ${JSON.stringify(p.default)}` : ''})`,
    ),
  ];
  return allProps.join(', ');
}

export function formatSchemaExample(data: TemplateData): string {
  const schemaProps: Record<string, unknown> = { type: data.name };
  for (const p of data.props) {
    if (p.hasDefault) schemaProps[p.name] = p.default;
  }
  return JSON.stringify(schemaProps);
}

export function formatTypeSpecExample(data: TemplateData): string {
  const decorators = data.props.filter((p) => p.hasDefault);
  const decoStr =
    decorators.length > 0
      ? ` @${data.nameCamel}(${decorators.map((p) => JSON.stringify(p.default)).join(', ')})`
      : '';
  return `@field("${data.name}")${decoStr} ${data.nameCamel}: string;`;
}

export function formatFormExample(data: TemplateData): string {
  const schema = formatSchemaExample(data);
  return `<Form schema={{ ${data.nameCamel}: ${schema} }} />`;
}

export function formatRegistration(data: TemplateData): string {
  if (data.kind === 'validator') {
    return `container.register(validators, () => ({ ...defaults, ${data.name}: ${data.nameCamel}Validator }))`;
  }
  if (data.kind === 'template') {
    return `container.register(templates, () => ({ ...defaults, ${data.name}: ${data.fullName} }))`;
  }
  return `container.register(fieldTypes, () => ({ ...defaults, ${data.name}: ${data.fullName} }))`;
}

export function generateLlmsTxt(data: TemplateData): string {
  const lines = [
    `# ${data.fullName}`,
    `Type: ${data.name}`,
    `Props: ${formatPropsLine(data)}`,
    `Schema: ${formatSchemaExample(data)}`,
    `TypeSpec: ${formatTypeSpecExample(data)}`,
    `Example: ${formatFormExample(data)}`,
    `Registration: ${formatRegistration(data)}`,
  ];
  return lines.join('\n') + '\n';
}
