import type { TemplateData } from '../types.js';

export function generateFieldComponent(data: TemplateData): string {
  const propsInterface = data.props.length > 0
    ? data.props.map(p => `  ${p.name}?: ${p.type};`).join('\n')
    : '  // Add custom props here';

  const defaultProps = data.props.filter(p => p.hasDefault);
  const defaults = defaultProps.length > 0
    ? defaultProps.map(p => `  const ${p.name} = fieldSchema.${p.name} as ${p.type} ?? ${JSON.stringify(p.default)};`).join('\n')
    : '';

  return `import type { FieldComponentProps } from '@subschema/react';

export interface ${data.fullName}Props extends FieldComponentProps {
${propsInterface}
}

export const ${data.fullName} = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  placeholder,
  title,
  fieldSchema,
}: ${data.fullName}Props) => {
${defaults ? defaults + '\n' : ''}  return (
    <div data-testid={\`field-\${name}\`}>
      {title && <label>{title}</label>}
      <input
        name={name}
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
};
`;
}

export function generateTemplateComponent(data: TemplateData): string {
  return `import type { TemplateComponentProps } from '@subschema/react';

export const ${data.fullName} = ({
  name,
  label,
  description,
  error,
  children,
}: TemplateComponentProps) => {
  return (
    <div className="${data.nameCamel}-template" data-testid={\`template-\${name}\`}>
      {label && <label htmlFor={name}>{label}</label>}
      {description && <p className="description">{description}</p>}
      {children}
      {error && <span className="error">{error}</span>}
    </div>
  );
};
`;
}

export function generateValidatorFunction(data: TemplateData): string {
  const configProps = data.props.length > 0
    ? data.props.map(p => `  // const ${p.name} = config.value as ${p.type};`).join('\n')
    : '  // Access config.value for validator parameters';

  return `import type { ValidatorConfig } from '@subschema/react';

/**
 * ${data.name} validator function.
 * Returns an error string if validation fails, undefined otherwise.
 */
export const ${data.nameCamel}Validator = (
  value: unknown,
  config: ValidatorConfig,
): string | undefined => {
${configProps}
  if (value == null || value === '') {
    return undefined; // Let required validator handle empty values
  }
  // TODO: Implement ${data.name} validation logic
  return undefined;
};
`;
}

