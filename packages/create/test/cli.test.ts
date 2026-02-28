import { describe, it, expect } from 'vitest';
import { parseArgs } from '../src/cli.js';

describe('CLI parseArgs', () => {
  it('should parse --name flag', () => {
    const args = parseArgs(['--name', 'Rating']);
    expect(args.name).toBe('Rating');
  });

  it('should parse short -n flag', () => {
    const args = parseArgs(['-n', 'Rating']);
    expect(args.name).toBe('Rating');
  });

  it('should parse --kind flag', () => {
    const args = parseArgs(['--kind', 'field']);
    expect(args.kind).toBe('field');
  });

  it('should parse --props flag', () => {
    const args = parseArgs(['--props', 'max:number=5']);
    expect(args.props).toBe('max:number=5');
  });

  it('should parse -o output flag', () => {
    const args = parseArgs(['-o', './my-output']);
    expect(args.outputDir).toBe('./my-output');
  });

  it('should parse all flags together', () => {
    const args = parseArgs([
      '--name', 'Rating',
      '--kind', 'field',
      '--props', 'max:number=5,color:string',
      '-o', './output',
    ]);
    expect(args.name).toBe('Rating');
    expect(args.kind).toBe('field');
    expect(args.props).toBe('max:number=5,color:string');
    expect(args.outputDir).toBe('./output');
  });

  it('should return empty object for no args', () => {
    const args = parseArgs([]);
    expect(args.name).toBeUndefined();
    expect(args.kind).toBeUndefined();
  });
});

