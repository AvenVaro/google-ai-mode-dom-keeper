import * as vitest from 'vitest';
import path from 'path';
import fileTestHelper from '../../file-test-helper.js';

//================================
// Tests
//================================

vitest.describe.concurrent('Assets. Icons - Integration Testing', describe);

function describe() {
  const iconsDirectoryPath = path.resolve(fileTestHelper.rootDirectoryPath, 'assets/icons');

  const icon16FilePath = path.resolve(iconsDirectoryPath, fileTestHelper.icon16FileName);
  const icon32FilePath = path.resolve(iconsDirectoryPath, fileTestHelper.icon32FileName);
  const icon48FilePath = path.resolve(iconsDirectoryPath, fileTestHelper.icon48FileName);
  const icon128FilePath = path.resolve(iconsDirectoryPath, fileTestHelper.icon128FileName);

  const icon16MetadataPromise = fileTestHelper.tryReadMetadataAsync(icon16FilePath);
  const icon32MetadataPromise = fileTestHelper.tryReadMetadataAsync(icon32FilePath);
  const icon48MetadataPromise = fileTestHelper.tryReadMetadataAsync(icon48FilePath);
  const icon128MetadataPromise = fileTestHelper.tryReadMetadataAsync(icon128FilePath);

  vitest.it.concurrent('Icon 16. Icon is exists', async () => await fileTestHelper.testIsExistsAsync(icon16MetadataPromise, fileTestHelper.icon16FileName, icon16FilePath));
  vitest.it.concurrent('Icon 32. Icon is exists', async () => await fileTestHelper.testIsExistsAsync(icon32MetadataPromise, fileTestHelper.icon32FileName, icon32FilePath));
  vitest.it.concurrent('Icon 48. Icon is exists', async () => await fileTestHelper.testIsExistsAsync(icon48MetadataPromise, fileTestHelper.icon48FileName, icon48FilePath));
  vitest.it.concurrent('Icon 128. Icon is exists', async () => await fileTestHelper.testIsExistsAsync(icon128MetadataPromise, fileTestHelper.icon128FileName, icon128FilePath));

  vitest.it.concurrent('Icon 16. Icon is PNG', async () => await fileTestHelper.testIsPngAsync(icon16MetadataPromise, fileTestHelper.icon16FileName, icon16FilePath));
  vitest.it.concurrent('Icon 32. Icon is PNG', async () => await fileTestHelper.testIsPngAsync(icon32MetadataPromise, fileTestHelper.icon32FileName, icon32FilePath));
  vitest.it.concurrent('Icon 48. Icon is PNG', async () => await fileTestHelper.testIsPngAsync(icon48MetadataPromise, fileTestHelper.icon48FileName, icon48FilePath));
  vitest.it.concurrent('Icon 128. Icon is PNG', async () => await fileTestHelper.testIsPngAsync(icon128MetadataPromise, fileTestHelper.icon128FileName, icon128FilePath));

  vitest.it.concurrent('Icon 16. Icon has strict dimensions', async () => await fileTestHelper.testHasStrictDimensionsAsync(icon16MetadataPromise, 16, 16, fileTestHelper.icon16FileName, icon16FilePath));
  vitest.it.concurrent('Icon 32. Icon has strict dimensions', async () => await fileTestHelper.testHasStrictDimensionsAsync(icon32MetadataPromise, 32, 32, fileTestHelper.icon32FileName, icon32FilePath));
  vitest.it.concurrent('Icon 48. Icon has strict dimensions', async () => await fileTestHelper.testHasStrictDimensionsAsync(icon48MetadataPromise, 48, 48, fileTestHelper.icon48FileName, icon48FilePath));
  vitest.it.concurrent('Icon 128. Icon has strict dimensions', async () => await fileTestHelper.testHasStrictDimensionsAsync(icon128MetadataPromise, 128, 128, fileTestHelper.icon128FileName, icon128FilePath));
}
