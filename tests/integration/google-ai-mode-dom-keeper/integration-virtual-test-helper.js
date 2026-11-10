// @vitest-environment jsdom

import * as vitest from 'vitest';
import config from '../../../google-ai-mode-dom-keeper/src/config.js';
import testHelper from '../../test-helper.js';

//================================
// Typedefs
//================================

/**
 * @typedef {import('./integration-virtual-test-helper.d.ts').IntegrationVirtualTestHelper} IntegrationVirtualTestHelper
 * @typedef {import('./integration-virtual-test-helper.d.ts').PropertyMockDescriptor} PropertyMockDescriptor
 * @typedef {import('./integration-virtual-test-helper.d.ts').VirtualNode} VirtualNode
 * @typedef {import('./integration-virtual-test-helper.d.ts').TestContext} TestContext
 * @typedef {import('../../../google-ai-mode-dom-keeper/src/index.d.ts').CacheMetricsSnapshot} CacheMetricsSnapshot
 */

//================================
// Constants
//================================

const getBoundingClientRectKey = 'getBoundingClientRect';

/** @type {IntegrationVirtualTestHelper} */
const integrationVirtualTestHelper = Object.freeze({
  afterEach: afterEach,
  createAndConfigureTestContext: createAndConfigureTestContext,
  testGlobalInterfaceRegistration: testGlobalInterfaceRegistration,
  testInterfaceRemovalViaDestroy: testInterfaceRemovalViaDestroy,
  testRestoreDomViaRestore: testRestoreDomViaRestore,
  testActualStatisticsViaStats: testActualStatisticsViaStats,
  testReVirtualizedDomViaRescan: testReVirtualizedDomViaRescan,
  testVirtualizedDomOnStart: testVirtualizedDomOnStart,
  testVirtualizationOnWindowScrollAsync: testVirtualizationOnWindowScrollAsync,
  testCacheEvictionOnBlockRemovalAsync: testCacheEvictionOnBlockRemovalAsync,
  testAutomaticVirtualizationViaMutationObserverAsync: testAutomaticVirtualizationViaMutationObserverAsync
});

//================================
// Exports
//================================

export default integrationVirtualTestHelper;

//================================
// Private Functions
//================================

/**
 * @private
 *
 * Procedurally compiles, injects, and shadows a complete virtual layout testing sandbox environment.
 *
 * This high-level orchestration factory unifies test fixture generation and layout geometry configuration. It structures a deterministic distribution pattern of target blocks and text sibling nodes, serializes
 * them to string HTML, and captures an initial snapshot of the pristine DOM tree state. It then appends the markup to the document body, intercepts native `getBoundingClientRect` methods using Vitest spies
 * to simulate intersecting vs. off-screen coordinate zones, and takes a final post-configuration DOM state capture to return a unified test matrix context token.
 *
 * @returns {TestContext} A populated diagnostics snapshot capturing the total elements capacity and the complete combined markup string.
 */
function createAndConfigureTestContext() {
  const siblingDistribution = [ 2, 0, 3, 1, 2, 0, 4, 1, 0, 2, 1, 3, 0, 2, 1, 0, 3, 1, 2, 0 ];

  /** @type {string[]} */
  const htmlArray = [];

  for (let turnId = 0; turnId < siblingDistribution.length; turnId++) {
    htmlArray.push(`<div class="CKgc1d" data-scope-id="turn" id="block-${turnId}">Block ${turnId}</div>`);

    for (let siblingId = 0; siblingId < siblingDistribution[turnId]; siblingId++) {
      htmlArray.push(`<p class="sibling" id="sib-${turnId}-${siblingId}">Sibling ${turnId}.${siblingId}</p>`);
    }
  }

  htmlArray.push('<div class="sNRHic" jsaction="" jscontroller="Gtg4Ge#UWxVJd" data-sfc-root="c" jsuid="y5pWY_ecg" data-processed="true"><!--TgQPHd|||[]--></div>');

  const htmlString = htmlArray.join('');

  globalThis.document.body.innerHTML = htmlString;

  /** @type {PropertyMockDescriptor[]} */
  const mockStates = [];

  for (let id = 0; id < siblingDistribution.length; id++) {
    const block = globalThis.document.getElementById(`block-${id}`);

    const mock = vitest
      .vi
      .spyOn(block, getBoundingClientRectKey)
      .mockReturnValue({
        top: config.keepMax
          ? 100 + id * 120
          : 2000 + id * 300
        ,
        height: 100
      })
    ;

    mockStates.push({
      mock: mock,
      descriptor: Object.getOwnPropertyDescriptor(block, getBoundingClientRectKey),
      implementation: mock.getMockImplementation()
    });
  }

  /** @type {Map<Node, VirtualNode>} */
  const documentSnapshot = new Map();

  captureNode(globalThis.document.body, documentSnapshot);

  const parkedTurnsCount = siblingDistribution.length - config.keepMax;

  /** @type {TestContext} */
  const testContext = {
    numberOfTurns: siblingDistribution.length,
    htmlString: htmlString,
    siblingDistribution: siblingDistribution,
    mockStates: mockStates,
    documentSnapshot: documentSnapshot
  };

  if (parkedTurnsCount <= 0) {
    testContext.numberOfParkedTurns = 0;
    testContext.numberOfAliveTurns = siblingDistribution.length;
  }
  else {
    testContext.numberOfParkedTurns = parkedTurnsCount;
    testContext.numberOfAliveTurns = config.keepMax;
  }

  return testContext;
}

