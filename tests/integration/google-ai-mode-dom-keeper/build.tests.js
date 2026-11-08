import * as vitest from 'vitest';
import fs from 'fs';
import path from 'path';
import fileTestHelper from '../file-test-helper.js';

//================================
// Tests
//================================

vitest.describe('Google AI Mode DOM Keeper. build.js - Integration Testing', describe);

function describe() {
  const manifestFileName = 'manifest.json';
  const buildJsFileName = 'build.js';
  const licenseFileName = 'LICENSE';
  const noticeFileName = 'NOTICE';
  const indexJsFileName = 'index.js';

  const extensionDirectoryPath = path.resolve(fileTestHelper.rootDirectoryPath, 'google-ai-mode-dom-keeper');
  const assetsDirectoryPath = path.resolve(fileTestHelper.rootDirectoryPath, 'assets');
  const iconsDirectoryPath = path.resolve(assetsDirectoryPath, 'icons');
  const distDirectoryPath = path.resolve(extensionDirectoryPath, 'dist');
  const distJsDirectoryPath = path.resolve(distDirectoryPath, 'js');
  const distImgDirectoryPath = path.resolve(distDirectoryPath, 'img');
  const distIconsDirectoryPath = path.resolve(distImgDirectoryPath, 'icons');

  const buildJsFilePath = path.resolve(extensionDirectoryPath, buildJsFileName);
  const manifestDistFilePath = path.resolve(distDirectoryPath, manifestFileName);
  const licenseDistFilePath = path.resolve(distDirectoryPath, licenseFileName);
  const noticeDistFilePath = path.resolve(distDirectoryPath, noticeFileName);
  const indexJsDistFilePath = path.resolve(distJsDirectoryPath, indexJsFileName);
  const icon16DistFilePath = path.resolve(distIconsDirectoryPath, fileTestHelper.icon16FileName);
  const icon32DistFilePath = path.resolve(distIconsDirectoryPath, fileTestHelper.icon32FileName);
  const icon48DistFilePath = path.resolve(distIconsDirectoryPath, fileTestHelper.icon48FileName);
  const icon128DistFilePath = path.resolve(distIconsDirectoryPath, fileTestHelper.icon128FileName);

  const indexJsPromise = fileTestHelper.tryReadMetadataAsync(indexJsDistFilePath);
  const buildPromise = fileTestHelper.tryReadMetadataAsync(buildJsFilePath);
  const manifestDistPromise = fileTestHelper.tryReadFileAsync(manifestDistFilePath);
  const licenseDistPromise = fileTestHelper.tryReadFileAsync(licenseDistFilePath);
  const noticeDistPromise = fileTestHelper.tryReadFileAsync(noticeDistFilePath);
  const icon16DistPromise = fileTestHelper.tryReadFileAsync(icon16DistFilePath);
  const icon32DistPromise = fileTestHelper.tryReadFileAsync(icon32DistFilePath);
  const icon48DistPromise = fileTestHelper.tryReadFileAsync(icon48DistFilePath);
  const icon128DistPromise = fileTestHelper.tryReadFileAsync(icon128DistFilePath);

  vitest.beforeEach(async () => await beforeEachAsync(distDirectoryPath));

  vitest.it(`'${buildJsFileName}' is exists`, async () => await fileTestHelper.testIsExistsAsync(buildPromise, buildJsFileName, buildJsFilePath));

  vitest.it(`'${manifestFileName}' is exists after build`, async () => await fileTestHelper.testIsExistsAsync(manifestDistPromise, manifestFileName, manifestDistFilePath));
  vitest.it(`'${licenseFileName}' is exists after build`, async () => await fileTestHelper.testIsExistsAsync(licenseDistPromise, licenseFileName, licenseDistFilePath));
  vitest.it(`'${noticeFileName}' is exists after build`, async () => await fileTestHelper.testIsExistsAsync(noticeDistPromise, noticeFileName, noticeDistFilePath));
  vitest.it(`'${indexJsFileName}' is exists after build`, async () => await fileTestHelper.testIsExistsAsync(indexJsPromise, indexJsFileName, indexJsDistFilePath));
  vitest.it(`'${fileTestHelper.icon16FileName}' is exists after build`, async () => await fileTestHelper.testIsExistsAsync(icon16DistPromise, fileTestHelper.icon16FileName, icon16DistFilePath));
  vitest.it(`'${fileTestHelper.icon32FileName}' is exists after build`, async () => await fileTestHelper.testIsExistsAsync(icon32DistPromise, fileTestHelper.icon32FileName, icon32DistFilePath));
  vitest.it(`'${fileTestHelper.icon48FileName}' is exists after build`, async () => await fileTestHelper.testIsExistsAsync(icon48DistPromise, fileTestHelper.icon48FileName, icon48DistFilePath));
  vitest.it(`'${fileTestHelper.icon128FileName}' is exists after build`, async () => await fileTestHelper.testIsExistsAsync(icon128DistPromise, fileTestHelper.icon128FileName, icon128DistFilePath));

  vitest.it(`'${manifestFileName}' is equal to source`, async () => await testFileIsEqualAsync(manifestDistPromise, path.resolve(extensionDirectoryPath, manifestFileName)));
  vitest.it(`'${licenseFileName}' is equal to source`, async () => await testFileIsEqualAsync(licenseDistPromise, path.resolve(fileTestHelper.rootDirectoryPath, licenseFileName)));
  vitest.it(`'${noticeFileName}' is equal to source`, async () => await testFileIsEqualAsync(noticeDistPromise, path.resolve(fileTestHelper.rootDirectoryPath, noticeFileName)));
  vitest.it(`'${fileTestHelper.icon16FileName}' is equal to source`, async () => await testFileIsEqualAsync(icon16DistPromise, path.resolve(iconsDirectoryPath, fileTestHelper.icon16FileName)));
  vitest.it(`'${fileTestHelper.icon32FileName}' is equal to source`, async () => await testFileIsEqualAsync(icon32DistPromise, path.resolve(iconsDirectoryPath, fileTestHelper.icon32FileName)));
  vitest.it(`'${fileTestHelper.icon48FileName}' is equal to source`, async () => await testFileIsEqualAsync(icon48DistPromise, path.resolve(iconsDirectoryPath, fileTestHelper.icon48FileName)));
  vitest.it(`'${fileTestHelper.icon128FileName}' is equal to source`, async () => await testFileIsEqualAsync(icon128DistPromise, path.resolve(iconsDirectoryPath, fileTestHelper.icon128FileName)));
}

