import * as vitest from 'vitest';
import esmock from 'esmock';
import { JSDOM } from 'jsdom';
import cache from '../../../../google-ai-mode-dom-keeper/src/cache.js';
import testHelper from '../../../test-helper.js';

//================================
// Typedefs
//================================

/**
 * @typedef {import('../../../../google-ai-mode-dom-keeper/src/cache.d.ts').Cache} Cache
 * @typedef {import('../../../../google-ai-mode-dom-keeper/src/cache.d.ts').StyleContextPair} StyleContextPair
 */

//================================
// Constants
//================================

const dom = new JSDOM();
const turn = createTurn('test-id-global');

/** @type {StyleContextPair} */
const styleContextPair = {
  style: {
    height: 'test-height',
    minHeight: 'test-min-height',
    overflow: 'test-overflow'
  },
  context: {
    html: 'test-html',
    siblings: []
  }
};

//================================
// Tests
//================================

vitest.describe.concurrent('Cache - Unit Testing', describe);

function describe() {
  vitest.it.concurrent('size', test_size_async);
  vitest.it.concurrent('has', test_has_async);
  vitest.it.concurrent('hasNot', test_hasNot_async);
  vitest.it.concurrent('getKeys', test_getKeys_async);
  vitest.it.concurrent('keys', test_keys_async);
  vitest.it.concurrent('clear', test_clear_async);
  vitest.it.concurrent('deleteOutdated', test_deleteOutdated_async);
  vitest.it.concurrent('set', test_set_async);
  vitest.it.concurrent('pop', test_pop_async);
  vitest.it.concurrent('del', test_del_async);

  vitest.it.concurrent(
    'Should expose a strict, immutable lookup dictionary of cache',
    test_cache_isStrictImmutableDictionary
  );
}

//================================
// Private Functions
//================================

function test_cache_isStrictImmutableDictionary() {
  testHelper.testEntityIsImmutableObject(cache, 'cache', 10);

  testHelper.testEntityIsFunction(cache.size, 'size');
  testHelper.testEntityIsFunction(cache.has, 'has');
  testHelper.testEntityIsFunction(cache.hasNot, 'hasNot');
  testHelper.testEntityIsFunction(cache.getKeys, 'getKeys');
  testHelper.testEntityIsFunction(cache.keys, 'keys');
  testHelper.testEntityIsFunction(cache.clear, 'clear');
  testHelper.testEntityIsFunction(cache.deleteOutdated, 'deleteOutdated');
  testHelper.testEntityIsFunction(cache.set, 'set');
  testHelper.testEntityIsFunction(cache.pop, 'pop');
  testHelper.testEntityIsFunction(cache.del, 'del');
}

/**
 * @private
 * @async
 *
 * Asynchronously asserts the incremental state changes of the cache storage buffer capacity.
 *
 * This unit test runner orchestrates operational capacity evaluations. It instantiates an isolated sandboxed cache system, verifies that its baseline count initializes at exactly zero, commits a populated
 * component snapshot pair token, and asserts that the buffer metric accurately increments to one.
 *
 * @returns {Promise<void>} A promise that resolves once all cache capacity transitions are validated.
 */
async function test_size_async() {
  const mockedCache = await getMockedCacheAsync();

  testSize(mockedCache.size(), 0);

  mockedCache.set(turn, styleContextPair);

  testSize(mockedCache.size(), 1);
}

/**
 * @private
 * @async
 *
 * Asynchronously asserts the membership lookup state transitions of the cache storage buffer.
 *
 * This unit test runner evaluates registration predicate lookups across the cache subsystem layer. It instantiates an isolated cache engine sandbox, asserts that a detached target node initially evaluates
 * to a negative presence state (`false`), commits a baseline structural snapshot pair token, and subsequently validates that the membership query accurately switches to a positive confirmation state (`true`).
 *
 * @returns {Promise<void>} A promise that resolves once all cache presence predicate assertions complete successfully.
 */
async function test_has_async() {
  const mockedCache = await getMockedCacheAsync();

  vitest.expect(mockedCache.has(turn), createHasNotErrorMessage()).toBe(false);

  mockedCache.set(turn, styleContextPair);

  vitest.expect(mockedCache.has(turn), createHasErrorMessage()).toBe(true);
}

