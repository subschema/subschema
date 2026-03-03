import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import type { CreateOptions } from './types.js';
import { resolveTemplateData } from './utils.js';
import { generateFiles } from './templates/index.js';

export type { CreateOptions, TemplateData, PropDef } from './types.js';
export { resolveTemplateData, parsePropsString } from './utils.js';
export { generateFiles } from './templates/index.js';
export { aggregateLlmsTxt } from './aggregator.js';

/**
 * Create a component skeleton package.
 *
 * Generates a complete, buildable package directory with all necessary files
 * for a subschema field, template, or validator component.
 */
export async function createComponentSkeleton(options: CreateOptions): Promise<void> {
  const data = resolveTemplateData(options);
  const files = generateFiles(data);

  for (const file of files) {
    const fullPath = join(options.outputDir, file.path);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, file.content, 'utf-8');
  }
}