/**
 * @private
 *
 * Recursively captures structural layout characteristics, attributes, and text nodes into a decoupled snapshot map.
 *
 * This differential tracking builder traverses a target DOM node subtree. It checks the inheritance chain of each node, serializes element attributes into named configuration structures, and extracts raw data strings
 * from text or comment wrappers. It recursively builds an immutable structural topology map inside the provided snapshot dictionary container, laying the foundation for deep multi-document equality comparisons.
 *
 * @param {Node} node - The live runtime DOM Node (Element, Text, or Comment container) currently undergoing snapshot capturing.
 * @param {Map<Node, VirtualNode>} documentSnapshot - The central tracking dictionary map storing captured virtual node schemas against their original references.
 *
 * @returns {void}
 */
function captureNode(node, documentSnapshot) {
  /** @type {VirtualNode} */
  const state = {
    children: Array.from(node.childNodes)
  };

  if (node instanceof globalThis.document.defaultView.Element) {
    state.attributes = Array.from(node.attributes);
  }

  if (node instanceof globalThis.document.defaultView.CharacterData) {
    state.data = node.data;
  }

  documentSnapshot.set(node, state);

  for (const child of state.children) {
    captureNode(child, documentSnapshot);
  }
}

/**
 * @private
 *
 * Executes post-test cleanup procedures after each individual test specification runs.
 *
 * This lifecycle teardown hook evaluates the global window context. If an active runtime instance of the extension engine is discovered on the global key, it triggers an immediate structural
 * halt and resource unmounting pass via `.destroy()`, ensuring isolated component states between sequential test executions.
 *
 * @param {TestContext} testContext - The active testing context snapshot tracking the targeted post-mutation DOM state tree.
 *
 * @returns {void}
 */
function afterEach(testContext) {
  if (globalThis.window[config.globalKey]) {
    globalThis.window[config.globalKey].destroy();
  }

  vitest.vi.resetModules();

  for (const [ node, state ] of testContext.documentSnapshot) {
    if (node instanceof globalThis.document.defaultView.Element) {
      if (state.attributes) {
        for (const attribute of Array.from(node.attributes)) {
          node.removeAttribute(attribute.name);
        }

        for (const attr of state.attributes) {
          node.setAttribute(attr.name, attr.value);
        }
      }

      node.replaceChildren(...state.children);
    }

    if (node instanceof globalThis.document.defaultView.CharacterData && state.data !== undefined) {
      node.data = state.data;
    }
  }

  for (let id = 0; id < testContext.mockStates.length; id++) {
    const block = globalThis.document.getElementById(`block-${id}`);
    const state = testContext.mockStates[id];

    Object.defineProperty(block, getBoundingClientRectKey, state.descriptor);

    state.mock.mockClear();

    if (state.implementation) {
      state.mock.mockImplementation(state.implementation);
    }
  }
}

/**
 * @private
 *
 * Asserts the dynamic registration, module namespace attachment, and API method surface of the global interface.
 *
 * This integration test runner evaluates the extension's global mounting lifecycle. It dynamically imports the production script bundle from the specified system path, verifies its attachment onto the browser's shared
 * global window frame context, and runs a comprehensive validation cascade. It asserts that the mounted namespace is a valid, populated object, enforces strict contract constraints verifying that crucial operational hooks
 * (`stats`, `rescan`, and `destroy`) are exposed as callable functions, and validates that the object's property key footprint matches the expected boundary size exactly without extraneous leaks.
 *
 * @returns {void}
 */