/**
 * @private
 * @async
 *
 * Asynchronously asserts the inverse membership lookup state transitions of the cache storage buffer.
 *
 * This unit test runner evaluates inverse registration predicate lookups across the cache subsystem layer. It instantiates an isolated cache engine sandbox, asserts that a detached target node initially evaluates
 * to a positive absence state (`true`), commits a baseline structural snapshot pair token, and subsequently validates that the inverse query accurately switches to a negative absence confirmation state (`false`).
 *
 * @returns {Promise<void>} A promise that resolves once all inverse cache presence assertions complete successfully.
 */
async function test_hasNot_async() {
  const mockedCache = await getMockedCacheAsync();

  vitest.expect(mockedCache.hasNot(turn), createHasNotErrorMessage()).toBe(true);

  mockedCache.set(turn, styleContextPair);

  vitest.expect(mockedCache.hasNot(turn), createHasErrorMessage()).toBe(false);
}

/**
 * @private
 * @async
 *
 * Asynchronously asserts the array serialization, key extraction capacity, and node identity tracking of the cache.
 *
 * This unit test runner evaluates key collection extraction mechanics. It instantiates an isolated cache engine sandbox, verifies that the returned keys collection is wrapped as a native JavaScript array,
 * and asserts structural capacity growth transitions. Finally, it pulls a deep verification sweep on the extracted key instance, checking that its native identifier maps perfectly back to the target element's node ID.
 *
 * @returns {Promise<void>} A promise that resolves once the entire array structure and element key identity assertions are complete.
 */
async function test_getKeys_async() {
  const mockedCache = await getMockedCacheAsync();

  let keys = mockedCache.getKeys();

  vitest.expect(Array.isArray(keys), '\nKeys must bee array.\n').toBe(true);

  testNumberOfKeys(keys.length, 0);

  mockedCache.set(turn, styleContextPair);

  keys = mockedCache.getKeys();

  testNumberOfKeys(keys.length, 1);

  vitest.expect(keys[0].id, `\nThe key ID must be '${turn.id}', not '${keys[0].id}'.\n`).toBe(turn.id);
}

/**
 * @private
 * @async
 *
 * Asynchronously asserts the native iterator prototype contract, lazy streaming capacity, and element identity tracking of the cache.
 *
 * This unit test runner evaluates low-level generator or iterator mechanics. It instantiates an isolated cache engine sandbox, verifies that the returned stream instance shares the structural prototype inheritance chain
 * of a native browser `MapIterator`, and assesses lazy-evaluated stream expansions using array expansion parameters. Finally, it evaluates post-assignment state mutations and asserts that the serialized stream elements retain
 * perfect node identification keys.
 *
 * @returns {Promise<void>} A promise that resolves once the MapIterator engine contract and identity token assertions are complete.
 */
async function test_keys_async() {
  const mockedCache = await getMockedCacheAsync();
  const iterator = mockedCache.keys();

  vitest.expect(iterator instanceof Object.getPrototypeOf(new Map().keys()).constructor, '\nKeys must bee array.\n').toBe(true);

  testNumberOfKeys([ ...iterator ].length, 0);

  mockedCache.set(turn, styleContextPair);

  const keys = [ ...mockedCache.keys() ];

  testNumberOfKeys(keys.length, 1);

  vitest.expect(keys[0].id, `\nThe key ID must be '${turn.id}', not '${keys[0].id}'.\n`).toBe(turn.id);
}

/**
 * @private
 * @async
 *
 * Asynchronously asserts the initialization, cache assignment capacity, and global flush purging of the memory buffer.
 *
 * This unit test runner evaluates cache destruction and flushing mechanics. It instantiates an isolated cache engine sandbox, asserts its initial empty state, and commits a baseline snapshot record. After
 * validating successful capacity expansion tracking, it triggers a total memory flush via `.clear()` and verifies that all underlying structural components are evicted, resetting the capacity counter to zero.
 *
 * @returns {Promise<void>} A promise that resolves once the entire allocation and global clearance cycle is fully validated.
 */
