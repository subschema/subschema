#!/usr/bin/env node

import { resolve } from 'node:path';
import { createComponentSkeleton } from './index.js';
import { parsePropsString } from './utils.js';
import { toKebabCase } from './utils.js';

interface CliArgs {
  name?: string;
  kind?: string;
  props?: string;
  outputDir?: string;
}

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--name':
      case '-n':
        args.name = argv[++i];
        break;
      case '--kind':
      case '-k':
        args.kind = argv[++i];
        break;
      case '--props':
      case '-p':
        args.props = argv[++i];
        break;
      case '-o':
      case '--output':
      case '--output-dir':
        args.outputDir = argv[++i];
        break;
    }
  }
  return args;
}

function validateKind(kind: string): kind is 'field' | 'template' | 'validator' {
  return ['field', 'template', 'validator'].includes(kind);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (!args.name) {
    console.error('Error: --name is required');
    console.error(
      'Usage: create-subschema --name Rating --kind field [--props "max:number=5"] [-o ./output]',
    );
    process.exit(1);
  }

  const kind = args.kind ?? 'field';
  if (!validateKind(kind)) {
    console.error(`Error: --kind must be one of: field, template, validator (got: "${kind}")`);
    process.exit(1);
  }

  const props = args.props ? parsePropsString(args.props) : undefined;
  const outputDir = resolve(args.outputDir ?? `./${toKebabCase(args.name)}-${kind}`);

  console.log(`Creating ${kind} component: ${args.name}`);
  console.log(`Output: ${outputDir}`);

  await createComponentSkeleton({
    name: args.name,
    kind,
    props,
    outputDir,
  });

  console.log('Done! Generated files:');
  console.log(`  cd ${outputDir}`);
  console.log('  pnpm install');
  console.log('  pnpm build');
}

// Only run when executed directly, not when imported for testing
const isDirectRun = process.argv[1]?.endsWith('cli.js') || process.argv[1]?.endsWith('cli.ts');
if (isDirectRun) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