function testGlobalInterfaceRegistration() {
  const globalInterface = globalThis.window[config.globalKey];
  const entityName = 'window[config.globalKey]';

  testHelper.testEntityIsDefined(globalInterface, entityName);
  testHelper.testEntityIsNotNullOrEmptyObject(globalInterface, entityName);

  testHelper.testEntityIsFunction(globalInterface.stats, 'stats');
  testHelper.testEntityIsFunction(globalInterface.rescan, 'rescan');
  testHelper.testEntityIsFunction(globalInterface.destroy, 'destroy');
  testHelper.testEntityIsFunction(globalInterface.restore, 'restore');

  const actualKeys = Object.keys(globalInterface);
  const expectedNumberOfKeys = 4;

  vitest.expect(actualKeys, testHelper.createEntityInvalidKeysCountErrorMessage(entityName, expectedNumberOfKeys, actualKeys.length)).toHaveLength(expectedNumberOfKeys);
}

/**
 * @private
 *
 * Asserts that invoking the destroy utility completely purges the global namespace interface.
 *
 * This lifecycle isolation test utility verifies the definitive unmounting of the production engine. It dynamically imports the compiled script bundle from the specified system path, confirms its baseline
 * definition on the global window context layer, and triggers the terminal `.destroy()` routine. Finally, it leverages Vitest to strictly validate that the public API namespace hook has been completely deleted
 * and evicted from the window scope, passing an explicit diagnostic fallback message if the object reference leaks.
 *
 * @returns {void}
 */
function testInterfaceRemovalViaDestroy() {
  testHelper.testEntityIsDefined(globalThis.window[config.globalKey], 'window[config.globalKey]');

  globalThis.window[config.globalKey].destroy();

  vitest
    .expect(
      globalThis.window[config.globalKey],
      '\nCalling the \'window[config.globalKey].destroy()\' function did not remove the global interface \'window[config.globalKey]\'.\n'
    )
    .toBeUndefined()
  ;
}

/**
 * @private
 *
 * Asserts that invoking the soft restore utility completely rolls back the virtual DOM tree state.
 *
 * This layout integration test utility evaluates the structural reconciliation capabilities of the production build. It forces an isolated module execution context pass via `vitest.vi.resetModules`, dynamically imports the script bundle,
 * and asserts its public definition. It then triggers the soft `.restore()` engine hook and runs an immediate Vitest matching routine to verify that the active body's inner markup stream reverts perfectly to its pristine raw
 * string representation, ensuring accurate layout recovery.
 *
 * @param {TestContext} testContext - The active testing context token providing the baseline pristine HTML serialization layout.
 *
 * @returns {void}
 */
function testRestoreDomViaRestore(testContext) {
  testHelper.testEntityIsDefined(globalThis.window[config.globalKey], 'window[config.globalKey]');

  globalThis.window[config.globalKey].restore();

  vitest
    .expect(
      globalThis.document.body.innerHTML,
      '\nCalling the \'window[config.globalKey].restore()\' function did not restore the DOM.\n'
    )
    .toBe(testContext.htmlString)
  ;
}

/**
 * @private
 *
 * Asserts that the global interface exports precise, real-time cache telemetry metrics.
 *
 * This integration test runner validates the public telemetry API surface. It dynamically imports the compiled production bundle script, verifies its attachment to the global window frame, and passes its runtime `.stats()`
 * snapshot directly down to the validation engine, mapping structural properties against the sandbox metrics tracked within the test context.
 *
 * @param {TestContext} testContext - The active testing context container holding the expected target layout volume counters.
 * @param {CacheMetricsSnapshot} expectedStats - The target baseline metrics blueprint containing exact expected value benchmarks.
 *
 * @returns {void}
 */
function testActualStatisticsViaStats(testContext, expectedStats) {
  testHelper.testEntityIsDefined(globalThis.window[config.globalKey], 'window[config.globalKey]');

  testStats(globalThis.window[config.globalKey].stats(), expectedStats);

  globalThis.window[config.globalKey].restore();

  testStats(
    globalThis.window[config.globalKey].stats(),
    {
      totalTurnsInDOM: testContext.numberOfTurns,
      parkedBlocksCount: 0,
      aliveTurnsCount: testContext.numberOfTurns
    }
  );

  globalThis.window[config.globalKey].rescan();

  testStats(globalThis.window[config.globalKey].stats(), expectedStats);
}