async function test_clear_async() {
  const mockedCache = await getMockedCacheAsync();

  testSize(mockedCache.size(), 0);

  mockedCache.set(turn, styleContextPair);

  testSize(mockedCache.size(), 1);

  mockedCache.clear();

  testSize(mockedCache.size(), 0);
}

/**
 * @private
 * @async
 *
 * Asynchronously asserts the garbage collection and stale entry eviction capabilities of the cache layers.
 *
 * This unit test runner evaluates cache synchronization and reconciliation mechanics. It instantiates an isolated cache engine sandbox, provisions a legacy element instance alongside the active component block,
 * and registers both within the tracking maps. It then triggers an explicit synchronization pass via `.deleteOutdated()`, passing an array containing only the active node reference. Finally, it validates
 * that the engine retains the fresh, visible element context while permanently purging the stale, unmapped legacy block registry slice.
 *
 * @returns {Promise<void>} A promise that resolves once the stale entry eviction and garbage-collection assertions are complete.
 */
async function test_deleteOutdated_async() {
  const mockedCache = await getMockedCacheAsync();
  const oldTurn = createTurn('test-id-old');

  vitest.expect(mockedCache.hasNot(turn), createHasNotErrorMessage()).toBe(true);
  vitest.expect(mockedCache.hasNot(oldTurn), createHasNotErrorMessage()).toBe(true);

  mockedCache.set(turn, styleContextPair);
  mockedCache.set(oldTurn, {});

  vitest.expect(mockedCache.has(turn), createHasErrorMessage()).toBe(true);
  vitest.expect(mockedCache.has(oldTurn), createHasErrorMessage()).toBe(true);

  mockedCache.deleteOutdated([ turn ]);

  vitest.expect(mockedCache.has(turn), createHasErrorMessage()).toBe(true);
  vitest.expect(mockedCache.hasNot(oldTurn), createHasNotErrorMessage()).toBe(true);
}

/**
 * @private
 * @async
 *
 * Asynchronously asserts the complete write, read, and eviction lifecycle transitions of the cache storage buffer.
 *
 * This unit test runner evaluates transactional state integrity across the cache subsystem layers. It instantiates an isolated cache engine sandbox, verifies its initial zero-capacity state, and commits
 * a baseline snapshot record. After asserting a successful capacity increment, it executes a destructive retrieval pass via `.pop()`, validating that the operation simultaneously drops the storage count back
 * to zero and yields a pristine data structure matching the original style-context pair blueprint properties.
 *
 * @returns {Promise<void>} A promise that resolves once the entire write-read-eviction cache token cycle is fully validated.
 */
async function test_set_async() {
  const mockedCache = await getMockedCacheAsync();

  testSize(mockedCache.size(), 0);

  mockedCache.set(turn, styleContextPair);

  testSize(mockedCache.size(), 1);

  const actualStyleContextPair = mockedCache.pop(turn);

  testSize(mockedCache.size(), 0);
  testStyleContextPair(actualStyleContextPair, styleContextPair);
}

/**
 * @private
 * @async
 *
 * Asynchronously asserts the destructive retrieval, membership eviction, and state extraction mechanics of the cache.
 *
 * This unit test runner evaluates atomic popping and memory eviction lifecycle sequences. It instantiates an isolated cache engine sandbox, ensures a zero-capacity starting point, commits a baseline snapshot pair record,
 * and verifies active cache registration boundaries. It then fires a destructive `.pop()` query pass to extract the style-context pair token. Finally, it validates that the lookup state successfully reverts to absent,
 * the memory count flushes back to zero, and the extracted properties retain perfect deep data integrity.
 *
 * @returns {Promise<void>} A promise that resolves once the entire write-read-eviction transactional cache token cycle is fully validated.
 */
async function test_pop_async() {
  const mockedCache = await getMockedCacheAsync();

  testSize(mockedCache.size(), 0);

  mockedCache.set(turn, styleContextPair);

  testSize(mockedCache.size(), 1);

  vitest.expect(mockedCache.has(turn), createHasErrorMessage()).toBe(true);

  const actualStyleContextPair = mockedCache.pop(turn);

  vitest.expect(mockedCache.hasNot(turn), createHasNotErrorMessage()).toBe(true);

  testSize(mockedCache.size(), 0);
  testStyleContextPair(actualStyleContextPair, styleContextPair);
}

