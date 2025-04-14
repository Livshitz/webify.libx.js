// Polyfills for Node.js built-in modules
export const buffer = globalThis.Buffer || require('buffer').Buffer;
export const process = globalThis.process || require('process');
export const util = globalThis.util || require('util');
export const stream = globalThis.stream || require('stream');
export const events = globalThis.events || require('events');
export const path = globalThis.path || require('path');
export const fs = globalThis.fs || require('fs');
export const os = globalThis.os || require('os');
export const crypto = globalThis.crypto || require('crypto');
export const zlib = globalThis.zlib || require('zlib');
export const http = globalThis.http || require('http');
export const https = globalThis.https || require('https');
export const url = globalThis.url || require('url');
export const querystring = globalThis.querystring || require('querystring');
export const assert = globalThis.assert || require('assert');
export const timers = globalThis.timers || require('timers');
export const console = globalThis.console || require('console'); 