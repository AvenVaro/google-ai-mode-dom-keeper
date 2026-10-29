'use strict';

import config from './config.js';
import cache from './cache.js';

//================================
// Typedefs
//================================

/**
 * @typedef {import('./cache.d.ts').SiblingMutationRecord} SiblingMutationRecord
 * @typedef {import('./cache.d.ts').HeadStyle} HeadStyle
 * @typedef {import('./cache.d.ts').TurnContext} TurnContext
 * @typedef {import('./cache.d.ts').StyleContextPair} StyleContextPair
 * @typedef {import('./index.d.ts').TurnDistancePair} TurnDistancePair
 * @typedef {import('./index.d.ts').HeightSiblingsPair} HeightSiblingsPair
 * @typedef {import('./index.d.ts').CacheMetricsSnapshot} CacheMetricsSnapshot
 */

//================================
// Runtime
//================================

if (window[config.globalKey]) {
  window[config.globalKey].destroy();
}

/** @type {MutationObserverInit} */
const observerOptions = {
  childList: true,
  subtree: true
};

let destroyed = false;
let scanQueued = false;

const mutationObserver = new MutationObserver(handleMutationRecords);

mutationObserver.observe(document.body, observerOptions);

window.addEventListener('scroll', scheduleScan, { passive: true });

window[config.globalKey] = {
  stats: getCacheMetricsSnapshot,
  rescan: scan,
  destroy: destroy
};

scan();

//================================
// Private Functions
//================================

/**
 * @private
 *
 * Processes incoming DOM mutation records to conditionally trigger a layout synchronization pass.
 *
 * This observation callback utility screens batches of mutation records dispatched by the browser. It employs a short-circuiting iteration loop over the record collection, inspecting structural changes.
 * If any record contains freshly appended nodes or newly evicted components, it sets the evaluation flag, terminates further array traversal to preserve processing cycles, and requests a debounced scan
 * via the scheduling pipeline.
 *
 * @param {MutationRecord[]} mutations - An array of mutation records detailing discrete structural modifications made to the DOM.
 *
 * @returns {void}
 */
function handleMutationRecords(mutations) {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
      scheduleScan();

      return;
    }
  }
}

/**
 * @private
 *
 * Compiles a diagnostics metrics snapshot tracking live and virtualized component counts.
 *
 * This read-only telemetry utility queries the document to evaluate cache density metrics. It aggregates structural statistics, returning an object that captures total matched nodes in the DOM,
 * active placeholder records inside the cache registry, and the exact count of fully interactive, unparked component instances.
 *
 * @returns {CacheMetricsSnapshot} An object containing atomic diagnostic counts of the extension state.
 */
function getCacheMetricsSnapshot() {
  const turns = [ ...document.querySelectorAll(config.selector) ];

  return {
    totalTurnsInDOM: turns.length,
    parkedBlocksCount: cache.size(),
    aliveTurnsCount: turns.filter(cache.hasNot).length
  };
}

/**
 * @private
 *
 * Validates whether a given DOM node is an active, connected turn component.
 *
 * This predicate utility evaluates structural and environmental criteria. It ensures that the node is a valid HTML element instance, matches the extension's target CSS configuration
 * selector pattern, and is currently attached to the active document live DOM tree via its connection state flag.
 *
 * @param {Element | ChildNode} node - The live DOM node or child node instance to evaluate.
 *
 * @returns {boolean} `true` if the node is an attached HTMLElement matching the selector; otherwise, `false`.
 */
function isTurn(node) {
  return node instanceof HTMLElement
    && node.matches(config.selector)
    && node.isConnected
  ;
}

/**
 * @private
 *
 * Virtualizes an active component by caching its contents and replacing it with a placeholder bound.
 *
 * This core virtualization controller manages the complete "parking" lifecycle sequence for a target node. It evaluates validation guard rails to ensure the component is eligible and currently untracked.
 * Once cleared, it compiles adjacent downstream layouts, aggregates their collective spatial dimensions, and commits a synchronized style-context snapshot token into the central cache repository.
 * Finally, it purges the live DOM element subtrees and locks the outer container into an immutable, non-shifting height placeholder layout.
 *
 * @param {Element} turn - The target DOM element instance to evaluate, serialize, and virtualize into a placeholder.
 *
 * @returns {void}
 */