/**
 * @private
 *
 * Validates extracted cache telemetry metrics snapshots against targeted sandbox count thresholds.
 *
 * This structural verification checker runs field-by-field assertions over a telemetry payload. It leverages Vitest to enforce exact numeric parity across global matched nodes, active virtualized placeholders, and active live
 * components, injecting formatted multiline diagnostic reports to isolate arithmetic tracking errors instantly.
 *
 * @param {CacheMetricsSnapshot} actualStats - The live metrics snapshot object returned by the running extension's telemetry API.
 * @param {CacheMetricsSnapshot} expectedStats - The target baseline metrics blueprint containing exact expected value benchmarks.
 *
 * @returns {void}
 */
function testStats(actualStats, expectedStats) {
  vitest
    .expect(
      actualStats.totalTurnsInDOM,
      `\nThe number of responses has been calculated incorrectly.\nFound: ${actualStats.totalTurnsInDOM}.\nExpected: ${expectedStats.totalTurnsInDOM}.\n`
    )
    .toBe(expectedStats.totalTurnsInDOM)
  ;

  vitest
    .expect(
      actualStats.parkedBlocksCount,
      `\nThe number of parked responses has been calculated incorrectly.\nFound: ${actualStats.parkedBlocksCount}.\nExpected: ${expectedStats.parkedBlocksCount}.\n`
    )
    .toBe(expectedStats.parkedBlocksCount)
  ;

  vitest
    .expect(
      actualStats.aliveTurnsCount,
      `\nThe number of alive responses has been calculated incorrectly.\nFound: ${actualStats.aliveTurnsCount}.\nExpected: ${expectedStats.aliveTurnsCount}.\n`
    )
    .toBe(expectedStats.aliveTurnsCount)
  ;
}

/**
 * @private
 *
 * Asserts that triggering a reset and rescanning pass successfully re-virtualizes the active layout.
 *
 * This integration test utility evaluates the operational durability and hot-reload capabilities of the runtime layout virtualization engine. It verifies the public global interface presence, forces a comprehensive
 * soft layout restoration pass via `.restore()`, and subsequently triggers the synchronization routine `.rescan()`. Finally, it queries the public diagnostics channel to verify that the fresh post-reconciled metrics snapshot
 * maps perfectly against the expected tracking capacity baseline targets.
 *
 * @param {TestContext} testContext - The active testing context container holding the expected target layout volume counters.
 * @param {CacheMetricsSnapshot} expectedStats - The target baseline metrics blueprint containing exact expected value benchmarks.
 *
 * @returns {void}
 */
function testReVirtualizedDomViaRescan(testContext, expectedStats) {
  testHelper.testEntityIsDefined(globalThis.window[config.globalKey], 'window[config.globalKey]');

  globalThis.window[config.globalKey].restore();
  globalThis.window[config.globalKey].rescan();

  testStats(globalThis.window[config.globalKey].stats(), expectedStats);
  testDom(testContext);
}

/**
 * @private
 *
 * Asserts the structural markup mutations and placeholder state compliance across the live DOM tree.
 *
 * This integration test utility runs differential validation sweeps on live and virtualized element structures. It bifurcates the document inspection loop into distinct geometric zones based on viewport metrics bounds.
 * For unparked interactive elements, it verifies that target containers and nested sibling chains retain their pristine inner text layout Blueprints. Conversely, for virtualized component blocks outside viewport bounds,
 * it validates that the engine has successfully purged live element subtrees, checking that their inner HTML structures resolve to empty text slices.
 *
 * @param {TestContext} testContext - The active testing context container providing distribution schemas and element counters.
 * @param {Document} document - The specific document tree instance sandbox being evaluated for structural layout assertions.
 *
 * @returns {void}
 */
function testDom(testContext) {
  for (let turnId = 0; turnId < testContext.numberOfAliveTurns; turnId++) {
    testBlockIsAlive(turnId, testContext);
  }

  for (let turnId = testContext.numberOfAliveTurns; turnId < testContext.numberOfTurns; turnId++) {
    testBlockIsParked(turnId, testContext);
  }
}