/**
 * @private
 * @async
 *
 * Asynchronously asserts the atomic entry eviction capabilities of the cache maps.
 *
 * This unit test runner evaluates targeted memory clearance mechanics. It instantiates an isolated cache engine sandbox, registers an active component configuration alongside a companion target block,
 * and verifies their initial cached registration footprints. It then triggers an explicit eviction pass via `.del()`, targeting only the primary element. Finally, it validates that the engine
 * permanently purges the specified node records while leaving adjacent companion layout snapshot allocations completely intact.
 *
 * @returns {Promise<void>} A promise that resolves once the atomic eviction and isolation assertions are complete.
 */
async function test_del_async() {
  const mockedCache = await getMockedCacheAsync();
  const oldTurn = createTurn('test-id-old');

  vitest.expect(mockedCache.hasNot(turn), createHasNotErrorMessage()).toBe(true);
  vitest.expect(mockedCache.hasNot(oldTurn), createHasNotErrorMessage()).toBe(true);

  mockedCache.set(turn, styleContextPair);
  mockedCache.set(oldTurn, {});

  vitest.expect(mockedCache.has(turn), createHasErrorMessage()).toBe(true);
  vitest.expect(mockedCache.has(oldTurn), createHasErrorMessage()).toBe(true);

  mockedCache.del(turn);

  vitest.expect(mockedCache.hasNot(turn), createHasNotErrorMessage()).toBe(true);
  vitest.expect(mockedCache.has(oldTurn), createHasErrorMessage()).toBe(true);
}

/**
 * @private
 *
 * Asserts that the evaluated cache memory buffer size matches its expected element threshold.
 *
 * This structural validation helper compares the live runtime capacity metric against target values. It leverages Vitest to enforce strict equality, injecting a detailed multiline diagnostic feedback
 * string into the assertion block to instantly display the exact size disparity if an unexpected entry count is encountered.
 *
 * @param {number} actualSize - The live element count reported by the cache storage buffer instance.
 * @param {number} expectedSize - The target numeric threshold expected under the current test scenario stage.
 *
 * @returns {void}
 */
function testSize(actualSize, expectedSize) {
  vitest.expect(actualSize, `\nExpected cache size is '${expectedSize}', but the actual size is '${actualSize}'.\n`).toBe(expectedSize);
}

/**
 * @private
 *
 * Generates a standardized, padded diagnostic error message for missing cache value anomalies.
 *
 * This utility acts as a centralized string formatter for cache presence assertions. It returns a uniform, multiline error notification block wrapped in explicit padding breaks to cleanly
 * highlight registration drops inside test assertion suites or CI terminal logs.
 *
 * @returns {string} A formatted, padded diagnostic error string isolating the cache lookup mismatch.
 */
function createHasErrorMessage() {
  return '\nA value was expected to be in the cache, but it is not there.\n';
}

/**
 * @private
 *
 * Generates a standardized, padded diagnostic error message for unexpected cache value persistence.
 *
 * This utility acts as a centralized string formatter for inverse cache membership assertions. It returns a uniform, multiline error notification block wrapped in explicit padding breaks to cleanly
 * highlight eviction failures inside test assertion suites or CI terminal logs.
 *
 * @returns {string} A formatted, padded diagnostic error string isolating the inverse cache lookup violation.
 */
function createHasNotErrorMessage() {
  return '\nThe absence of a value in the cache was expected, but the value is actually present in the cache.\n';
}

/**
 * @private
 *
 * Asserts that the total number of extracted cache keys matches the expected element capacity.
 *
 * This structural validation helper assesses the integrity of key collections generated by your cache traversal passes. It leverages Vitest to enforce strict numeric equality, feeding a
 * formatted, highly descriptive error blueprint string into the matcher block to instantly isolate collection tracking capacity mismatches during debugging.
 *
 * @param {number} actualValue - The live number of keys extracted from the active cache memory registry.
 * @param {number} expectedValue - The target element key count expected under the current test pipeline stage.
 *
 * @returns {void}
 */
function testNumberOfKeys(actualValue, expectedValue) {
  vitest.expect(actualValue, `The number of keys should be '${expectedValue}', but it is '${actualValue}'.`).toBe(expectedValue);
}

