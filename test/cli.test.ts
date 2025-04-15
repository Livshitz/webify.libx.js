import { describe, expect, test, beforeAll, afterAll } from "bun:test";
import { spawn } from "bun";
import { existsSync, unlinkSync } from "fs";
import { join } from "path";

describe("CLI", () => {
    const testDir = join(process.cwd(), "test");
    const testEntryFile = join(testDir, "test-entry.ts");
    const testOutputFile = join(testDir, "cli-test-output.js");

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

    test("should bundle file with default options", async () => {
        const process = spawn([
            "bun",
            "run",
            "src/cli.ts",
            testEntryFile,
            "--out",
            testOutputFile
        ]);

        const exitCode = await process.exited;
        expect(exitCode).toBe(0);
        expect(existsSync(testOutputFile)).toBe(true);
    });

    test("should bundle file with minification", async () => {
        const process = spawn([
            "bun",
            "run",
            "src/cli.ts",
            testEntryFile,
            "--out",
            testOutputFile,
            "--minify"
        ]);

        const exitCode = await process.exited;
        expect(exitCode).toBe(0);
        expect(existsSync(testOutputFile)).toBe(true);
    });

    test("should bundle file with sourcemap", async () => {
        const process = spawn([
            "bun",
            "run",
            "src/cli.ts",
            testEntryFile,
            "--out",
            testOutputFile,
            "--sourcemap"
        ]);

        const exitCode = await process.exited;
        expect(exitCode).toBe(0);
        expect(existsSync(testOutputFile)).toBe(true);
        expect(existsSync(testOutputFile + ".map")).toBe(true);
    });

    test("should bundle file with UMD format", async () => {
        const process = spawn([
            "bun",
            "run",
            "src/cli.ts",
            testEntryFile,
            "--out",
            testOutputFile,
            "--format",
            "umd"
        ]);

        const exitCode = await process.exited;
        expect(exitCode).toBe(0);
        expect(existsSync(testOutputFile)).toBe(true);
        
        // Verify UMD format
        const content = await Bun.file(testOutputFile).text();
        expect(content).toContain("(function (root, factory) {");
        expect(content).toContain("if (typeof define === 'function' && define.amd)");
        expect(content).toContain("if (typeof exports === 'object')");
        expect(content).toContain("root.bundle = factory()");
    });

    test("should fail with non-existent entry file", async () => {
        const process = spawn([
            "bun",
            "run",
            "src/cli.ts",
            "non-existent.ts",
            "--out",
            testOutputFile
        ]);

        const exitCode = await process.exited;
        expect(exitCode).not.toBe(0);
    });

    test("should fail with missing entry file", async () => {
        const process = spawn([
            "bun",
            "run",
            "src/cli.ts",
            "--out",
            testOutputFile
        ]);

        const exitCode = await process.exited;
        expect(exitCode).not.toBe(0);
    });
}); 