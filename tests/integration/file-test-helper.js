import * as vitest from 'vitest';
import path from 'path';
import { open } from 'node:fs/promises';
import { fileURLToPath } from 'url';

//================================
// Typedefs
//================================

/**
 * @typedef {import('./file-test-helper.d.ts').FileTestHelper} FileTestHelper
 */

//================================
// Constants
//================================

const rootDirectoryPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** @type {FileTestHelper} */
const fileTestHelper = Object.freeze({
  rootDirectoryPath: rootDirectoryPath,
  tryReadMetadataAsync: tryReadMetadataAsync,
  testIsExistsAsync: testIsExistsAsync,
  testIsPngAsync: testIsPngAsync,
  testHasStrictDimensionsAsync: testHasStrictDimensionsAsync
});

//================================
// Exports
//================================

export default fileTestHelper;

//================================
// Private Functions
//================================

/**
 * @private
 * @async
 *
 * Asynchronously attempts to read a 24-byte binary metadata chunk from the beginning of a file.
 *
 * This low-overhead file system utility opens a designated file handle in a strict read-only mode, allocates a fixed 24-byte buffer pool, and extracts the initial byte sequence payload. It ensures
 * resource sanitation by securely closing the active file handle after execution. If any disk error, permission restriction, or missing file exception occurs, it intercepts the failure internally
 * and yields a fallback empty state instead of crashing the process thread.
 *
 * @param {string} path - The absolute or relative system disk location pointer to extract metadata from.
 * @param {boolean} [readFull=false] - An optional configuration flag indicating whether to extract the complete file payload instead of the initial 24-byte fragment.
 *
 * @returns {Promise<Buffer<ArrayBuffer> | null>} A promise resolving to a 24-byte allocated data Buffer snapshot if successful; otherwise, `null`.
 */
async function tryReadMetadataAsync(path, readFull = false) {
  try {
    const handle = await open(path, 'r');

    /** @type {Buffer<ArrayBuffer>} */
    let buffer;

    if (readFull) {
      buffer = await handle.readFile();
    }
    else {
      buffer = Buffer.alloc(24);

      await handle.read(buffer, 0, 24, 0);
    }

    await handle.close();

    return buffer;
  }
  catch(e) {
    console.error(e);

    return null;
  }
}

/**
 * @private
 * @async
 *
 * Asserts that a deferred file metadata operation resolves successfully to a valid data payload.
 *
 * This asynchronous test utility acts as a promise resolution validator within the asset suite. It awaits the completion of the provided metadata operation and leverages Vitest to strictly
 * verify that the resulting outcome is populated (not null), confirming that the target asset was successfully found and scanned by the file engine.
 *
 * @param {Promise<Buffer<ArrayBuffer> | null>} metadataPromise - A promise representing the pending file metadata scan operation.
 *
 * @returns {Promise<void>} A promise that resolves once the Vitest validation assertion is complete.
 */
async function testIsExistsAsync(metadataPromise) {
  const metadata = await metadataPromise;

  vitest.expect(metadata).not.toBeNull();
}

/**
 * @private
 * @async
 *
 * Asserts that a deferred file metadata snapshot matches the standard PNG binary magic number signature.
 *
 * This asynchronous test utility evaluates the structural container format of a file asset. It awaits the resolution of the metadata buffer promise, extracts the initial 8-byte preamble sequence, and
 * utilizes Vitest to strictly match its hexadecimal string representation against the official PNG magic byte benchmark (`89504e470d0a1a0a`).
 *
 * @param {Promise<Buffer<ArrayBuffer> | null>} metadataPromise - A promise representing the pending 24-byte file metadata extraction pass.
 *
 * @returns {Promise<void>} A promise that resolves once the Vitest signature validation assertion is complete.
 */
async function testIsPngAsync(metadataPromise) {
  const metadata = await metadataPromise;

  vitest.expect(metadata).not.toBeNull();
  vitest.expect(metadata.toString('hex', 0, 8)).toBe('89504e470d0a1a0a');
}

/**
 * @private
 * @async
 *
 * Asserts that a deferred PNG file metadata buffer matches the exact expected pixel width and height dimensions.
 *
 * This asynchronous test utility evaluates the structural image headers of an asset file. It awaits the metadata buffer resolution and reads 32-bit big-endian integers (`readInt32BE`) from the standard
 * PNG IHDR chunk location boundaries. It validates bytes 16–19 against the target width, and bytes 20–23 against the target height, ensuring strict dimension compliance within Vitest.
 *
 * @param {Promise<Buffer<ArrayBuffer> | null>} metadataPromise - A promise representing the pending 24-byte binary file header snapshot.
 * @param {number} width - The explicit expected pixel width criteria boundary.
 * @param {number} height - The explicit expected pixel height criteria boundary.
 *
 * @returns {Promise<void>} A promise that resolves once both structural dimension assertions are complete.
 */
async function testHasStrictDimensionsAsync(metadataPromise, width, height) {
  const metadata = await metadataPromise;

  vitest.expect(metadata).not.toBeNull();
  vitest.expect(metadata.readInt32BE(16)).toBe(width);
  vitest.expect(metadata.readInt32BE(20)).toBe(height);
}