//================================
// Private Functions
//================================

/**
 * @private
 * @async
 *
 * Triggers an isolated cache reset, purges stale output artifacts, and executes the production compiler.
 *
 * This lifecycle setup hook sanitizes build workspaces between pipeline assertions. It flushes Vitest's module resolution cache, checks the host file system to remove old distribution binaries, and dynamically
 * executes the builder script entry point (`build.js`) to generate a fresh distribution suite.
 *
 * @param {string} distDirectoryPath - The target file-system path pointing directly to the compiled artifacts workspace directory.
 *
 * @returns {Promise<void>} A promise that resolves once the file system directory is purged and the compilation pipeline finishes.
 */
async function beforeEachAsync(distDirectoryPath) {
  vitest.vi.resetModules();

  if (fs.existsSync(distDirectoryPath)) {
    fs.rmSync(distDirectoryPath, { recursive: true, force: true });
  }

  await import('../../../google-ai-mode-dom-keeper/build.js');
}

/**
 * @private
 * @async
 *
 * Asynchronously asserts low-level binary data stream equality between a compiled distribution build artifact and a local file path.
 *
 * This build verification utility enforces production build artifact integrity. It resolves an active compilation task promise payload, reads the local reference file from the disk, and runs a strict validation sweep.
 * It leverages Vitest to verify that both targets are either identically absent (`null`) or match byte-for-byte across their memory buffer segments via `.equals()`, outputting a diagnostic fallback report if file contents diverge.
 *
 * @param {Promise<Buffer | null>} distFilePromise - An active task promise resolving to a generated distribution bundle binary data stream.
 * @param {string} filePath - The absolute or relative file-system path pointing directly to the baseline comparison file on disk.
 *
 * @returns {Promise<void>} A promise that resolves once both files are loaded, compared, and their Vitest equality matchers settle.
 */
async function testFileIsEqualAsync(distFilePromise, filePath) {
  const distFile = await distFilePromise;
  const file = await fileTestHelper.tryReadFileAsync(filePath);

  vitest
    .expect(
      (distFile === null && file === null) || distFile.equals(file),
      '\nFiles is not equal\n'
    )
    .toBe(true)
  ;
}