/**
 * @private
 *
 * Executes a deep-property assertion pass comparing a live style-context configuration pair against its baseline.
 *
 * This test assertion engine performs sequential field-by-field verification of composite layout tokens. It runs individual Vitest matching routines against all encapsulated properties, validating element height
 * constraints, minimum scaling parameters, and layout overflow behaviors. Concurrently, it verifies structural context integrity by comparing serialized HTML text streams and downstream sibling node collection
 * capacities, generating isolated property-specific failure diagnostics if any snapshot parameter diverges.
 *
 * @param {StyleContextPair} actualStyleContextPair - The live runtime style-context composite snapshot record under evaluation.
 * @param {StyleContextPair} expectedStyleContextPair - The targeted baseline style-context composite signature blueprint acting as the test criteria.
 *
 * @returns {void}
 */
function testStyleContextPair(actualStyleContextPair, expectedStyleContextPair) {
  vitest
    .expect(
      actualStyleContextPair.style.height,
      `\nExpected height is '${expectedStyleContextPair.style.height}', but the actual height is '${actualStyleContextPair.style.height}'.\n`
    )
    .toBe(expectedStyleContextPair.style.height)
  ;

  vitest
    .expect(
      actualStyleContextPair.style.minHeight,
      `\nExpected minHeight is '${expectedStyleContextPair.style.minHeight}', but the actual minHeight is '${actualStyleContextPair.style.minHeight}'.\n`
    )
    .toBe(expectedStyleContextPair.style.minHeight)
  ;

  vitest
    .expect(
      actualStyleContextPair.style.overflow,
      `\nExpected overflow is '${expectedStyleContextPair.style.overflow}', but the actual overflow is '${actualStyleContextPair.style.overflow}'.\n`
    )
    .toBe(expectedStyleContextPair.style.overflow)
  ;

  vitest
    .expect(
      actualStyleContextPair.context.html,
      `\nExpected html is '${expectedStyleContextPair.context.html}', but the actual html is '${actualStyleContextPair.context.html}'.\n`
    )
    .toBe(expectedStyleContextPair.context.html)
  ;

  vitest
    .expect(
      actualStyleContextPair.context.siblings.length,
      `\nExpected siblings is '${expectedStyleContextPair.context.siblings.length}', but the actual siblings is '${actualStyleContextPair.context.siblings.length}'.\n`
    )
    .toBe(expectedStyleContextPair.context.siblings.length)
  ;
}

/**
 * @private
 * @async
 *
 * Asynchronously instantiates an isolated, mocked instance of the core cache storage subsystem.
 *
 * This test infrastructure utility intercepts system paths to compile a decoupled layout execution sandbox using the `esmock` engine. It evaluates the resolved module payload: if the object contains a standardized
 * `.default` ES-module export wrapper, it returns that binding directly; otherwise, it passes through the raw module object. If the mocking routine fails to resolve or initializes into an empty state, it throws an
 * explicit error to fail the test thread instantly.
 *
 * @returns {Promise<Cache>} A promise resolving to an isolated, mocked Cache API execution context wrapper.
 *
 * @throws {Error} Thrown if esmock fails to resolve, initialize, or load the mocked module target payload.
 */
async function getMockedCacheAsync() {
  const cache = await esmock('../../../../google-ai-mode-dom-keeper/src/cache.js');

  if (cache) {
    return cache.default || cache;
  }

  throw new Error('Error mocking cache.');
}

/**
 * @private
 *
 * Instantiates a virtualized DOM element container configured with a specific identification key.
 *
 * This testing sandbox utility leverages the active environment's virtualized window document layer to construct a detached HTML 'div' element node. It synchronously binds the provided string token
 * directly to the element's `.id` property matrix, returning a fresh mock component block ready to be piped into layout traversal or cache testing pipelines.
 *
 * @param {string} id - The explicit identification string token to assign as the element's unique DOM ID.
 *
 * @returns {Element} A detached, virtualized DOM element node instance tracking the specified identification signature.
 */
function createTurn(id) {
  const turn = dom.window.document.createElement('div');

  turn.id = id;

  return turn;
}