/**
 * @private
 *
 * Asserts that a specific block node and its nested sibling chain are fully interactive, rendered, and style-pristine.
 *
 * This granular validation module checks a single block component identified by its operational sequence ID. It verifies that the targeted container carries zero custom inline style overrides, matches its expected internal
 * markup blueprint text, and checks that its downstream structural sibling node collection is fully present on the document tree with non-null contents.
 *
 * @param {number} turnId - The zero-based index or sequential identifier of the block element under test.
 * @param {TestContext} testContext - The active testing context providing the sibling distribution pattern masks.
 *
 * @returns {void}
 */
function testBlockIsAlive(turnId, testContext) {
  const blockId = `block-${turnId}`;
  const turn = globalThis.document.getElementById(blockId);

  testHelper.testEntityIsNotNullOrEmptyObject(turn, blockId);

  const expectedTurnHtml = `Block ${turnId}`;
  const styles = turn.getAttribute('style');

  vitest.expect(turn.innerHTML, `\n'turn.innerHTML' is '${turn.innerHTML}'\nExpected: '${expectedTurnHtml}'.\n`).toBe(expectedTurnHtml);

  testHelper.testEntityIsNull(styles, `${blockId}.styles`);

  for (let siblingId = 0; siblingId < testContext.siblingDistribution[turnId]; siblingId++) {
    const sibId = `sib-${turnId}-${siblingId}`;
    const sibling = globalThis.document.getElementById(sibId);

    testHelper.testEntityIsNotNull(sibling, sibId);

    const expectedSiblingHtml = `Sibling ${turnId}.${siblingId}`;

    vitest.expect(sibling.innerHTML, `\n'sibling.innerHTML' is '${sibling.innerHTML}'\nExpected: '${expectedSiblingHtml}'.\n`).toBe(expectedSiblingHtml);
  }
}

/**
 * @private
 *
 * Asserts that a specific block node is virtualized, carrying explicit constraint styles and a purged subtree layout.
 *
 * This granular validation module evaluates the placeholder compliance of an off-screen or unmounted block component. It confirms that the container element's inner HTML subtree has been cleared to an empty text slice,
 * strictly verifies that its inline dimensions are locked into the standard virtualization style blueprint (`height: 100px; min-height: 100px; overflow: hidden;`),
 * and asserts that all its corresponding structural sibling components have been completely evicted from the DOM.
 *
 * @param {number} turnId - The zero-based index or sequential identifier of the block element under test.
 * @param {TestContext} testContext - The active testing context providing the sibling distribution pattern masks.
 *
 * @returns {void}
 */
function testBlockIsParked(turnId, testContext) {
  const expectedStyles = 'height: 100px; min-height: 100px; overflow: hidden;';
  const blockId = `block-${turnId}`;
  const turn = globalThis.document.getElementById(blockId);

  testHelper.testEntityIsNotNullOrEmptyObject(turn, blockId);

  const styles = turn.getAttribute('style');

  vitest.expect(turn.innerHTML, `\n'turn.innerHTML' is '${turn.innerHTML}'\nExpected: ''.\n`).toBe('');
  vitest.expect(styles, `\n'${blockId}.styles' is '${styles}'\nExpected: '${expectedStyles}'.\n`).toBe(expectedStyles);

  for (let siblingId = 0; siblingId < testContext.siblingDistribution[turnId]; siblingId++) {
    const sibId = `sib-${turnId}-${siblingId}`;
    const sibling = globalThis.document.getElementById(sibId);

    testHelper.testEntityIsNull(sibling, sibId);
  }
}

/**
 * @private
 *
 * Asserts the initial layout virtualization state, telemetry baseline counters, and DOM markup on script startup.
 *
 * This integration test utility validates the extension's execution checkpoint immediately following its bootstrap mounting pass. It verifies the presence of the public global interface wrapper, checks that
 * the startup telemetry metrics align perfectly with the target count thresholds, and triggers a full structural layout sweep over the active document tree to confirm that interactive elements and virtualized placeholders
 * conform to explicit specification rules.
 *
 * @param {TestContext} testContext - The active testing context container providing distribution schemas and element counters.
 * @param {CacheMetricsSnapshot} expectedStats - The target baseline metrics blueprint containing exact expected value benchmarks.
 *
 * @returns {void}
 */
