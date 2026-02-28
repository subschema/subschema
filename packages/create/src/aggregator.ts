import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Read all `llms.txt` files from the given package directories
 * and compose them into a single reference document.
 */
export async function aggregateLlmsTxt(packageDirs: string[]): Promise<string> {
  const sections: string[] = [];

  for (const dir of packageDirs) {
    try {
      const content = await readFile(join(dir, 'llms.txt'), 'utf-8');
      sections.push(content.trim());
    } catch {
      // Skip directories without llms.txt
    }
  }

  if (sections.length === 0) {
    return '# Subschema Components\n\nNo component references found.\n';
  }

  return `# Subschema Components\n\n${sections.join('\n\n')}\n`;
}

