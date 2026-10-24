import * as vitest from 'vitest';
import path from 'path';
import fileTestHelper from '../../file-test-helper.js';

//================================
// Tests
//================================

vitest.describe.concurrent('Assets. Icons - Integration Testing', describe);

function describe() {
  const icon16FileName = 'icon-google-ai-mode-dom-keeper-16x16.png';
  const icon32FileName = 'icon-google-ai-mode-dom-keeper-32x32.png';
  const icon48FileName = 'icon-google-ai-mode-dom-keeper-48x48.png';
  const icon128FileName = 'icon-google-ai-mode-dom-keeper-128x128.png';

  const iconsDirectoryPath = path.resolve(fileTestHelper.rootDirectoryPath, 'assets/icons');

  const icon16FilePath = path.resolve(iconsDirectoryPath, icon16FileName);
  const icon32FilePath = path.resolve(iconsDirectoryPath, icon32FileName);
  const icon48FilePath = path.resolve(iconsDirectoryPath, icon48FileName);
  const icon128FilePath = path.resolve(iconsDirectoryPath, icon128FileName);

  const icon16MetadataPromise = fileTestHelper.tryReadMetadataAsync(icon16FilePath);
  const icon32MetadataPromise = fileTestHelper.tryReadMetadataAsync(icon32FilePath);
  const icon48MetadataPromise = fileTestHelper.tryReadMetadataAsync(icon48FilePath);
  const icon128MetadataPromise = fileTestHelper.tryReadMetadataAsync(icon128FilePath);

  vitest.it.concurrent('Icon 16. Icon is exists', async () => await fileTestHelper.testIsExistsAsync(icon16MetadataPromise, icon16FileName, icon16FilePath));
  vitest.it.concurrent('Icon 32. Icon is exists', async () => await fileTestHelper.testIsExistsAsync(icon32MetadataPromise, icon32FileName, icon32FilePath));
  vitest.it.concurrent('Icon 48. Icon is exists', async () => await fileTestHelper.testIsExistsAsync(icon48MetadataPromise, icon48FileName, icon48FilePath));
  vitest.it.concurrent('Icon 128. Icon is exists', async () => await fileTestHelper.testIsExistsAsync(icon128MetadataPromise, icon128FileName, icon128FilePath));

  vitest.it.concurrent('Icon 16. Icon is PNG', async () => await fileTestHelper.testIsPngAsync(icon16MetadataPromise));
  vitest.it.concurrent('Icon 32. Icon is PNG', async () => await fileTestHelper.testIsPngAsync(icon32MetadataPromise));
  vitest.it.concurrent('Icon 48. Icon is PNG', async () => await fileTestHelper.testIsPngAsync(icon48MetadataPromise));
  vitest.it.concurrent('Icon 128. Icon is PNG', async () => await fileTestHelper.testIsPngAsync(icon128MetadataPromise));

  vitest.it.concurrent('Icon 16. Icon has strict dimensions', async () => await fileTestHelper.testHasStrictDimensionsAsync(icon16MetadataPromise, 16, 16));
  vitest.it.concurrent('Icon 32. Icon has strict dimensions', async () => await fileTestHelper.testHasStrictDimensionsAsync(icon32MetadataPromise, 32, 32));
  vitest.it.concurrent('Icon 48. Icon has strict dimensions', async () => await fileTestHelper.testHasStrictDimensionsAsync(icon48MetadataPromise, 48, 48));
  vitest.it.concurrent('Icon 128. Icon has strict dimensions', async () => await fileTestHelper.testHasStrictDimensionsAsync(icon128MetadataPromise, 128, 128));
}