function parkBlock(turn) {
  if (!isTurn(turn) || cache.has(turn)) {
    return;
  }

  const siblings = getBlockSiblings(turn);
  const heightSiblingsPair = getHeightSiblingsPair(turn, siblings);

  cache.set(
    turn,
    {
      style: {
        height: turn.style.height,
        minHeight: turn.style.minHeight,
        overflow: turn.style.overflow
      },
      context: {
        html: turn.innerHTML,
        siblings: heightSiblingsPair.siblings
      }
    }
  );

  clearDOM(turn, siblings);
  setPlaceholderStyleToTurn(turn, heightSiblingsPair.height);
}

/**
 * @private
 *
 * Safely purges the internal subtree of an element and detaches its adjacent sibling nodes from the DOM.
 *
 * This destructive mutation utility performs a multi-stage layout cleansing operation. It leverages the high-performance native `.replaceChildren()` API to instantly clear all nested child nodes inside
 * the base turn element. It then iterates through the provided collection of downstream sibling nodes, utilizing optional chaining on their parent pointers to safely isolate and detach each child node
 * from the live document tree.
 *
 * @param {Element} turn - The targeted base DOM element whose internal markup subtree is being completely purged.
 * @param {ChildNode[]} siblings - An ordered sequence of adjacent downstream child nodes to detach from their parent scopes.
 *
 * @returns {void}
 */
function clearDOM(turn, siblings) {
  turn.replaceChildren();

  for (const sib of siblings) {
    sib.parentNode?.removeChild(sib);
  }
}

/**
 * @private
 *
 * Enforces explicit layout dimension constraints on an element to serve as a structural placeholder.
 *
 * This layout mutation utility directly modifies the inline style properties of the target element. It converts the raw numeric height scalar into a standardized pixel string layout,
 * applying it synchronously to both `height` and `minHeight` bounds. Concurrently, it restricts the element's `overflow` property to 'hidden' to prevent layout shifting or double-rendering
 * drops during component virtualization passes.
 *
 * @param {HTMLElement} turn - The targeted HTML element whose inline style properties are being modified.
 * @param {number} height - The target vertical dimension scalar value in pixels to enforce as a structural bound.
 *
 * @returns {void}
 */
function setPlaceholderStyleToTurn(turn, height) {
  turn.style.height = `${height}px`;
  turn.style.minHeight = `${height}px`;
  turn.style.overflow = 'hidden';
}

/**
 * @private
 *
 * Collects all intermediate DOM sibling nodes following an element until the next turn component is encountered.
 *
 * This traversal utility walks sequentially forward through the DOM tree using the active `.nextSibling` pointer chain. It serves as a linear scanner, accumulating all encountered child nodes (such as text nodes,
 * comments, or alternative element blocks) into an array buffer, and immediately terminates the loop as soon as it matches a valid component boundary via `utils.isTurn`.
 *
 * @param {Element} turn - The starting DOM element node context from which the forward traversal initiates.
 *
 * @returns {ChildNode[]} A flat array containing all downstream sibling nodes positioned before the next turn boundary.
 */
function getBlockSiblings(turn) {
  /** @type {ChildNode[]} */
  const siblings = [];

  let next = turn.nextSibling;

  while (next !== null && !isTurn(next)) {
    siblings.push(next);

    next = next.nextSibling;
  }

  return siblings;
}

/**
 * @private
 *
 * Synthesizes a composite layout pair tracking the cumulative height of a component and its immediate siblings.
 *
 * This factory utility orchestrates spatial metrics calculations and structural position captures.
 * It initiates a running height index from the base turn element's bounding client rectangle, loops through the array of downstream sibling nodes, and conditionally accumulates their vertical
 * dimensions if they are verified as live `HTMLElement` instances. Concurrently, it maps each raw node into a positional snapshot, returning a unified layout token record.
 *
 * @param {Element} turn - The primary base DOM element initiating the layout evaluation boundary.
 * @param {ChildNode[]} siblings - An ordered sequence of adjacent downstream child nodes to analyze and snapshot.
 *
 * @returns {HeightSiblingsPair} A populated composite token mapping the total computed height to the tracked sibling mutation array.
 */
function getHeightSiblingsPair(turn, siblings) {
  let totalHeight = turn.getBoundingClientRect().height;

  /** @type {SiblingMutationRecord[]} */
  const savedSiblings = [];

  for (const sib of siblings) {
    if (sib instanceof HTMLElement) {
      totalHeight += sib.getBoundingClientRect().height;
    }

    savedSiblings.push({
      node: sib,
      nextSibling: sib.nextSibling
    });
  }

  return {
    height: totalHeight,
    siblings: savedSiblings
  };
}

