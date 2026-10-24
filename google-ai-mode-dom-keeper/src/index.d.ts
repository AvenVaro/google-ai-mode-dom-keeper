import { SiblingMutationRecord } from './cache.js';

/**
 * Represents a paired layout mapping combining a specific DOM element node and its evaluated distance metric.
 *
 * This contract links a tracked element directly to its calculated spatial position offset or coordinate
 * threshold, utilized during view calculations or layout alignments.
 */
export type TurnDistancePair = {
  /** The targeted DOM element instance representing the active turn component node. */
  readonly turn: Element;

  /** The absolute distance from the center of the element to the center of the viewport. */
  readonly distance: number;
};

/**
 * Represents a paired layout mapping combining a specific height metric and its associated sibling mutation records.
 *
 * This contract links a calculated or parsed vertical dimension directly to the sequence of
 * historical downstream node states affected by or bound to that layout threshold.
 */
export type HeightSiblingsPair = {
  /** The calculated or target vertical dimension metric in pixels. */
  readonly height: number;

  /** An ordered sequence of structural snapshots tracking adjacent child nodes and their layout neighbors. */
  readonly siblings: SiblingMutationRecord[];
};

/**
 * Represents a read-only diagnostics telemetry snapshot tracking live, cached, and total structural elements.
 *
 * This contract aggregates operational counters utilized to evaluate extension performance, layout density, and virtualization health across the monitored DOM.
 */
export type CacheMetricsSnapshot = {
  /** The total count of targeted component elements currently matching the selector query within the DOM tree. */
  readonly totalTurnsInDOM: number;

  /** The immediate count of component layout records actively virtualized and tracked inside the cache repository. */
  readonly parkedBlocksCount: number;

  /** The total count of fully interactive, unparked component instances actively running within the viewport layout bounds. */
  readonly aliveTurnsCount: number;
};
