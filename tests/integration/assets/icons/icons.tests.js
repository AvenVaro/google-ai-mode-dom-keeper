import * as vitest from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';
import fileTestHelper from '../../file-test-helper.js';

//================================
// Tests
//================================

vitest.describe.concurrent('Assets. Iconst - Integration Testing', describe);

function describe() {
  const iconsDirectoryPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../assets/icons');

  const icon16MetadataPromise = fileTestHelper.tryReadMetadataAsync(path.resolve(iconsDirectoryPath, 'icon-google-ai-mode-dom-keeper-16x16.png'));
  const icon32MetadataPromise = fileTestHelper.tryReadMetadataAsync(path.resolve(iconsDirectoryPath, 'icon-google-ai-mode-dom-keeper-32x32.png'));
  const icon48MetadataPromise = fileTestHelper.tryReadMetadataAsync(path.resolve(iconsDirectoryPath, 'icon-google-ai-mode-dom-keeper-48x48.png'));
  const icon128MetadataPromise = fileTestHelper.tryReadMetadataAsync(path.resolve(iconsDirectoryPath, 'icon-google-ai-mode-dom-keeper-128x128.png'));

  vitest.it.concurrent('Icon 16. Icon is exists', async () => await fileTestHelper.testIsExistsAsync(icon16MetadataPromise));
  vitest.it.concurrent('Icon 32. Icon is exists', async () => await fileTestHelper.testIsExistsAsync(icon32MetadataPromise));
  vitest.it.concurrent('Icon 48. Icon is exists', async () => await fileTestHelper.testIsExistsAsync(icon48MetadataPromise));
  vitest.it.concurrent('Icon 128. Icon is exists', async () => await fileTestHelper.testIsExistsAsync(icon128MetadataPromise));

  vitest.it.concurrent('Icon 16. Icon is PNG', async () => await fileTestHelper.testIsPngAsync(icon16MetadataPromise));
  vitest.it.concurrent('Icon 32. Icon is PNG', async () => await fileTestHelper.testIsPngAsync(icon32MetadataPromise));
  vitest.it.concurrent('Icon 48. Icon is PNG', async () => await fileTestHelper.testIsPngAsync(icon48MetadataPromise));
  vitest.it.concurrent('Icon 128. Icon is PNG', async () => await fileTestHelper.testIsPngAsync(icon128MetadataPromise));

  vitest.it.concurrent('Icon 16. Icon has strict dimensions', async () => await fileTestHelper.testHasStrictDimensionsAsync(icon16MetadataPromise, 16, 16));
  vitest.it.concurrent('Icon 32. Icon has strict dimensions', async () => await fileTestHelper.testHasStrictDimensionsAsync(icon32MetadataPromise, 32, 32));
  vitest.it.concurrent('Icon 48. Icon has strict dimensions', async () => await fileTestHelper.testHasStrictDimensionsAsync(icon48MetadataPromise, 48, 48));
  vitest.it.concurrent('Icon 128. Icon has strict dimensions', async () => await fileTestHelper.testHasStrictDimensionsAsync(icon128MetadataPromise, 128, 128));
}
