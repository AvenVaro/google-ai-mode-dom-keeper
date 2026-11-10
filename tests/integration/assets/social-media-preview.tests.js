import * as vitest from 'vitest';
import path from 'path';
import fileTestHelper from '../file-test-helper.js';

//================================
// Tests
//================================

vitest.describe.concurrent('Assets. Social Media Preview - Integration Testing', describe);

function describe() {
  const socialMediaPreviewBannerFileName = 'github-repository-google-ai-mode-dom-keeper-social-media-preview-1280x640-compressed.png';
  const socialMediaPreviewFilePath = path.resolve(fileTestHelper.rootDirectoryPath, 'assets', socialMediaPreviewBannerFileName);
  const socialMediaPreviewMetadataPromise = fileTestHelper.tryReadMetadataAsync(socialMediaPreviewFilePath);

  vitest.it.concurrent('Social Media Preview is exists', async () => await fileTestHelper.testIsExistsAsync(socialMediaPreviewMetadataPromise, socialMediaPreviewBannerFileName, socialMediaPreviewFilePath));
  vitest.it.concurrent('Social Media Preview is PNG', async () => await fileTestHelper.testIsPngAsync(socialMediaPreviewMetadataPromise, socialMediaPreviewBannerFileName, socialMediaPreviewFilePath));
  vitest.it.concurrent('Social Media Preview has strict dimensions', async () => await fileTestHelper.testHasStrictPngDimensionsAsync(socialMediaPreviewMetadataPromise, 1280, 640, socialMediaPreviewBannerFileName, socialMediaPreviewFilePath));
}
