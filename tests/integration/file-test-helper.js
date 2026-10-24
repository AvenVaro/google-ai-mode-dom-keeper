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

const icon16FileName = 'icon-google-ai-mode-dom-keeper-16x16.png';
const icon32FileName = 'icon-google-ai-mode-dom-keeper-32x32.png';
const icon48FileName = 'icon-google-ai-mode-dom-keeper-48x48.png';
const icon128FileName = 'icon-google-ai-mode-dom-keeper-128x128.png';

const rootDirectoryPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** @type {FileTestHelper} */
const fileTestHelper = Object.freeze({
  icon16FileName: icon16FileName,
  icon32FileName: icon32FileName,
  icon48FileName: icon48FileName,
  icon128FileName: icon128FileName,
  rootDirectoryPath: rootDirectoryPath,
  tryReadFileAsync: tryReadFileAsync,
  tryReadJsonFileAsync: tryReadJsonFileAsync,
  tryReadMetadataAsync: tryReadMetadataAsync,
  testIsExists: testIsExistsAsync,
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
 *
 * @returns {Promise<Buffer<ArrayBuffer> | null>} A promise resolving to a 24-byte allocated data Buffer snapshot if successful; otherwise, `null`.
 */
async function tryReadMetadataAsync(path) {
  try {
    const handle = await open(path, 'r');
    const buffer = Buffer.alloc(24);

    await handle.read(buffer, 0, 24, 0);
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
 * Asynchronously attempts to read the entire contents of a file into a Buffer.
 *
 * This utility opens a file handle in read-only mode, extracts its full binary stream payload, and ensures proper resource sanitation by securely closing the file handle afterward. If any
 * disk exceptions, missing file errors (ENOENT), or permission restrictions occur, it intercepts the failure, logs the error stack trace to the console, and returns a fallback empty state
 * instead of breaking the execution thread.
 *
 * @param {string} path - The absolute or relative file-system path to the targeted file asset.
 *
 * @returns {Promise<Buffer<ArrayBuffer> | null>} A promise resolving to the file's raw binary Buffer content if successful; otherwise, `null`.
 */
async function tryReadFileAsync(path) {
  try {
    const handle = await open(path, 'r');
    const buffer = await handle.readFile();

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
 * Asynchronously attempts to read and parse the entire contents of a file as JSON.
 *
 * This asset parsing utility opens a file handle in a strict read-only mode, extracts its full binary stream payload, and ensures proper resource sanitation by securely closing the active handle
 * afterward. It decodes the resulting buffer into a standardized UTF-8 string string slice and compiles it into a structured JavaScript object. If any disk errors, missing file conditions, or structural
 * JSON validation faults occur, it intercepts the failure internally, logs the error stack trace to the console, and yields a fallback empty state instead of breaking the execution thread.
 *
 * @param {string} path - The absolute or relative file-system path to the targeted JSON configuration asset.
 *
 * @returns {Promise<any | null>} A promise resolving to the fully parsed JavaScript object structure if successful; otherwise, `null`.
 */
async function tryReadJsonFileAsync(path) {
  try {
    const handle = await open(path, 'r');
    const buffer = await handle.readFile();

    await handle.close();

    return JSON.parse(buffer.toString('utf8'));
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
 * Asynchronously awaits a deferred metadata operation and passes the resolved payload for existence verification.
 *
 * This test runner utility unwraps a pending metadata promise pass and forwards the underlying binary buffer, alongside descriptive file identifiers, down to the synchronous assertion engine to execute disk presence
 * validations across macro-task ticks.
 *
 * @param {Promise<Buffer<ArrayBuffer> | null>} metadataPromise - A promise representing the pending asynchronous file metadata extraction sweep.
 * @param {string} fileName - The human-readable file identifier name used to populate descriptive error outputs on failure.
 * @param {string} filePath - The system absolute or relative disk location pointer under evaluation.
 *
 * @returns {Promise<void>} A promise that resolves once the downstream validation assertion is complete.
 */
async function testIsExistsAsync(metadataPromise, fileName, filePath) {
  const metadata = await metadataPromise;

  testIsExists(metadata, fileName, filePath);
}

/**
 * @private
 *
 * Asserts that a file metadata snapshot is populated, injecting custom path debugging outputs on failure.
 *
 * This structural validation utility evaluates the presence of extracted file metadata. It leverages Vitest to strictly assert that the provided snapshot is not null, feeding a formatted error blueprint
 * string into the matcher block to instantly surface the missing filename and raw file-system location if the asset check falls short.
 *
 * @param {Buffer<ArrayBuffer> | null} metadata - The extracted binary file metadata snapshot buffer pool under validation, or null if the file was inaccessible.
 * @param {string} fileName - The human-readable file identifier name used to populate descriptive error outputs on failure.
 * @param {string} filePath - The system absolute or relative disk location pointer under evaluation.
 *
 * @returns {void}
 */
function testIsExists(metadata, fileName, filePath) {
  vitest.expect(metadata, `File '${fileName}' not found.\nPath: '${filePath}'`).not.toBeNull();
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
