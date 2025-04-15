import { describe, expect, test, beforeAll, afterAll } from "bun:test";
import type { BundleOptions } from "../src/bundler";
import { bundle } from "../src/bundler";
import { existsSync, unlinkSync } from "fs";
import { join } from "path";

describe("bundler", () => {
    const testDir = join(process.cwd(), "test");
    const testEntryFile = join(testDir, "test-entry.ts");
    const testOutputFile = join(testDir, "test-output.js");

    // Cleanup before and after tests
    beforeAll(() => {
        if (existsSync(testOutputFile)) {
            unlinkSync(testOutputFile);
        }
    });

    afterAll(() => {
        if (existsSync(testOutputFile)) {
            unlinkSync(testOutputFile);
        }
    });

    test("should create a bundle with default options", async () => {
        const options: BundleOptions = {
            entryFile: testEntryFile,
            outFile: testOutputFile
        };

        const outputPath = await bundle(options);
        expect(existsSync(outputPath)).toBe(true);
    });

    test("should create a minified bundle when minify is true", async () => {
        const options: BundleOptions = {
            entryFile: testEntryFile,
            outFile: testOutputFile,
            minify: true
        };

        const outputPath = await bundle(options);
        expect(existsSync(outputPath)).toBe(true);
    });

    test("should create a bundle with sourcemap when sourcemap is true", async () => {
        const options: BundleOptions = {
            entryFile: testEntryFile,
            outFile: testOutputFile,
            sourcemap: true
        };

        const outputPath = await bundle(options);
        expect(existsSync(outputPath)).toBe(true);
        expect(existsSync(outputPath + ".map")).toBe(true);
    });

    test("should throw error for non-existent entry file", async () => {
        const options: BundleOptions = {
            entryFile: "non-existent.ts",
            outFile: testOutputFile
        };

        await expect(bundle(options)).rejects.toThrow();
    });

    test("should use custom target when specified", async () => {
        const options: BundleOptions = {
            entryFile: testEntryFile,
            outFile: testOutputFile,
            target: "es2020"
        };

        const outputPath = await bundle(options);
        expect(existsSync(outputPath)).toBe(true);
    });

    test("should use custom platform when specified", async () => {
        const options: BundleOptions = {
            entryFile: testEntryFile,
            outFile: testOutputFile,
            platform: "node"
        };

        const outputPath = await bundle(options);
        expect(existsSync(outputPath)).toBe(true);
    });
}); 