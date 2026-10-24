import * as vitest from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';
import fileTestHelper from '../file-test-helper.js';

//================================
// Tests
//================================

vitest.describe.concurrent('Assets. Store Banner - Integration Testing', describe);

function describe() {
  const assetsDirectoryPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../assets');

  const icon16MetadataPromise = fileTestHelper.tryReadMetadataAsync(path.resolve(assetsDirectoryPath, 'github-repository-google-ai-mode-dom-keeper-social-store-banner-480x240-compressed.png'));

  vitest.it.concurrent('Store Banner is exists', async () => await fileTestHelper.testIsExistsAsync(icon16MetadataPromise));
  vitest.it.concurrent('Store Banner is PNG', async () => await fileTestHelper.testIsPngAsync(icon16MetadataPromise));
  vitest.it.concurrent('Store Banner has strict dimensions', async () => await fileTestHelper.testHasStrictDimensionsAsync(icon16MetadataPromise, 480, 240));
}