/**
 * @private
 *
 * Synthesizes a immutable state snapshot record for a specific turn component.
 *
 * This factory utility handles the serialization of the live element's state by capturing its current `innerHTML` markup string. It maps this markup representation directly alongside
 * the collection of pre-captured downstream sibling mutation records, packaging them into a uniform `Turn` structural token ready for caching or history tracking.
 *
 * @param {Element} turn - The targeted DOM element instance whose inner markup state is being serialized.
 * @param {SiblingMutationRecord[]} siblings - An ordered sequence of pre-captured positional snapshots tracking adjacent child nodes.
 *
 * @returns {TurnContext} A populated state snapshot token mapping the inner HTML markup string to the tracked siblings array.
 */
function restoreBlock(turn) {
  if (!isTurn(turn) || !cache.has(turn)) {
    return;
  }

  const styleContextPair = cache.pop(turn);

  setStyleToTurn(turn, styleContextPair.style);
  restoreDOM(turn, styleContextPair.context);
}

/**
 * @private
 *
 * Restores or overrides an element's inline layout properties from a baseline style snapshot.
 *
 * This layout mutation utility maps styling properties from a saved `HeadStyle` configuration record back onto the target element's active inline style map. It rolls back properties like height,
 * minimum height bounds, and overflow constraints, returning the node to its original layout context.
 *
 * @param {Element} turn - The targeted DOM element instance whose inline style declarations are being updated.
 * @param {HeadStyle} style - The immutable layout styles snapshot containing target height and overflow values.
 *
 * @returns {void}
 */
function setStyleToTurn(turn, style) {
  turn.style.height = style.height;
  turn.style.minHeight = style.minHeight;
  turn.style.overflow = style.overflow;

  if (turn.getAttribute('style') === '' || turn.style.length === 0) {
    turn.removeAttribute('style');
  }
}

/**
 * @private
 *
 * Restores original downstream sibling layouts by re-stitching cached nodes back into the DOM sequence.
 *
 * This structural restoration utility handles DOM re-integration. It extracts the parent node container, aborting if the target is detached. It then iterates in reverse order through the array of sibling mutation
 * records to rebuild the original linear order. If the recorded tracking anchor (`nextSibling`) exists and is connected, it inserts the sibling directly before it. Otherwise, it dynamically falls back to insert
 * the node relative to the active element's subsequent layout boundaries or appends it to the end of the container.
 *
 * @param {Element} turn - The primary base DOM element acting as the positional anchor for the layout reconstruction.
 * @param {TurnContext} context - The active runtime execution or state context payload containing the tracked siblings snapshots collection.
 *
 * @returns {void}
 */
function restoreDOM(turn, context) {
  turn.innerHTML = context.html;

  const parent = turn.parentNode;

  if (parent === null) {
    return;
  }

  for (let i = context.siblings.length - 1; i >= 0; i--) {
    const sibData = context.siblings[i];

    if (sibData.nextSibling !== null && sibData.nextSibling.isConnected) {
      parent.insertBefore(sibData.node, sibData.nextSibling);
    }
    else {
      const targetNext = turn.nextSibling;

      if (targetNext === null) {
        parent.appendChild(sibData.node);
      }
      else {
        parent.insertBefore(sibData.node, targetNext);
      }
    }
  }
}

/**
 * @private
 *
 * Schedules a deferred virtualization layout sweep synchronized with the browser's rendering cycle.
 *
 * This scheduling controller acts as a low-overhead macro-task or rendering pipeline debouncer. It evaluates active lifecycle states and queue constraints to prevent execution overlaps.
 * Once cleared, it locks the thread pipeline by enabling the `scanQueued` state flag and registers the execution callback hook into the native `requestAnimationFrame` queue, mitigating layout thrashing
 * during rapid or continuous DOM mutations.
 *
 * @returns {void}
 */
function scheduleScan() {
  if (destroyed || scanQueued) {
    return;
  }

  scanQueued = true;

  requestAnimationFrame(executeQueuedScan);
}

/**
 * @private
 *
 * Executes a deferred layout scan operation and resets the scheduling queuing flag.
 *
 * This lifecycle execution utility acts as a debounced or microtask resolution callback hook. It unlocks the scheduling thread pipeline by explicitly turning off the `scanQueued` lock flag,
 * and immediately triggers the core engine `scan` routine to synchronize visible document blocks.
 *
 * @returns {void}
 */
