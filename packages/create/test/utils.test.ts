import { describe, it, expect } from 'vitest';
import { parsePropsString, resolveTemplateData, toKebabCase, toCamelCase } from '../src/utils.js';

describe('parsePropsString', () => {
  it('should parse name:type=default format', () => {
    const result = parsePropsString('max:number=5');
    expect(result).toEqual({ max: { type: 'number', default: 5 } });
  });

  it('should parse multiple props', () => {
    const result = parsePropsString('max:number=5,color:string');
    expect(result).toEqual({
      max: { type: 'number', default: 5 },
      color: { type: 'string' },
    });
  });

  it('should parse boolean defaults', () => {
    const result = parsePropsString('enabled:boolean=true');
    expect(result).toEqual({ enabled: { type: 'boolean', default: true } });
  });

  it('should return empty for empty string', () => {
    expect(parsePropsString('')).toEqual({});
  });
});

describe('resolveTemplateData', () => {
  it('should resolve field template data', () => {
    const data = resolveTemplateData({
      name: 'Rating',
      kind: 'field',
      props: { max: { type: 'number', default: 5 } },
      outputDir: '/tmp/test',
    });
    expect(data.fullName).toBe('RatingField');
    expect(data.nameCamel).toBe('rating');
    expect(data.packageName).toBe('rating-field');
    expect(data.props).toHaveLength(1);
    expect(data.props[0].hasDefault).toBe(true);
  });
});

describe('toKebabCase', () => {
  it('should convert PascalCase to kebab-case', () => {
    expect(toKebabCase('RatingField')).toBe('rating-field');
    expect(toKebabCase('MyComponent')).toBe('my-component');
  });
});

describe('toCamelCase', () => {
  it('should convert PascalCase to camelCase', () => {
    expect(toCamelCase('Rating')).toBe('rating');
    expect(toCamelCase('MyComponent')).toBe('myComponent');
  });
});
