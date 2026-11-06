/**
 * Represents an immutable dictionary tracking absolute system paths for compiled distribution directories.
 *
 * This contract establishes the target directory boundaries utilized by file system build assets managers to move, compress, or output artifacts during project compilation sweeps.
 */
export type DistDirectoryPaths = {
  /** The primary, root compilation distribution directory absolute path. */
  readonly dist: string;

  /** The destination distribution directory absolute path allocated specifically for JavaScript bundle assets. */
  readonly js: string;

  /** The destination distribution directory absolute path allocated specifically for compiled image assets. */
  readonly img: string;

  /** The destination distribution directory absolute path allocated specifically for icon vector assets. */
  readonly icons: string;
};
