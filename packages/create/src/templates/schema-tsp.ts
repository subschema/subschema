import type { TemplateData } from '../types.js';

export function generateSchemaTsp(data: TemplateData): string {
  if (data.kind === 'validator') {
    return `import "@subschema/typespec";

/** ${data.name} validator */
extern dec ${data.nameCamel}(target: ModelProperty);
`;
  }

  const decoratorArgs = data.props
    .filter((p) => p.hasDefault)
    .map((p) => `${JSON.stringify(p.default)}`)
    .join(', ');

  const decoratorLine = decoratorArgs
    ? `extern dec ${data.nameCamel}(target: ModelProperty, ${data.props
        .filter((p) => p.hasDefault)
        .map((p) => `${p.name}: ${tspType(p.type)}`)
        .join(', ')});`
    : `extern dec ${data.nameCamel}(target: ModelProperty);`;

  return `import "@subschema/typespec";

/** ${data.name} ${data.kind} type */
${decoratorLine}

// Example usage:
// @field("${data.name}") ${data.props.filter((p) => p.hasDefault).length > 0 ? `@${data.nameCamel}(${decoratorArgs}) ` : ''}myField: string;
`;
}

function tspType(tsType: string): string {
  switch (tsType) {
    case 'number':
      return 'int32';
    case 'string':
      return 'string';
    case 'boolean':
      return 'boolean';
    default:
      return 'string';
  }
}
