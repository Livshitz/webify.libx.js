// $ webify.libx.js ./test/bundle.ts -o dist/bundle.js

import axios from "axios";
import { libx } from "libx.js/build/bundles/essentials";
import { buffer, path, process } from '../src/node-polyfills';

libx.log.isBrowser = true;
libx.log.isShowTime = false;
libx.log.isConsole = false;
libx.log.isShowStacktrace = false;
// libx.log.isShowPrefix = false;


libx.log.v("Hello, world! 4");

axios.get("https://jsonplaceholder.typicode.com/todos/1").then((res) => {
	console.log(res.data);
});

// Test various Node.js built-in modules
function runTests() {
    console.log('Testing browser environment:');
	libx.log.v("Hello, world!");
    
    // Test path operations
    const testPath = '/test/path/file.js';
    console.log('Path operations:', {
        dirname: testPath.split('/').slice(0, -1).join('/') || '/',
        basename: testPath.split('/').pop() || '',
        extension: testPath.match(/\.[^.]+$/)?.[0] || ''
    });
    
    // Test Buffer-like operations
    const text = 'Hello, World!';
    const encoded = new TextEncoder().encode(text);
    const decoded = new TextDecoder().decode(encoded);
    console.log('Buffer-like operations:', {
        original: text,
        encoded: Array.from(encoded),
        decoded: decoded
    });
    
    // Test environment info
    console.log('Environment:', {
        platform: typeof window !== 'undefined' ? 'browser' : 'node',
        userAgent: navigator.userAgent
    });
}

// Expose the test function to the global scope
if (typeof window !== 'undefined') {
    (window as any).runTests = runTests;
	//@ts-ignore
	window.libx = libx;
} else {
    // runTests();
}

// Export for Node.js usage
export { runTests };

export { axios, libx };