import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, readFile, rm, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createComponentSkeleton } from '../src/index.js';

describe('createComponentSkeleton', () => {
  let outputDir: string;

  beforeEach(async () => {
    outputDir = await mkdtemp(join(tmpdir(), 'subschema-create-test-'));
  });

  afterEach(async () => {
    await rm(outputDir, { recursive: true, force: true });
  });

  it('should generate a field component with all expected files', async () => {
    await createComponentSkeleton({
      name: 'Rating',
      kind: 'field',
      props: { max: { type: 'number', default: 5 } },
      outputDir,
    });

    const expectedFiles = [
      'package.json',
      'tsconfig.json',
      'README.md',
      'llms.txt',
      'src/types.ts',
      'src/index.ts',
      'src/RatingField.tsx',
      'src/schema.tsp',
      'test/RatingField.test.tsx',
    ];

    for (const file of expectedFiles) {
      const content = await readFile(join(outputDir, file), 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }
  });

  it('should generate correct package.json with peer deps', async () => {
    await createComponentSkeleton({
      name: 'Rating',
      kind: 'field',
      outputDir,
    });

    const pkg = JSON.parse(await readFile(join(outputDir, 'package.json'), 'utf-8'));
    expect(pkg.name).toBe('@subschema/rating-field');
    expect(pkg.peerDependencies).toHaveProperty('@subschema/react');
    expect(pkg.peerDependencies).toHaveProperty('@speajus/diblob');
    expect(pkg.peerDependencies).toHaveProperty('react');
    expect(pkg.type).toBe('module');
  });

  it('should generate correct llms.txt content', async () => {
    await createComponentSkeleton({
      name: 'Rating',
      kind: 'field',
      props: { max: { type: 'number', default: 5 } },
      outputDir,
    });

    const llmsTxt = await readFile(join(outputDir, 'llms.txt'), 'utf-8');
    expect(llmsTxt).toContain('# RatingField');
    expect(llmsTxt).toContain('Type: Rating');
    expect(llmsTxt).toContain('max');
    expect(llmsTxt).toContain('Registration:');
  });

  it('should generate README.md with matching content from llms.txt data', async () => {
    await createComponentSkeleton({
      name: 'Color',
      kind: 'field',
      props: { palette: { type: 'string' } },
      outputDir,
    });

    const readme = await readFile(join(outputDir, 'README.md'), 'utf-8');
    expect(readme).toContain('# @subschema/color-field');
    expect(readme).toContain('palette');
    expect(readme).toContain('Registration');
  });

  it('should generate a template component', async () => {
    await createComponentSkeleton({
      name: 'Card',
      kind: 'template',
      outputDir,
    });

    const component = await readFile(join(outputDir, 'src/CardTemplate.tsx'), 'utf-8');
    expect(component).toContain('CardTemplate');
    expect(component).toContain('TemplateComponentProps');

    const barrel = await readFile(join(outputDir, 'src/index.ts'), 'utf-8');
    expect(barrel).toContain('CardTemplate');
  });

  it('should generate a validator function', async () => {
    await createComponentSkeleton({
      name: 'MinLength',
      kind: 'validator',
      props: { min: { type: 'number', default: 1 } },
      outputDir,
    });

    const fn = await readFile(join(outputDir, 'src/MinLengthValidator.ts'), 'utf-8');
    expect(fn).toContain('minLengthValidator');
    expect(fn).toContain('ValidatorConfig');

    const barrel = await readFile(join(outputDir, 'src/index.ts'), 'utf-8');
    expect(barrel).toContain('minLengthValidator');
  });
});

