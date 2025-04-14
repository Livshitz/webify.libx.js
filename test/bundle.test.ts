import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { bundle } from '../src/bundle';
import { rm, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('Bundler', () => {
    const testDir = join(process.cwd(), 'test');
    const testEntryFile = join(testDir, 'test-entry.ts');
    const testOutputFile = join(testDir, 'test-bundle.js');
    const testNodeOutputFile = join(testDir, 'test-node-bundle.js');

    beforeAll(async () => {
        // Create a test entry file
        await writeFile(testEntryFile, `
            import { libx } from "libx.js/build/bundles/essentials";
            import axios from "axios";
            import { path, process } from '../src/node-polyfills';

            libx.log.isBrowser = true;
            libx.log.isShowTime = false;
            libx.log.isConsole = false;
            libx.log.isShowStacktrace = false;

            export function testFunction() {
                return {
                    path: path.join('test', 'path'),
                    process: process.platform,
                    libx: libx.version,
                    axios: typeof axios
                };
            }
        `);
    });

    afterAll(async () => {
        // Clean up test files
        try {
            await rm(testEntryFile);
            await rm(testOutputFile);
            await rm(testNodeOutputFile);
        } catch (error) {
            // Ignore errors if files don't exist
        }
    });

    describe('bundle function', () => {
        it('should create a browser bundle successfully', async () => {
            const result = await bundle({
                entryFile: testEntryFile,
                outFile: testOutputFile,
                minify: false,
                sourcemap: true,
                platform: 'browser'
            });

            expect(result).toBe(testOutputFile);
            
            // Verify the bundle file exists
            const bundleContent = await readFile(testOutputFile, 'utf-8');
            expect(bundleContent).toContain('webifyBundle');
            expect(bundleContent).toContain('testFunction');
        });

        it('should create a Node.js bundle successfully', async () => {
            const result = await bundle({
                entryFile: testEntryFile,
                outFile: testNodeOutputFile,
                minify: false,
                sourcemap: true,
                platform: 'node'
            });

            expect(result).toBe(testNodeOutputFile);
            
            // Verify the bundle file exists
            const bundleContent = await readFile(testNodeOutputFile, 'utf-8');
            expect(bundleContent).toContain('testFunction');
        });

        it('should handle minification', async () => {
            const minifiedOutput = join(testDir, 'minified-bundle.js');
            await bundle({
                entryFile: testEntryFile,
                outFile: minifiedOutput,
                minify: true,
                sourcemap: false
            });

            const bundleContent = await readFile(minifiedOutput, 'utf-8');
            expect(bundleContent).toContain('webifyBundle');
            
            // Count whitespace characters in minified output
            const newlineCount = (bundleContent.match(/\n/g) || []).length;
            const spaceCount = (bundleContent.match(/\s/g) || []).length;
            
            // Minified code should have minimal whitespace
            expect(newlineCount).toBeLessThan(15); // Allow more newlines for readability
            expect(spaceCount).toBeLessThan(bundleContent.length * 0.15); // Less than 15% of content should be whitespace
            
            // Clean up
            await rm(minifiedOutput);
        });
    });

    describe('CLI', () => {
        it('should handle basic CLI usage', async () => {
            const { stdout } = await execAsync(`bun run src/cli.ts ${testEntryFile} --out ${testOutputFile}`);
            expect(stdout).toContain('Successfully bundled');
            
            const bundleContent = await readFile(testOutputFile, 'utf-8');
            expect(bundleContent).toContain('webifyBundle');
        });

        it('should handle CLI with minification', async () => {
            const { stdout } = await execAsync(`bun run src/cli.ts ${testEntryFile} --out ${testOutputFile} --minify`);
            expect(stdout).toContain('Successfully bundled');
            
            const bundleContent = await readFile(testOutputFile, 'utf-8');
            expect(bundleContent).toContain('webifyBundle');
            
            // Count whitespace characters in minified output
            const newlineCount = (bundleContent.match(/\n/g) || []).length;
            const spaceCount = (bundleContent.match(/\s/g) || []).length;
            
            // Minified code should have minimal whitespace
            expect(newlineCount).toBeLessThan(15); // Allow more newlines for readability
            expect(spaceCount).toBeLessThan(bundleContent.length * 0.15); // Less than 15% of content should be whitespace
        });

        it('should handle CLI with sourcemap', async () => {
            const { stdout } = await execAsync(`bun run src/cli.ts ${testEntryFile} --out ${testOutputFile} --sourcemap`);
            expect(stdout).toContain('Successfully bundled');
            
            // Verify sourcemap file exists
            const sourcemapExists = await Bun.file(`${testOutputFile}.map`).exists();
            expect(sourcemapExists).toBe(true);
            
            // Clean up
            await rm(`${testOutputFile}.map`);
        });
    });
}); 