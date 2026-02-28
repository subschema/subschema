import type { CreateOptions, TemplateData, PropDef } from './types.js';

const KIND_SUFFIX: Record<string, string> = {
  field: 'Field',
  template: 'Template',
  validator: 'Validator',
};

export function toCamelCase(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

export function toKebabCase(s: string): string {
  return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function resolveTemplateData(options: CreateOptions): TemplateData {
  const suffix = KIND_SUFFIX[options.kind];
  const fullName = `${options.name}${suffix}`;
  const props: PropDef[] = Object.entries(options.props ?? {}).map(
    ([name, def]) => ({
      name,
      type: def.type,
      default: def.default,
      hasDefault: def.default !== undefined,
    }),
  );

  return {
    name: options.name,
    nameCamel: toCamelCase(options.name),
    kindSuffix: suffix,
    fullName,
    kind: options.kind,
    props,
    packageName: `${toKebabCase(options.name)}-${options.kind}`,
  };
}

/** Parse CLI props string like "max:number=5,color:string" */
export function parsePropsString(
  propsStr: string,
): Record<string, { type: string; default?: unknown }> {
  const result: Record<string, { type: string; default?: unknown }> = {};
  if (!propsStr.trim()) return result;

  for (const part of propsStr.split(',')) {
    const trimmed = part.trim();
    // format: name:type=default
    const eqIdx = trimmed.indexOf('=');
    let nameType: string;
    let defaultVal: unknown;

    if (eqIdx !== -1) {
      nameType = trimmed.slice(0, eqIdx);
      const rawDefault = trimmed.slice(eqIdx + 1);
      defaultVal = parseDefaultValue(rawDefault);
    } else {
      nameType = trimmed;
    }

    const colonIdx = nameType.indexOf(':');
    if (colonIdx === -1) continue;

    const name = nameType.slice(0, colonIdx).trim();
    const type = nameType.slice(colonIdx + 1).trim();
    if (!name || !type) continue;

    result[name] = defaultVal !== undefined ? { type, default: defaultVal } : { type };
  }
  return result;
}

function parseDefaultValue(raw: string): unknown {
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  const num = Number(raw);
  if (!isNaN(num) && raw.trim() !== '') return num;
  return raw;
}