function executeQueuedScan() {
  scanQueued = false;

  scan();
}

/**
 * @private
 *
 * Evaluates the vertical layout metrics of a DOM element to calculate its absolute distance from the viewport center.
 *
 * This geometry utility captures the bounding client rectangle of the target element, computes its exact vertical center point (`rect.top + rect.height / 2`), and determines its absolute spatial
 * offset position relative to the provided viewport baseline center axis. It returns a paired record tracking the original node coupled with its proximity metric.
 *
 * @param {Element} turn - The targeted DOM element component instance to evaluate.
 * @param {number} viewportCenter - The calculated vertical midpoint coordinate of the current viewport window.
 *
 * @returns {TurnDistancePair} A structured pair mapping the element node to its absolute distance scalar value.
 */
function mapTurnToDistance(turn, viewportCenter) {
  const rect = turn.getBoundingClientRect();
  const turnCenter = rect.top + (rect.height / 2);
  const distance = Math.abs(turnCenter - viewportCenter);

  return {
    turn: turn,
    distance: distance
  };
}

/**
 * @private
 *
 * Filters and isolates the closest DOM elements relative to the vertical viewport center.
 *
 * This pipeline orchestration utility establishes a central focal axis based on half of the window's inner height. It projects the incoming raw elements array into spatial proximity pairs,
 * sorts them in ascending order (closest elements first), and slices the top matches up to the specified historical capacity boundary (`config.keepMax`). Finally, it strips the distance metadata
 * and returns the filtered items inside a native `Set` for optimized O(1) visibility checks.
 *
 * @param {Element[]} turns - A collection of DOM elements actively tracked by the extension configuration.
 *
 * @returns {Set<Element>} A specialized set containing the closest filtered DOM elements centered on the viewport.
 */
function getVisibleTurns(turns) {
  const viewportCenter = window.innerHeight / 2;
  const turnDistancePairs = turns.map((turn) => mapTurnToDistance(turn, viewportCenter));

  const visibleTurns = turnDistancePairs
    .sort((turnDistancePairOne, turnDistancePairTwo) => turnDistancePairOne.distance - turnDistancePairTwo.distance)
    .slice(0, config.keepMax)
    .map((turnDistancePair) => turnDistancePair.turn)
  ;

  return new Set(visibleTurns);
}

/**
 * @private
 *
 * Orchestrates a complete virtualization scanning and layout optimization cycle across the DOM.
 *
 * This core engine runner manages the active lifecycle state of tracked document blocks. It evaluates structural destruction checkpoints before query execution. To prevent infinite recursive loop triggers
 * caused by its own structural modifications, it temporarily detaches the `MutationObserver`. It then queries live elements, filters them through spatial viewport calculations, and routes them to either
 * `restoreBlock` or `parkBlock` processing pipelines based on intersection states. Finally, it evicts dangling cache buckets and re-establishes defensive DOM tracking on the body subtree.
 *
 * @returns {void}
 */
function scan() {
  if (destroyed) {
    return;
  }

  const turns = [ ...document.querySelectorAll(config.selector) ];

  if (turns.length === 0) {
    return;
  }

  const visibleTurns = getVisibleTurns(turns);

  mutationObserver.disconnect();

  for (const turn of turns) {
    if (visibleTurns.has(turn)) {
      restoreBlock(turn);
    }
    else {
      parkBlock(turn);
    }
  }

  cache.deleteOutdated(turns);

  if (!destroyed) {
    mutationObserver.observe(document.body, observerOptions);
  }
}

/**
 * @private
 *
 * Permanently tears down the extension runtime engine and restores the original DOM layout state.
 *
 * This lifecycle unmounting utility handles resource cleanup and side-effect eviction. It triggers an immediate structural halt by activating the terminal lifecycle lock flag, permanently disconnecting
 * the mutation observation pipeline, and unregistering synchronous scroll event throttling listeners. To leave the webpage pristine, it iterates through all cached keys to re-integrate and restore raw
 * document blocks. Finally, it flushes active memory maps and purges custom runtime hooks from the global browser window object window context scope.
 *
 * @returns {void}
 */
function destroy() {
  destroyed = true;

  mutationObserver.disconnect();

  window.removeEventListener('scroll', scheduleScan);

  for (const turn of cache.getKeys()) {
    restoreBlock(turn);
  }

  cache.clear();

  delete window[config.globalKey];
}
