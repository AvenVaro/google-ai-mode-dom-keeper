import * as vitest from 'vitest';
import path from 'path';
import fileTestHelper from '../file-test-helper.js';

//================================
// Tests
//================================

vitest.describe.concurrent('Assets. Readme Banner - Integration Testing', describe);

function describe() {
  const readmeBannerFileName = 'github-repository-google-ai-mode-dom-keeper-readme-banner-1520x608-double-compressed.webp';
  const readmeBannerFilePath = path.resolve(fileTestHelper.rootDirectoryPath, 'assets', readmeBannerFileName);
  const readmeBannerMetadataPromise = fileTestHelper.tryReadMetadataAsync(readmeBannerFilePath);

  vitest.it.concurrent('Readme Banner is exists', async () => await fileTestHelper.testIsExistsAsync(readmeBannerMetadataPromise, readmeBannerFileName, readmeBannerFilePath));
  vitest.it.concurrent('Readme Banner is WebP', async () => await fileTestHelper.testIsWebpAsync(readmeBannerMetadataPromise, readmeBannerFileName, readmeBannerFilePath));
  vitest.it.concurrent('Readme Banner has strict dimensions', async () => await fileTestHelper.testHasStrictWebpDimensionsAsync(readmeBannerMetadataPromise, 1520, 608, readmeBannerFileName, readmeBannerFilePath));
}