function testVirtualizedDomOnStart(testContext, expectedStats) {
  testHelper.testEntityIsDefined(globalThis.window[config.globalKey], 'window[config.globalKey]');

  testStats(globalThis.window[config.globalKey].stats(), expectedStats);
  testDom(testContext);
}

/**
 * @private
 * @async
 *
 * Asynchronously asserts the dynamic viewport virtualization state transitions triggered by a window scroll event.
 *
 * This integration test utility evaluates layout virtualization updates under dynamic scroll conditions. It runs a pre-flight configuration check to verify that active component counts exceed maximum cache storage thresholds,
 * establishes initial layout states, and leverages the context's `.mocks` registry to intercept geometry boxes. By updating coordinates to shift a live block out of view (`top: -1500`) and pull a placeholder block into view
 * (`top: 300`), it fires a native window scroll event stream. Finally, it awaits event throttling boundaries to verify that the engine accurately flips component states, unmounting the hidden node while populating the visible target.
 *
 * @param {TestContext} testContext - The active testing context container providing distribution schemas, element counters, and layout mock spies.
 *
 * @returns {Promise<void>} A promise that resolves once the scroll event cycle is processed and post-mutation layout assertions settle completely.
 */
async function testVirtualizationOnWindowScrollAsync(testContext) {
  checkingFeasibilityOfPerformingTest(testContext);

  testBlockIsParked(config.keepMax, testContext);
  testBlockIsAlive(0, testContext);

  const spy1 = testContext.mockStates[0].mock;
  const spy2 = testContext.mockStates[config.keepMax].mock;

  spy1.mockReturnValueOnce({
    top: -1500,
    height: 100,
    bottom: -1400,
    left: 0,
    right: 0,
    width: 100,
    x: 0,
    y: -1500,
    toJSON: () => ({})
  });

  spy2.mockReturnValueOnce({
    top: 300,
    height: 100,
    bottom: 400,
    left: 0,
    right: 0,
    width: 100,
    x: 0,
    y: 300,
    toJSON: () => ({})
  });

  await dispatchScrollEventAsync();

  testBlockIsParked(0, testContext);
  testBlockIsAlive(config.keepMax, testContext);
}

/**
 * @private
 *
 * Asserts the feasibility criteria of the active sandbox configuration before running layout specs.
 *
 * This pre-flight validation hook ensures the execution environment contains the necessary state parameters for layout virtualization tests. It evaluates the engine's threshold bound (`config.keepMax`)
 * against the total number of populated components generated within the testing context, leveraging Vitest to guarantee that the mock DOM possesses an out-of-bounds subset of elements required to
 * create virtual placeholders. If the capacity baseline is insufficient, it throws an explicit descriptive terminal error suggesting a corrective configuration layout change.
 *
 * @param {TestContext} testContext - The active testing context token providing the raw generated element counters.
 *
 * @returns {void}
 */
function checkingFeasibilityOfPerformingTest(testContext) {
  vitest
    .expect(
      config.keepMax >= testContext.numberOfTurns,
      `\nThis test cannot be performed.\nReason: There are no parked blocks due to a high 'config.keepMax' value.\nSolution: Increase the number of blocks in the test DOM to at least ${config.keepMax + 1}.\n`
    )
    .toBe(false)
  ;
}

/**
 * @private
 * @async
 *
 * Dispatches a native window scroll event and asynchronously yields control to align with the next browser rendering frame.
 *
 * This testing sandbox utility orchestrates micro-task and layout pipeline timing constraints. It synchronously triggers a native 'scroll' event directly onto the global window instance to prompt active engine evaluation passes.
 * Simultaneously, it captures and wraps the browser's native rendering frame callback (`requestAnimationFrame`) inside a promise barrier, forcing the test thread to yield control until the layout engine clears its scheduled scanning
 * loops and settles operations right before the next visual paint cycle occurs.
 *
 * @returns {Promise<void>} A promise that resolves once the scroll event loop cycles and the next animation frame callback settles.
 */
async function dispatchScrollEventAsync() {
  globalThis.window.dispatchEvent(new Event('scroll'));

  await new Promise((resolve) => globalThis.window.requestAnimationFrame(resolve));
}

