/**
 * Represents a immutable snapshot of specific layout and overflow styles extracted from a DOM element.
 *
 * This structure captures structural styling properties required to manage block measurements
 * and rendering boundaries during extension layout calculations.
 */
export type HeadStyle = {
  /** The explicit height constraint assigned to the element. */
  readonly height: string;

  /** The explicit minimum height constraint assigned to the element. */
  readonly minHeight: string;

  /** The explicit overflow behavior constraint assigned to the element. */
  readonly overflow: string;
};

/**
 * Represents a cached structural snapshot of a sibling node and its immediate downstream layout neighbor.
 *
 * This structure tracks a target child node coupled with its trailing sibling pointer, ensuring
 * that the extension can accurately restore original linear DOM sequences or compile positional changes.
 */
export type SiblingMutationRecord = {
  /** The targeted intermediate DOM child node being cached or monitored. */
  readonly node: ChildNode;

  /** The immediate trailing sibling node following the target node, or `null` if the target is the last child. */
  readonly nextSibling: ChildNode | null;
};

/**
 * Represents a cached structural snapshot of a turn component's state and its layout context.
 *
 * This contract stores the serialized HTML snapshot of a specific element along with the
 * historical downstream node states required to fully reconstruct its original DOM block sequence.
 */
export type TurnContext = {
  /** The serialized HTML markup string representing the state of the component. */
  readonly html: string;

  /** An ordered sequence of structural snapshots tracking adjacent child nodes and their layout neighbors. */
  readonly siblings: SiblingMutationRecord[];
};

/**
 * Represents an immutable paired composite record combining an element's layout style and its active runtime execution context.
 */
export type StyleContextPair = {
  /** The baseline layout sizing boundaries and overflow configurations snapshot for the element. */
  readonly style: HeadStyle;

  /** The active runtime tracking, state properties, or virtualization context payload. */
  readonly context: TurnContext;
};

/**
 * Provides an immutable, freeze-wrapped interface controlling the extension's
 * cache layers and memory buffers.
 */
export interface Cache {
  /**
   * Retrieves the total number of currently stored blocks within the active map memory buffer.
   *
   * @returns The current count of distinct block items stored inside the map buffer.
   */
  size(): number;

  /**
   * Validates whether a specific turn component is actively tracked within the storage map.
   *
   * @param turn - The target component or DOM element node instance to look up.
   *
   * @returns `true` if the element exists within the map buffer; otherwise, `false`.
   */
  has(turn: Element): boolean;

  /**
   * Validates whether a specific turn component is absent from the active storage map.
   *
   * @param turn - The target component or DOM element node instance to evaluate.
   *
   * @returns `true` if the element is missing from the map buffer; otherwise, `false`.
   */
  hasNot(turn: Element): boolean;

  /**
   * Resolves all actively tracked map keys and returns them as a standard flat array.
   *
   * @returns A flat array containing all active keys currently stored inside the map buffer.
   */
  getKeys(): Element[];

  /**
   * Retrieves a native iterator containing all actively tracked keys within the storage map.
   *
   * @returns A native iterator tracking the current sequence of stored element keys.
   */
  keys(): MapIterator<Element>;

  /**
   * Flushes all tracked data entries and completely resets the active map memory buffer.
   */
  clear(): void;

  /**
   * Synchronizes the cache buffer by purging elements that are no longer active.
   *
   * @param actualTurns - An array containing the fresh, actively visible elements representing the current layout state.
   */
  deleteOutdated(actualTurns: Element[]): void;

  /**
   * Commits an element's structural styling baseline and runtime execution context to memory.
   *
   * @param turn - The target DOM element component instance acting as the primary cache key.
   * @param styleContextPair - An immutable composite record encapsulating the baseline layout style and tracking context payload.
   */
  set(turn: Element, styleContextPair: StyleContextPair): void;

  /**
   * Extracts and removes an element's cached layout style and execution context from memory.
   *
   * This destructive retrieval utility captures the current baseline styling snapshot and active runtime properties context associated with the target element. It bundles them into a structured composite
   * pair payload, executes a permanent cache purge via `del` to free up allocated memory layers, and returns the isolated data records.
   *
   * @param turn - The target DOM element component instance acting as the lookup cache key.
   *
   * @returns A composite token record capturing the deleted element's style snapshot and context payload.
   */
  pop(turn: Element): StyleContextPair;

  /**
   * Permanently evicts an element's records from all active tracking memory maps.
   *
   * This atomic eviction utility completely detaches the target element from the internal storage layers.
   * It simultaneously deletes its state references from the `parkedBlocks` runtime context map and clears its original inline styles blueprint from the `originalStyles` WeakMap to prevent memory leaks.
   *
   * @param turn - The target DOM element component instance to evict from cache registries.
   */
  del(turn: Element): void;
}

declare const cache: Cache;

export default cache;
