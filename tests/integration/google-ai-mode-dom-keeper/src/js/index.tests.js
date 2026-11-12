// @vitest-environment jsdom

import * as vitest from 'vitest';
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

vitest.describe('Google AI Mode DOM Keeper. src/index.js - Integration Testing', describe);

function describe() {
  const indexJsFileName = 'index.js';
  const indexJsFilePath = path.resolve(fileTestHelper.rootDirectoryPath, 'google-ai-mode-dom-keeper/src/js', indexJsFileName);
  const metadataPromise = fileTestHelper.tryReadMetadataAsync(indexJsFilePath);
  const testContext = integrationVirtualTestHelper.createAndConfigureTestContext();

  /** @type {CacheMetricsSnapshot} */
  const expectedStats = {
    totalTurnsInDOM: testContext.numberOfTurns,
    parkedBlocksCount: testContext.numberOfParkedTurns,
    aliveTurnsCount: testContext.numberOfAliveTurns
  };

  vitest.beforeEach(async () => await import('../../../../../google-ai-mode-dom-keeper/src/js/index.js'));
  vitest.afterEach(() => integrationVirtualTestHelper.afterEach(testContext));
  vitest.afterAll(() => vitest.vi.restoreAllMocks());

  vitest.it(`${indexJsFileName} is exists`, async () => await fileTestHelper.testIsExistsAsync(metadataPromise, indexJsFileName, indexJsFilePath));

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
