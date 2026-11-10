import { TextEncoder as NodeTextEncoder } from 'node:util';

class JSDOMCompatibleTextEncoder extends NodeTextEncoder {
  encode(input) {
    const result = super.encode(input);

    return new globalThis.Uint8Array(result.buffer, result.byteOffset, result.byteLength);
  }
}

globalThis.TextEncoder = JSDOMCompatibleTextEncoder;

if (globalThis.window) {
  globalThis.window.TextEncoder = JSDOMCompatibleTextEncoder;
}
