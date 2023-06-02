// Jest needs to polyfill TestEncoder with jsdom
const { TextEncoder, TextDecoder } = require('util');
Object.assign(global, { TextDecoder, TextEncoder });
