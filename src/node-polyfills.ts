// Polyfills for Node.js built-in modules
import type { Buffer } from 'node:buffer';
import type { Stream } from 'node:stream';
import type { EventEmitter } from 'node:events';
import type * as NodePath from 'node:path';
import type * as NodeFS from 'node:fs';
import type * as NodeOS from 'node:os';
import type * as NodeZlib from 'node:zlib';
import type * as NodeHttp from 'node:http';
import type * as NodeHttps from 'node:https';
import type * as NodeUrl from 'node:url';
import type * as NodeQuerystring from 'node:querystring';
import type * as NodeAssert from 'node:assert';
import type * as NodeTimers from 'node:timers';
import type * as NodeUtil from 'node:util';

declare global {
    interface Global {
        Buffer: typeof Buffer;
        process: NodeJS.Process;
        util: typeof NodeUtil;
        stream: typeof Stream;
        events: typeof EventEmitter;
        path: typeof NodePath;
        fs: typeof NodeFS;
        os: typeof NodeOS;
        crypto: Crypto;
        zlib: typeof NodeZlib;
        http: typeof NodeHttp;
        https: typeof NodeHttps;
        url: typeof NodeUrl;
        querystring: typeof NodeQuerystring;
        assert: typeof NodeAssert;
        timers: typeof NodeTimers;
        console: Console;
    }
}

// Browser-compatible polyfills
const browserPolyfills = {
    process: {
        arch: 'browser',
        platform: 'browser',
        version: 'browser',
        env: {},
        cwd: () => '/',
        nextTick: (callback: () => void) => setTimeout(callback, 0),
    },
    Buffer: {
        from: (data: string | ArrayBuffer) => {
            if (typeof data === 'string') {
                return new TextEncoder().encode(data);
            }
            return new Uint8Array(data);
        },
        isBuffer: (obj: any) => obj instanceof Uint8Array,
    },
    path: {
        dirname: (p: string) => p.split('/').slice(0, -1).join('/') || '/',
        basename: (p: string) => p.split('/').pop() || '',
        extname: (p: string) => {
            const match = p.match(/\.[^.]+$/);
            return match ? match[0] : '';
        },
        join: (...paths: string[]) => paths.join('/').replace(/\/+/g, '/'),
        resolve: (...paths: string[]) => '/' + paths.join('/').replace(/\/+/g, '/'),
    },
    util: {
        inspect: (obj: any) => JSON.stringify(obj, null, 2),
        format: (...args: any[]) => args.map(String).join(' '),
    },
    events: {
        EventEmitter: class EventEmitter {
            private listeners: Map<string, Function[]> = new Map();
            on(event: string, listener: Function) {
                if (!this.listeners.has(event)) {
                    this.listeners.set(event, []);
                }
                this.listeners.get(event)!.push(listener);
                return this;
            }
            emit(event: string, ...args: any[]) {
                const listeners = this.listeners.get(event);
                if (listeners) {
                    listeners.forEach(listener => listener(...args));
                }
                return this;
            }
        },
    },
};

// Export Node.js built-in modules or their browser equivalents
export const buffer = (globalThis as any).Buffer || browserPolyfills.Buffer;
export const process = (globalThis as any).process || browserPolyfills.process;
export const util = (globalThis as any).util || browserPolyfills.util;
export const stream = (globalThis as any).stream || {};
export const events = (globalThis as any).events || browserPolyfills.events;
export const path = (globalThis as any).path || browserPolyfills.path;
export const fs = (globalThis as any).fs || {};
export const os = (globalThis as any).os || {};
export const crypto = (globalThis as any).crypto || {};
export const zlib = (globalThis as any).zlib || {};
export const http = (globalThis as any).http || {};
export const https = (globalThis as any).https || {};
export const url = (globalThis as any).url || {};
export const querystring = (globalThis as any).querystring || {};
export const assert = (globalThis as any).assert || {};
export const timers = (globalThis as any).timers || {};
export const console = (globalThis as any).console || window.console; 