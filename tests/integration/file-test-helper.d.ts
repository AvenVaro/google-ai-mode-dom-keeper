/**
 * Provides an immutable, freeze-wrapped interface controlling asynchronous file-system metadata extraction and binary validation routines.
 */
export interface FileTestHelper {
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
   * Asynchronously attempts to read a 24-byte binary metadata chunk from the beginning of a file.
   *
   * @param path - The absolute or relative system disk location pointer to extract metadata from.
   *
   * @returns A promise resolving to a 24-byte allocated data Buffer snapshot if successful; otherwise, `null`.
   */
  tryReadMetadataAsync(path: string): Promise<Buffer<ArrayBuffer> | null>;

  /**
   * Asserts that a deferred file metadata operation resolves successfully to a valid data payload.
   *
   * @param metadataPromise - A promise representing the pending file metadata scan operation.
   *
   * @returns A promise that resolves once the Vitest validation assertion is complete.
   */
  testIsExistsAsync(metadataPromise: Promise<Buffer<ArrayBuffer> | null>): Promise<void>;

  /**
   * Asserts that a deferred file metadata snapshot matches the standard PNG binary magic number signature.
   *
   * @param metadataPromise - A promise representing the pending 24-byte file metadata extraction pass.
   *
   * @returns A promise that resolves once the Vitest signature validation assertion is complete.
   */
  testIsPngAsync(metadataPromise: Promise<Buffer<ArrayBuffer> | null>): Promise<void>;

  /**
   * Asserts that a deferred PNG file metadata buffer matches the exact expected pixel width and height dimensions.
   *
   * @param metadataPromise - A promise representing the pending 24-byte binary file header snapshot.
   * @param width - The explicit expected pixel width criteria boundary.
   * @param height - The explicit expected pixel height criteria boundary.
   *
   * @returns A promise that resolves once both structural dimension assertions are complete.
   */
  testHasStrictDimensionsAsync(metadataPromise: Promise<Buffer<ArrayBuffer> | null>, width: number, height: number): Promise<void>;
}

declare const fileTestHelper: FileTestHelper;

export default fileTestHelper;
