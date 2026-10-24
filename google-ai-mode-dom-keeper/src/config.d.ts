/**
 * Represents the core configuration layout settings for the extension.
 *
 * This contract establishes the operational parameters required to initialize the extension's
 * background tracking, including global state keys, target DOM query matchers, and maximum
 * capacity limits for element history retention.
 */
export type Config = {
  /** The global property name key under which the extension attaches its core runtime state or API instance (e.g., on the global `window` object scope). */
  readonly globalKey: string;

  /** The explicit CSS selector pattern used to query and watch target DOM elements across the document. */
  readonly selector: string;

  /** The maximum number of historical entries, turns, or elements the extension should actively keep and track in memory before cycling out older records. */
  readonly keepMax: number;
};

declare const config: Config;

export default config;
