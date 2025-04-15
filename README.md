# Webify.libx.js

A modern JavaScript/TypeScript bundler built with Bun and esbuild.

## Features

- 📦 Bundle JavaScript and TypeScript files
- 🔍 Source map generation
- ⚡ Fast bundling with esbuild
- 👀 Watch mode for development
- 🎯 Configurable target environments
- 📝 Minification support
- 🔄 Multiple output formats (CJS, ESM, IIFE, UMD)

## Installation

```bash
# Install globally (optional)
bun install -g webify.libx.js

# Or install as a project dependency (optional)
bun add webify.libx.js

# Or use npx to run without installation
npx webify.libx.js
```

## Usage

```bash
# Basic usage with npx
npx webify.libx.js src/index.ts

# Or if installed globally
webify.libx.js src/index.ts

# Specify output file
npx webify.libx.js src/index.ts -o dist/bundle.js

# Enable minification and source maps
npx webify.libx.js src/index.ts -m -s

# Watch mode for development
npx webify.libx.js src/index.ts -w
```

## Options

- `-h, --help` - Show help message
- `-v, --version` - Show version information
- `-o, --out <file>` - Output file path (default: dist/bundle.js)
- `-m, --minify` - Minify the output
- `-s, --sourcemap` - Generate source maps
- `-t, --target <env>` - Target environment (default: es2017)
- `-w, --watch` - Watch input file for changes
- `-f, --format <fmt>` - Output format (cjs, esm, iife, or umd) (default: cjs)

## Examples

```bash
# Basic usage
npx webify.libx.js src/index.ts

# Bundle as ESM module
npx webify.libx.js src/index.ts -f esm

# Bundle as IIFE (immediately-invoked function expression)
npx webify.libx.js src/index.ts -f iife

# Bundle as UMD (Universal Module Definition)
npx webify.libx.js src/index.ts -f umd

# Bundle with minification and source maps
npx webify.libx.js src/index.ts -m -s

# Watch mode for development
npx webify.libx.js src/index.ts -w
```

## Module Formats

The bundler supports multiple output formats:

- **CJS** (CommonJS): For Node.js environments
- **ESM** (ECMAScript Modules): For modern browsers and Node.js with ES modules
- **IIFE** (Immediately Invoked Function Expression): For browser environments without module support
- **UMD** (Universal Module Definition): For environments that support AMD, CommonJS, or global variables

The UMD format is particularly useful when you need your code to work in multiple environments:
- AMD loaders like RequireJS
- CommonJS environments like Node.js
- Browser environments via global variables
- ES modules via bundlers that support UMD

## Development

To install dependencies:

```bash
bun install
```

To run in development mode:

```