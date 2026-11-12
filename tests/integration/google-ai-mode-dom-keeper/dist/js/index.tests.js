// @vitest-environment jsdom

import * as vitest from 'vitest';
import fs from 'fs';
import path from 'path';
import integrationVirtualTestHelper from '../../integration-virtual-test-helper.js';
import fileTestHelper from '../../../file-test-helper.js';

//================================
// Typedefs
//================================

/**
 * @typedef {import('../../../../../google-ai-mode-dom-keeper/src/js/index.d.ts').CacheMetricsSnapshot} CacheMetricsSnapshot
 */

//================================
// Tests
//================================

vitest.describe('Google AI Mode DOM Keeper. dist/js/index.js - Integration Testing', describe);

function describe() {
  const distDirectoryPath = path.resolve(fileTestHelper.rootDirectoryPath, 'google-ai-mode-dom-keeper/dist');
  const testContext = integrationVirtualTestHelper.createAndConfigureTestContext();

  /** @type {CacheMetricsSnapshot} */
  const expectedStats = {
    totalTurnsInDOM: testContext.numberOfTurns,
    parkedBlocksCount: testContext.numberOfParkedTurns,
    aliveTurnsCount: testContext.numberOfAliveTurns
  };

  vitest.beforeAll(async () => await beforeAllAsync());
  vitest.beforeEach(async () => await import((() => '../../../../../google-ai-mode-dom-keeper/dist/js/index.js')()));
  vitest.afterEach(() => integrationVirtualTestHelper.afterEach(testContext));
  vitest.afterAll(() => afterAll(distDirectoryPath));

  vitest.it('Registering a global interface on \'window\'', integrationVirtualTestHelper.testGlobalInterfaceRegistration);
  vitest.it('The \'window[config.globalKey].destroy\' method completely removes the global key.', integrationVirtualTestHelper.testInterfaceRemovalViaDestroy);
  vitest.it('The \'window[config.globalKey].restore\' method completely restored the DOM.', () => integrationVirtualTestHelper.testRestoreDomViaRestore(testContext));
  vitest.it('The \'window[config.globalKey].stats\' method returns is actual statistics.', () => integrationVirtualTestHelper.testActualStatisticsViaStats(testContext, expectedStats));
  vitest.it('The \'window[config.globalKey].rescan\' method correctly re-virtualizes the DOM.', () => integrationVirtualTestHelper.testReVirtualizedDomViaRescan(testContext, expectedStats));

  vitest.it('The \'scan\' function processes the file immediately upon import.', () => integrationVirtualTestHelper.testVirtualizedDomOnStart(testContext, expectedStats));

  vitest.it('DOM virtualization works correctly during scrolling.', async () => await integrationVirtualTestHelper.testVirtualizationOnWindowScrollAsync(testContext));

  vitest.it('The cache automatically purges references to removed DOM components.', async () => await integrationVirtualTestHelper.testCacheEvictionOnBlockRemovalAsync(testContext));
  vitest.it('MutationObserver automatically virtualizes newly appended DOM components.', async () => await integrationVirtualTestHelper.testAutomaticVirtualizationViaMutationObserverAsync(testContext));
}

//================================
// Private Functions
//================================

/**
 * @private
 * @async
 *
 * Asynchronously establishes a silent compiler test workspace and triggers the compilation runner.
 *
 * This test suite lifecycle initialization hook executes once before any specification blocks run. It intercepts and silences the global console output stream (`console.log`) to suppress noisy build diagnostic
 * output from cluttering test runner reports, then dynamically imports the compiler entry point (`build.js`) to generate fresh distribution build artifacts for subsequent validation sweeps.
 *
 * @returns {Promise<void>} A promise that resolves once the logging stream is stubbed and the compiler asset generation pass completes.
 */
async function beforeAllAsync() {
  vitest.vi.spyOn(globalThis.console, 'log').mockImplementation(() => undefined);

  await import('../../../../../google-ai-mode-dom-keeper/build.js');
}

/**
 * @private
 *
 * Executes a terminal teardown sequence by restoring all mocked interfaces and purging build workspaces.
 *
 * This test suite lifecycle hook runs once after all individual specification blocks conclude execution. It triggers a total runtime restoration via `vitest.vi.restoreAllMocks` to unwrap original object descriptors
 * and restore logging streams, then queries the host file system to permanently drop the specified distribution output directory tree, leaving the testing workspace completely pristine.
 *
 * @param {string} distDirectoryPath - The absolute or relative file-system path pointing directly to the compiled output directory undergoing eviction.
 *
 * @returns {void}
 */
function afterAll(distDirectoryPath) {
  vitest.vi.restoreAllMocks();

  if (fs.existsSync(distDirectoryPath)) {
    fs.rmSync(distDirectoryPath, { recursive: true, force: true });
  }
}
