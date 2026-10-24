/**
 * Provides an immutable, freeze-wrapped interface controlling asynchronous file-system metadata extraction and binary validation routines.
 */
export interface FileTestHelper {
  /** The absolute system disk path pointing directly to the root directory of the project workspace. */
  readonly rootDirectoryPath: string;

  /**
   * Asynchronously attempts to read a 24-byte binary metadata chunk from the beginning of a file.
   *
   * @param path - The absolute or relative system disk location pointer to extract metadata from.
   * @param readFull - An optional configuration flag indicating whether to extract the complete file payload instead of the initial 24-byte fragment.
   *
   * @returns A promise resolving to a 24-byte allocated data Buffer snapshot if successful; otherwise, `null`.
   */
  tryReadMetadataAsync(path: string, reedFull?: boolean): Promise<Buffer<ArrayBuffer> | null>;

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