/**
 * @private
 * @async
 *
 * Asynchronously asserts that removing a tracked container from the active DOM tree triggers automated cache eviction.
 *
 * This integration test utility evaluates the garbage collection and MutationObserver synchronization loops of the runtime layout virtualization engine. It verifies baseline environment feasibility, targets the final structural
 * component node block, and physically ejects it from the living DOM tree via `.remove()`. It then dispatches an animation-frame scroll event sequence to let scheduled layout scanning mutations settle, querying the public
 * telemetry channel to verify that the engine successfully unmounted and evicted the dead placeholder entry from its internal cache storage buffers.
 *
 * @param {TestContext} testContext - The active testing context container providing distribution schemas, element counters, and layout mock spies.
 *
 * @returns {Promise<void>} A promise that resolves once the physical node removal mutations settle and the cache capacity eviction assertions conclude.
 */
async function testCacheEvictionOnBlockRemovalAsync(testContext) {
  checkingFeasibilityOfPerformingTest(testContext);

  const removedBlock = globalThis.document.getElementById(`block-${testContext.numberOfTurns - 1}`);

  testHelper.testEntityIsNotNullOrEmptyObject(removedBlock);

  removedBlock.remove();

  await dispatchScrollEventAsync();

  const actualStats = globalThis.window[config.globalKey].stats();

  /** @type {CacheMetricsSnapshot} */
  const expectedStats = {
    totalTurnsInDOM: testContext.numberOfTurns - 1,
    parkedBlocksCount: testContext.numberOfParkedTurns - 1,
    aliveTurnsCount: testContext.numberOfAliveTurns
  };

  testStats(actualStats, expectedStats);
}

/**
 * @private
 * @async
 *
 * Asynchronously asserts that appending a fresh DOM element triggers automatic mutation tracking and cache placeholder virtualization.
 *
 * This integration test utility evaluates the automated DOM tracking resilience of the engine. It creates a brand new out-of-viewport container component (`top: 6000`),
 * verifies that it does not initially exist within the active document registry, and appends it to the live document body context to fire a simulated mutation.
 * It then triggers an animation-frame scroll sequence, letting the `MutationObserver` synchronization loops catch the injection and automatically process layout sweeps.
 * Finally, it compiles a new structural tracking context layer to confirm that telemetry metrics adjust and that the newly injected node is correctly virtualized
 * into a parked placeholder state without polluting adjacent layout cells.
 *
 * @param {TestContext} testContext - The active testing context snapshot tracking original layout volume counters and sibling patterns.
 *
 * @returns {Promise<void>} A promise that resolves once the structural mutations settle, telemetry counters update, and node placeholder assertions finish.
 */
async function testAutomaticVirtualizationViaMutationObserverAsync(testContext) {
  const newBlock = globalThis.document.createElement('div');

  newBlock.className = 'CKgc1d';
  newBlock.setAttribute('data-scope-id', 'turn');
  newBlock.id = `block-${testContext.numberOfTurns}`;
  newBlock.innerHTML = `Block ${testContext.numberOfTurns}`;

  const spy = vitest
    .vi
    .spyOn(newBlock, getBoundingClientRectKey)
    .mockReturnValue({
      top: 6000,
      height: 100,
      bottom: 6100,
      left: 0,
      right: 0,
      width: 100,
      x: 0,
      y: 6000,
      toJSON: () => ({})
    })
  ;

  testHelper.testEntityIsNull(globalThis.document.getElementById(newBlock.id), newBlock.id);

  globalThis.document.body.appendChild(newBlock);

  await dispatchScrollEventAsync();

  const actualStats = globalThis.window[config.globalKey].stats();

  /** @type {TestContext} */
  const newTestContext = {
    numberOfTurns: testContext.numberOfTurns + 1,
    numberOfAliveTurns: testContext.numberOfAliveTurns,
    numberOfParkedTurns: testContext.numberOfParkedTurns + 1,
    htmlString: globalThis.document.body.innerHTML,
    siblingDistribution: [ ...testContext.siblingDistribution, 0 ],
    documentSnapshot: testContext.documentSnapshot,
    mockStates: testContext.mockStates
  };

  /** @type {CacheMetricsSnapshot} */
  const expectedStats = {
    totalTurnsInDOM: testContext.numberOfTurns + 1,
    parkedBlocksCount: testContext.numberOfParkedTurns + 1,
    aliveTurnsCount: testContext.numberOfAliveTurns
  };

  testStats(actualStats, expectedStats);
  testBlockIsParked(testContext.numberOfTurns, newTestContext);

  spy.mockRestore();
}
