// Simple test entry file for bundler tests
export function hello() {
    return "Hello, World!";
}

export const version = "1.0.0";

// Test some basic functionality
export function add(a: number, b: number) {
    return a + b;
}

// Test async functionality
export async function fetchData() {
    return { data: "test data" };
} 