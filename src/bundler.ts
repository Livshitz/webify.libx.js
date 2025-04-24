#!/usr/bin/env node
/* eslint-disable no-console */
import { build } from "esbuild";
import path from "path";

/**

A simple CLI to bundle a .ts file and its dependencies into a single .js
usable in the browser. Requires esbuild.
Usage:
node dist/cli.js <entryFile.ts> [--out <outputFile.js>]
Example:
node dist/cli.js src/index.ts --out bundle.js
(Outputs a bundled, browser-friendly "bundle.js" in the current directory) */

export interface BundleOptions {
	entryFile: string;
	outFile?: string;
	minify?: boolean;
	sourcemap?: boolean;
	target?: string;
	platform?: 'browser' | 'node' | 'neutral';
	format?: 'cjs' | 'esm' | 'iife' | 'umd';
}

export async function bundle(options: BundleOptions) {
	const {
		entryFile,
		outFile = "bundle.js",
		minify = false,
		sourcemap = false,
		target = "es2017",
		platform = "browser",
		format = "cjs"
	} = options;

	try {
		const result = await build({
			entryPoints: [entryFile],
			outfile: outFile,
			bundle: true,
			platform,
			target: [target],
			minify: minify,
			sourcemap,
			format: format === 'umd' ? 'iife' : format,
			globalName: format === 'umd' ? 'bundle' : undefined,
			define: {
				'process.env.NODE_ENV': '"production"',
				'global': 'window',
				// 'process.versions': '{}',
				'process.versions.node': '"20.0.0"',
			},
			minifyWhitespace: minify,
			minifyIdentifiers: minify,
			minifySyntax: minify,
			banner: {
				js: `(function(){if(typeof globalThis.process==='undefined'){globalThis.process={env:{},versions:{node:'20.0.0'}}}})();`,
			},
			plugins: [{
				name: 'browser-polyfills',
				setup(build) {
					// Provide empty implementations for Node.js built-in modules
					build.onResolve({ filter: /^(buffer|process|util|stream|events|path|fs|os|crypto|zlib|http|https|url|querystring|assert|timers)$/ }, args => {
						return { path: 'empty-module', namespace: 'browser-polyfills' };
					});

					build.onLoad({ filter: /.*/, namespace: 'browser-polyfills' }, () => {
						return {
							contents: 'module.exports = {};',
							loader: 'js',
						};
					});
				},
			}],
		});

		// If format is UMD, wrap the output with UMD wrapper
		if (format === 'umd') {
			const fs = await import('node:fs/promises');
			const path = await import('node:path');
			const outputPath = path.resolve(outFile);
			const content = await fs.readFile(outputPath, 'utf-8');
			
			// Create UMD wrapper
			const umdWrapper = `(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return factory();
    });
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.bundle = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  ${content}
  return bundle;
}));`;

			await fs.writeFile(outputPath, umdWrapper);
		}

		return path.resolve(outFile);
	} catch (error) {
		throw new Error(`Build failed: ${error}`);
	}
}

// Keep the CLI functionality for direct usage
if (require.main === module) {
	const args = process.argv.slice(2);

	if (!args.length) {
		console.error("Error: No .ts entry file provided.");
		process.exit(1);
	}

	let entryFile: string | undefined;
	let outFile = "bundle.js";

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (!arg.startsWith("--")) {
			if (!entryFile) {
				entryFile = arg;
			} else {
				console.error(`Error: Unexpected argument "${arg}"`);
				process.exit(1);
			}
		} else if (arg === "--out") {
			if (i + 1 < args.length) {
				outFile = args[i + 1];
				i++;
			} else {
				console.error("Error: Missing value for --out");
				process.exit(1);
			}
		}
	}

	if (!entryFile) {
		console.error("Error: Missing entry file.");
		process.exit(1);
	}

	bundle({ entryFile, outFile })
		.then((outputPath) => {
			console.log(`✔ Successfully bundled! Output file: ${outputPath}`);
		})
		.catch((error) => {
			console.error(error);
			process.exit(1);
		});
}