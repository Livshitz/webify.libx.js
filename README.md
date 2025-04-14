# Webify.libx.js

A modern JavaScript/TypeScript bundler built with Bun and esbuild.

## Features

- 📦 Bundle JavaScript and TypeScript files
- 🔍 Source map generation
- ⚡ Fast bundling with esbuild
- 👀 Watch mode for development
- 🎯 Configurable target environments
- 📝 Minification support

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

## Development

To install dependencies:

```bash
bun install
```

To run in development mode:

```bash
bun run dev
```

To run in watch mode:

```bash
bun run watch
```

## License

MIT
