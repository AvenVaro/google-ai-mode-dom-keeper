/**
 * Provides an immutable, freeze-wrapped interface controlling asynchronous file-system metadata extraction and binary validation routines.
 */
export interface FileTestHelper {
  /** The file name of the 16x16 pixel icon asset used as the extension's favicon, context menu image, or basic toolbar icon placeholder. */
  readonly icon16FileName: string;

  /** The file name of the 32x32 pixel icon asset used during toolbar rendering, tab stripes navigation, or high-density screen display sweeps. */
  readonly icon32FileName: string;

  /** The file name of the 48x48 pixel icon asset displayed on the active browser extensions management dashboard page (`chrome://extensions`). */
  readonly icon48FileName: string;

  /** The file name of the 128x128 pixel icon asset utilized by the Chrome Web Store directory display card and during deployment installation prompts. */
  readonly icon128FileName: string;

  /** The absolute system disk path pointing directly to the root directory of the project workspace. */
  readonly rootDirectoryPath: string;

  /**
   * Asynchronously attempts to read the entire contents of a file into a Buffer.
   *
   * This utility opens a file handle in read-only mode, extracts its full binary stream payload, and ensures proper resource sanitation by securely closing the file handle afterward. If any
   * disk exceptions, missing file errors (ENOENT), or permission restrictions occur, it intercepts the failure, logs the error stack trace to the console, and returns a fallback empty state
   * instead of breaking the execution thread.
   *
   * @param path - The absolute or relative file-system path to the targeted file asset.
   *
   * @returns A promise resolving to the file's raw binary Buffer content if successful; otherwise, `null`.
   */
  tryReadFileAsync(path: string): Promise<Buffer<ArrayBuffer> | null>;

  /**
   * Asynchronously attempts to read and parse the entire contents of a file as JSON.
   *
   * This asset parsing utility opens a file handle in a strict read-only mode, extracts its full binary stream payload, and ensures proper resource sanitation by securely closing the active handle
   * afterward. It decodes the resulting buffer into a standardized UTF-8 string slice and compiles it into a structured JavaScript object mapping the specified generic contract type template. If any
   * disk errors, missing file conditions, or structural JSON validation faults occur, it intercepts the failure internally, logs the error stack trace to the console, and yields a fallback empty state
   * instead of breaking the execution thread.
   *
   * @template T - The expected layout type structure of the parsed JSON object. Defaults to `Record<string, unknown>`.
   *
   * @param path - The absolute or relative file-system path to the targeted JSON configuration asset.
   *
   * @returns A promise resolving to the fully parsed JavaScript object typed to `T` if successful; otherwise, `null`.
   */
  tryReadJsonFileAsync<T = Record<string, unknown>>(path: string): Promise<T | null>;

  /**
   * Asynchronously attempts to read a 24-byte binary metadata chunk from the beginning of a file.
   *
   * @param path - The absolute or relative system disk location pointer to extract metadata from.
   *
   * @returns A promise resolving to a 24-byte allocated data Buffer snapshot if successful; otherwise, `null`.
   */
  tryReadMetadataAsync(path: string): Promise<Buffer<ArrayBuffer> | null>;

  /**
   * Asynchronously awaits a deferred metadata operation and passes the resolved payload for existence verification.
   *
   * @param metadataPromise - A promise representing the pending asynchronous file metadata extraction sweep.
   * @param fileName - The human-readable file identifier name used to populate descriptive error outputs on failure.
   * @param filePath - The system absolute or relative disk location pointer under evaluation.
   *
   * @returns A promise that resolves once the downstream validation assertion is complete.
   */
  testIsExistsAsync(metadataPromise: Promise<Buffer<ArrayBuffer> | null>, fileName: string, filePath: string): Promise<void>;

  /**
   * Asserts that a file metadata snapshot is populated, injecting custom path debugging outputs on failure.
   *
   * @param metadata - The extracted binary file metadata snapshot buffer pool under validation, or null if the file was inaccessible.
   * @param fileName - The human-readable file identifier name used to populate descriptive error outputs on failure.
   * @param filePath - The system absolute or relative disk location pointer under evaluation.
   */
  testIsExists(metadata: Buffer<ArrayBuffer> | null, fileName: string, filePath: string): void;

  /**
   * Asserts that a deferred file metadata snapshot matches the standard PNG binary magic number signature.
   *
   * @param metadataPromise - A promise representing the pending 24-byte file metadata extraction pass.
   * @param fileName - The human-readable file identifier name used to populate descriptive error outputs on failure.
   * @param filePath - The system absolute or relative disk location pointer under evaluation.
   *
   * @returns A promise that resolves once the Vitest signature validation assertion is complete.
   */
  testIsPngAsync(metadataPromise: Promise<Buffer<ArrayBuffer> | null>, fileName: string, filePath: string): Promise<void>;

  /**
   * Asserts that a deferred PNG file metadata buffer matches the exact expected pixel width and height dimensions.
   *
   * @param metadataPromise - A promise representing the pending 24-byte binary file header snapshot.
   * @param width - The explicit expected pixel width criteria boundary.
   * @param height - The explicit expected pixel height criteria boundary.
   * @param fileName - The human-readable file identifier name used to populate descriptive error outputs on failure.
   * @param filePath - The system absolute or relative disk location pointer under evaluation.
   *
   * @returns A promise that resolves once both structural dimension assertions are complete.
   */
  testHasStrictDimensionsAsync(metadataPromise: Promise<Buffer<ArrayBuffer> | null>, width: number, height: number, fileName: string, filePath: string): Promise<void>;
}

declare const fileTestHelper: FileTestHelper;

export default fileTestHelper;
