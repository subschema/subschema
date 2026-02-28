import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { aggregateLlmsTxt } from '../src/aggregator.js';

describe('aggregateLlmsTxt', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'subschema-agg-test-'));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it('should combine multiple llms.txt files', async () => {
    const pkg1 = join(tempDir, 'pkg1');
    const pkg2 = join(tempDir, 'pkg2');
    await mkdir(pkg1, { recursive: true });
    await mkdir(pkg2, { recursive: true });

    await writeFile(join(pkg1, 'llms.txt'), '# RatingField\nType: Rating\n');
    await writeFile(join(pkg2, 'llms.txt'), '# ColorField\nType: Color\n');

    const result = await aggregateLlmsTxt([pkg1, pkg2]);
    expect(result).toContain('# Subschema Components');
    expect(result).toContain('# RatingField');
    expect(result).toContain('# ColorField');
  });

  it('should skip directories without llms.txt', async () => {
    const pkg1 = join(tempDir, 'pkg1');
    const pkg2 = join(tempDir, 'pkg2');
    await mkdir(pkg1, { recursive: true });
    await mkdir(pkg2, { recursive: true });

    await writeFile(join(pkg1, 'llms.txt'), '# RatingField\nType: Rating\n');
    // pkg2 has no llms.txt

    const result = await aggregateLlmsTxt([pkg1, pkg2]);
    expect(result).toContain('# RatingField');
    expect(result).not.toContain('ColorField');
  });

  it('should return placeholder when no files found', async () => {
    const result = await aggregateLlmsTxt([join(tempDir, 'nonexistent')]);
    expect(result).toContain('No component references found');
  });
});

