#!/usr/bin/env bun

import { parseArgs } from 'node:util';
import { bundle } from './bundler.js';
import type { BundleOptions } from './bundler.js';
import { watch, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';


const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    help: {
      type: 'boolean',
      short: 'h',
    },
    version: {
      type: 'boolean',
      short: 'v',
    },
    out: {
      type: 'string',
      short: 'o',
      description: 'Output file path',
    },
    minify: {
      type: 'boolean',
      short: 'm',
      description: 'Minify the output (including mangling)',
    },
    'keep-identifiers': {
      type: 'boolean',
      short: 'k',
      description: 'Minify without mangling identifiers (implies -m)',
    },
    sourcemap: {
      type: 'boolean',
      short: 's',
      description: 'Generate source maps',
    },
    target: {
      type: 'string',
      short: 't',
      description: 'Target environment (es2017, es2020, etc.)',
    },
    watch: {
      type: 'boolean',
      short: 'w',
      description: 'Watch input file for changes',
    },
    format: {
      type: 'string',
      short: 'f',
      description: 'Output format (cjs, esm, iife, or umd)',
    },
  },
  allowPositionals: true,
});

if (values.help) {
  console.log(`
Usage: webify.libx.js [options] [files...]

A modern JavaScript/TypeScript bundler

Options:
  -h, --help           Show this help message
  -v, --version        Show version information
  -o, --out <file>     Output file path (default: dist/bundle.js)
  -m, --minify         Minify the output (including mangling)
  -k, --keep-identifiers Minify without mangling identifiers (implies -m)
  -s, --sourcemap      Generate source maps
  -t, --target <env>   Target environment (default: es2017)
  -w, --watch          Watch input file for changes
  -f, --format <fmt>   Output format (cjs, esm, iife, or umd) (default: cjs)

Examples:
  webify.libx.js src/index.ts
  webify.libx.js src/index.ts -o dist/bundle.js
  webify.libx.js src/index.ts -m -s
  webify.libx.js src/index.ts -f esm
  webify.libx.js src/index.ts -f umd
  `);
  process.exit(0);
}

if (values.version) {
  const pkgStr = await readFileSync(join(__dirname, '..', 'package.json'), 'utf8');
  const pkg = JSON.parse(pkgStr);
  console.log(`webify.libx.js v${pkg.version}`);
  process.exit(0);
}

if (positionals.length === 0) {
  console.error('Error: No input files specified');
  console.error('Use --help for usage information');
  process.exit(1);
}

// Ensure dist directory exists and set default output path
const defaultOutDir = 'dist';
const defaultOutFile = 'bundle.js';

const options: BundleOptions = {
  entryFile: positionals[0],
  outFile: values.out || join(defaultOutDir, defaultOutFile),
  minify: values.minify,
  keepIdentifiers: values['keep-identifiers'],
  sourcemap: values.sourcemap,
  target: values.target,
  format: values.format as 'cjs' | 'esm' | 'iife' | 'umd' | undefined,
};

async function runBundle() {
  try {
    // Create output directory if it doesn't exist
    const outDir = options.outFile ? join(options.outFile, '..') : defaultOutDir;
    await mkdir(outDir, { recursive: true });

    const outputPath = await bundle(options);
    console.log(`✔ Successfully bundled! Output file: ${outputPath}`);
  } catch (error) {
    console.error(error);
    if (!values.watch) {
      process.exit(1);
    }
  }
}

if (values.watch) {
  console.log(`👀 Watching ${options.entryFile} for changes...`);
  runBundle();
  
  const watcher = watch(options.entryFile);
  for await (const event of watcher) {
    if (event.eventType === 'change') {
      console.log('\n📝 File changed, rebundling...');
      await runBundle();
    }
  }
} else {
  await runBundle();
}