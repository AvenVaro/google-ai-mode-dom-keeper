import * as vitest from 'vitest';
import path from 'path';
import fileTestHelper from '../file-test-helper.js';

//================================
// Tests
//================================

vitest.describe.concurrent('Assets. Store Banner - Integration Testing', describe);

function describe() {
  const storeBannerFileName = 'github-repository-google-ai-mode-dom-keeper-social-store-banner-480x240-compressed.png';
  const storeBannerFilePath = path.resolve(fileTestHelper.rootDirectoryPath, 'assets', storeBannerFileName);
  const storeBannerMetadataPromise = fileTestHelper.tryReadMetadataAsync(storeBannerFilePath);

  vitest.it.concurrent('Store Banner is exists', async () => await fileTestHelper.testIsExistsAsync(storeBannerMetadataPromise, storeBannerFileName, storeBannerFilePath));
  vitest.it.concurrent('Store Banner is PNG', async () => await fileTestHelper.testIsPngAsync(storeBannerMetadataPromise));
  vitest.it.concurrent('Store Banner has strict dimensions', async () => await fileTestHelper.testHasStrictDimensionsAsync(storeBannerMetadataPromise, 480, 240));
}
