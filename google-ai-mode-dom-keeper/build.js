import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

//================================
// Typedefs
//================================

/**
 * @typedef {import('./build.d.ts').DistDirectoryPaths} DistDirectoryPaths
 */

//================================
// Runtime
//================================

console.log('📦\tStarting the build of the extension...\n');

const buildJsDirectoryPath = path.dirname(fileURLToPath(import.meta.url));

const distDirectoryName = 'dist';

const distDirectoryPaths = getDistDirectoryPaths();

createDistDirectories();

await esbuild.build({
  absWorkingDir: buildJsDirectoryPath,
  entryPoints: [ 'src/index.js' ],
  bundle: true,
  outdir: distDirectoryPaths.js,
  minify: false,
  sourcemap: false,
  target: [ 'chrome100' ]
});

copyFiles();

console.log(`🚀\tBuild successfully assembled in the '${distDirectoryName}' folder!\n\tPath: '${distDirectoryPaths.dist}'\n`);

//================================
// Private Functions
//================================

/**
 * @private
 *
 * Resolves and compiles absolute file-system path vectors for distribution directories.
 *
 * This factory configuration utility orchestrates the calculation of absolute paths required by asset managers during deployment or build sweeps. It layers nested directories sequentially
 * leveraging Node's native `path.resolve` engine, and wraps the resulting keys inside a frozen, read-only structure to protect output boundaries from downstream mutation side-effects.
 *
 * @returns {Readonly<DistDirectoryPaths>} An immutable object mapping target build folders directly to their compiled directory paths.
 */
function getDistDirectoryPaths() {
  const jsDirectoryName = 'js';
  const imgDirectoryName = 'img';
  const iconsDirectoryName = 'icons';

  const distDirectoryPath = path.resolve(buildJsDirectoryPath, distDirectoryName);
  const imgDirectoryPath = path.resolve(distDirectoryPath, imgDirectoryName);

  return Object.freeze({
    dist: distDirectoryPath,
    js: path.resolve(distDirectoryPath, jsDirectoryName),
    img: imgDirectoryPath,
    icons: path.resolve(imgDirectoryPath, iconsDirectoryName)
  });
}

/**
 * @private
 *
 * Synchronously initializes the output distribution directory structure by wiping stale builds.
 *
 * This disk management utility orchestrates a clean build isolation sequence. It checks for the existence of the primary distribution root, executing a destructive recursive purge via `fs.rmSync`
 * to eliminate legacy compilation artifacts if found. It then sequentially constructs the fresh directory branches matching your asset allocation paths using consistent operational flags.
 *
 * @returns {void}
 */
function createDistDirectories() {
  if (fs.existsSync(distDirectoryPaths.dist)) {
    fs.rmSync(distDirectoryPaths.dist, { recursive: true, force: true });
  }

  /** @type {fs.MakeDirectoryOptions>} */
  const directoryOptions = { recursive: true };

  fs.mkdirSync(distDirectoryPaths.dist, directoryOptions);
  fs.mkdirSync(distDirectoryPaths.js, directoryOptions);
  fs.mkdirSync(distDirectoryPaths.img, directoryOptions);
  fs.mkdirSync(distDirectoryPaths.icons, directoryOptions);
}

/**
 * @private
 *
 * Synchronously copies static extension assets, distribution metadata, and branding assets to the build targets.
 *
 * This compilation asset manager processes and deploys non-code dependencies required to assemble a compliant, production-ready extension package. It resolves full file-system paths for documentation,
 * compliance legal sheets, manifest declarations, and varying icon scales (`16x16` up to `128x128`). It then transfers these files into their targeted target output locations using atomic copy calls.
 *
 * @returns {void}
 */
function copyFiles() {
  const manifestJsonFileName = 'manifest.json';
  const readmeMdFileName = 'README.md';

  const licenseFileName = 'LICENSE';
  const noticeFileName = 'NOTICE';

  const icon16FileName = 'icon-google-ai-mode-dom-keeper-16x16.png';
  const icon32FileName = 'icon-google-ai-mode-dom-keeper-32x32.png';
  const icon48FileName = 'icon-google-ai-mode-dom-keeper-48x48.png';
  const icon128FileName = 'icon-google-ai-mode-dom-keeper-128x128.png';

  const rootDirectoryPath = path.resolve(buildJsDirectoryPath, '..');
  const iconsDirectoryPath = path.resolve(rootDirectoryPath, 'assets/icons');

  fs.copyFileSync(path.resolve(buildJsDirectoryPath, manifestJsonFileName), path.resolve(distDirectoryPaths.dist, manifestJsonFileName));
  fs.copyFileSync(path.resolve(buildJsDirectoryPath, readmeMdFileName), path.resolve(distDirectoryPaths.dist, readmeMdFileName));

  fs.copyFileSync(path.resolve(rootDirectoryPath, licenseFileName), path.resolve(distDirectoryPaths.dist, licenseFileName));
  fs.copyFileSync(path.resolve(rootDirectoryPath, noticeFileName), path.resolve(distDirectoryPaths.dist, noticeFileName));

  fs.copyFileSync(path.resolve(iconsDirectoryPath, icon16FileName), path.resolve(distDirectoryPaths.icons, icon16FileName));
  fs.copyFileSync(path.resolve(iconsDirectoryPath, icon32FileName), path.resolve(distDirectoryPaths.icons, icon32FileName));
  fs.copyFileSync(path.resolve(iconsDirectoryPath, icon48FileName), path.resolve(distDirectoryPaths.icons, icon48FileName));
  fs.copyFileSync(path.resolve(iconsDirectoryPath, icon128FileName), path.resolve(distDirectoryPaths.icons, icon128FileName));
}
