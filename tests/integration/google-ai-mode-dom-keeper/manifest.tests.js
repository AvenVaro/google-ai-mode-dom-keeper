import * as vitest from 'vitest';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fileTestHelper from '../file-test-helper.js';

//================================
// Typedefs
//================================

/**
 * @typedef {import('ajv').ErrorObject} ErrorObject
 * @typedef {import('webextension-polyfill').Manifest.WebExtensionManifest} Manifest
 * @typedef {import('webextension-polyfill').Manifest.WebExtensionManifest.ContentScript} ContentScript
 */

//================================
// Tests
//================================

vitest.describe.concurrent('Google AI Mode DOM Keeper. manifest.json - Integration Testing', describe);

function describe() {
  const manifestJsonFileName = 'manifest.json';
  const manifestJsonFilePath = path.resolve(fileTestHelper.rootDirectoryPath, 'google-ai-mode-dom-keeper', manifestJsonFileName);

  /** @type {Promise<Manifest | null>} */
  const manifestJsonPromise = fileTestHelper.tryReadJsonFileAsync(manifestJsonFilePath);

  vitest.it.concurrent('manifest.json is exists', async () => await fileTestHelper.testIsExistsAsync(manifestJsonPromise, manifestJsonFileName, manifestJsonFilePath));
  vitest.it.concurrent('manifest.json has valid schema', async () => await testManifestHasValidSchemaAsync(manifestJsonPromise, manifestJsonFileName, manifestJsonFilePath));

  vitest.it.concurrent(
    'The "icons.16" property in manifest.json has a correct value.',
    async () => await testManifestIconsHasValidPathAsync(manifestJsonPromise, manifestJsonFileName, manifestJsonFilePath, '16', fileTestHelper.icon16FileName)
  );

  vitest.it.concurrent(
    'The "icons.32" property in manifest.json has a correct value.',
    async () => await testManifestIconsHasValidPathAsync(manifestJsonPromise, manifestJsonFileName, manifestJsonFilePath, '32', fileTestHelper.icon32FileName)
  );

  vitest.it.concurrent(
    'The "icons.48" property in manifest.json has a correct value.',
    async () => await testManifestIconsHasValidPathAsync(manifestJsonPromise, manifestJsonFileName, manifestJsonFilePath, '48', fileTestHelper.icon48FileName)
  );

  vitest.it.concurrent(
    'The "icons.128" property in manifest.json has a correct value.',
    async () => await testManifestIconsHasValidPathAsync(manifestJsonPromise, manifestJsonFileName, manifestJsonFilePath, '128', fileTestHelper.icon128FileName)
  );

  vitest.it.concurrent('The "content_scripts" property in manifest.json has a correct values.', async () => await testContentScriptsHasValidValuesAsync(manifestJsonPromise, manifestJsonFileName, manifestJsonFilePath));

  vitest.it.concurrent(
    'The "name" property in manifest.json has a correct values.',
    async () => await testPropertyHasValidValueAsync(
      manifestJsonPromise,
      manifestJsonFileName,
      manifestJsonFilePath,
      'name',
      'Google AI Mode DOM Keeper'
    )
  );

  vitest.it.concurrent(
    'The "description" property in manifest.json has a correct values.',
    async () => await testPropertyHasValidValueAsync(
      manifestJsonPromise,
      manifestJsonFileName,
      manifestJsonFilePath,
      'description',
      'Virtualizes chat messages in \'Google AI Mode\' to eliminate typing delays, scrolling stutzes and input lags in massive conversations.'
    )
  );

  vitest.it.concurrent(
    'The "$schema" property in manifest.json has a correct values.',
    async () => await testPropertyHasValidValueAsync(
      manifestJsonPromise,
      manifestJsonFileName,
      manifestJsonFilePath,
      '$schema',
      './manifest-schema-v3.json'
    )
  );
}

//================================
// Private Functions
//================================

/**
 * @private
 * @async
 *
 * Asynchronously validates that the extension manifest schema complies strictly with WebExtensions V3 constraints.
 *
 * This integration test runner orchestrates structural validation passes. It resolves the targeted manifest buffer and asserts its baseline existence on disk. It then extracts the official JSON schema configuration blueprint,
 * instantiates an AJV validator, registers crucial fast string formats (e.g., match patterns and CSP blocks), and compiles the schema layout ruleset. Finally, it tests the live manifest payload against the compiled blueprint,
 * compiling a detailed descriptive failure message if schema compliance checks fall short.
 *
 * @param {Promise<Manifest | null>} manifestJsonPromise - A promise representing the pending file read pass of the target manifest configuration asset.
 * @param {string} manifestJsonFileName - The human-readable file identifier name for the manifest (e.g., "manifest.json").
 * @param {string} manifestJsonFilePath - The system absolute disk location pointer pointing to the manifest file under test.
 *
 * @returns {Promise<void>} A promise that resolves once the AJV schema compilation and Vitest validation assertions are complete.
 */
async function testManifestHasValidSchemaAsync(manifestJsonPromise, manifestJsonFileName, manifestJsonFilePath) {
  const manifest = await manifestJsonPromise;

  fileTestHelper.testIsExists(manifest, manifestJsonFileName, manifestJsonFilePath);

  const manifestSchemaFileName = 'manifest-schema-v3.json';
  const manifestSchemaFilePath = path.resolve(fileTestHelper.rootDirectoryPath, 'google-ai-mode-dom-keeper', manifestSchemaFileName);
  const manifestSchema = await fileTestHelper.tryReadJsonFileAsync(manifestSchemaFilePath);

  fileTestHelper.testIsExists(manifestSchema, manifestSchemaFileName, manifestSchemaFilePath);

  const ajv = new Ajv({ allErrors: true, strict: false });
  const formats = [ 'content-security-policy', 'glob-pattern', 'match-pattern', 'mime-type' ];

  addFormats(ajv, { mode: 'fast', formats: formats });

  for (const format of formats) {
    ajv.addFormat(format, true);
  }

  const validate = ajv.compile(manifestSchema);
  const isValidSchema = validate(manifest);

  vitest.expect(isValidSchema, createSchemaErrorMessage(validate.errors)).toBe(true);
}

/**
 * @private
 * @async
 *
 * Asynchronously asserts that a specific icon asset property in the manifest points to its correct layout file path.
 *
 * This integration test utility enforces structural filename alignment conventions within a WebExtension's configuration. It resolves the deferred manifest payload, triggers an explicit baseline presence check, and compiles a canonical
 * relative path string based on the given icon asset name. Finally, it uses Vitest to strictly validate that the nested property field matches this expected path signature exactly, outputting a descriptive error message on failure.
 *
 * @param {Promise<Manifest | null>} manifestJsonPromise - A promise representing the pending file read and parse pass of the manifest configuration asset.
 * @param {string} manifestJsonFileName - The human-readable file identifier name for the manifest (e.g., "manifest.json").
 * @param {string} manifestJsonFilePath - The absolute system disk path pointing directly to the manifest file under test.
 * @param {string} propertyName - The specific icon size property key to validate under the manifest icons dictionary (e.g., "16", "48").
 * @param {string} iconFileName - The raw expected filename of the targeted image asset on disk (e.g., "icon-16.png").
 *
 * @returns {Promise<void>} A promise that resolves once the path validation assertion is complete.
 */
async function testManifestIconsHasValidPathAsync(manifestJsonPromise, manifestJsonFileName, manifestJsonFilePath, propertyName, iconFileName) {
  const manifest = await manifestJsonPromise;

  fileTestHelper.testIsExists(manifest, manifestJsonFileName, manifestJsonFilePath);

  const expectedValue = `icons/${iconFileName}`;

  vitest.expect(manifest.icons[propertyName], createPropertyInvalidValueErrorMessage(`icons.${propertyName}`, expectedValue)).toBe(expectedValue);
}

/**
 * @private
 * @async
 *
 * Asynchronously asserts that the manifest content scripts declaration contains correct, compliant configurations.
 *
 * This integration test runner handles structural validation passes. It resolves the deferred manifest payload, asserts its baseline existence on disk, and strictly enforces that exactly one content script configuration
 * entry is declared within the `content_scripts` array bucket. It then cascades down to perform a deeper structural verification review on each declared content script record.
 *
 * @param {Promise<Manifest | null>} manifestJsonPromise - A promise representing the pending file read and parse pass of the manifest configuration asset.
 * @param {string} manifestJsonFileName - The human-readable file identifier name for the manifest (e.g., "manifest.json").
 * @param {string} manifestJsonFilePath - The absolute system disk path pointing directly to the manifest file under test.
 *
 * @returns {Promise<void>} A promise that resolves once the content scripts capacity and item validation assertions are complete.
 */
async function testContentScriptsHasValidValuesAsync(manifestJsonPromise, manifestJsonFileName, manifestJsonFilePath) {
  const manifest = await manifestJsonPromise;

  fileTestHelper.testIsExists(manifest, manifestJsonFileName, manifestJsonFilePath);

  vitest.expect(manifest.content_scripts.length, createLengthErrorMessage('manifest.content_scripts', 1)).toBe(1);

  for (let i = 0; i < manifest.content_scripts.length; i++) {
    testContentScriptHasValidValues(manifest.content_scripts[i], i);
  }
}

/**
 * @private
 *
 * Validates individual nested content script fields against expected injection specs and match patterns.
 *
 * This structural verification engine evaluates the individual content script configuration payload block. It runs precise Vitest validations enforcing element count boundaries for both the matching criteria and
 * script injection array streams. It then evaluates that the exact matching pattern, target script filename, loading lifecycle stage (`run_at`), and multi-frame processing permissions (`all_frames`) align perfectly with
 * the extension's deployment design rules.
 *
 * @param {ContentScript} contentScript - The custom structural content script profile configuration block extracted from the manifest.
 * @param {number} index - The zero-based array sequence index position of the current content script element under validation.
 *
 * @returns {void}
 */
function testContentScriptHasValidValues(contentScript, index) {
  vitest.expect(contentScript.matches.length, createLengthErrorMessage(`manifest.content_scripts[${index}].matches`, 1)).toBe(1);
  vitest.expect(contentScript.js.length, createLengthErrorMessage(`manifest.content_scripts[${index}].js`, 1)).toBe(1);

  const matches0expectedValue = '*://www.google.com/search*';
  const js0expectedValue = 'google-ai-mode-dom-keeper.js';
  const runAtExpectedValue = 'document_idle';

  vitest.expect(contentScript.matches[0], createPropertyInvalidValueErrorMessage(`manifest.content_scripts[${index}].matches[0]`, matches0expectedValue)).toBe(matches0expectedValue);
  vitest.expect(contentScript.js[0], createPropertyInvalidValueErrorMessage(`manifest.content_scripts[${index}].js[0]`, js0expectedValue)).toBe(js0expectedValue);
  vitest.expect(contentScript.run_at, createPropertyInvalidValueErrorMessage(`manifest.content_scripts[${index}].run_at`, runAtExpectedValue)).toBe(runAtExpectedValue);
  vitest.expect(contentScript.all_frames, createPropertyInvalidValueErrorMessage(`manifest.content_scripts[${index}].all_frames`, 'false')).toBe(false);
}

/**
 * @private
 * @async
 *
 * Asynchronously asserts that a top-level manifest property matches its expected scalar value.
 *
 * This integration test utility enforces configuration alignment across standard manifest fields (such as manifest_version, name, or version). It resolves the pending manifest payload, triggers
 * an explicit baseline disk presence verification, and leverages Vitest to strictly validate that the top-level property key matches the targeted configuration benchmark exactly, utilizing a
 * formatted error message string on failure.
 *
 * @param {Promise<Manifest | null>} manifestJsonPromise - A promise representing the pending file read and parse pass of the manifest configuration asset.
 * @param {string} manifestJsonFileName - The human-readable file identifier name for the manifest (e.g., "manifest.json").
 * @param {string} manifestJsonFilePath - The absolute system disk path pointing directly to the manifest file under test.
 * @param {string} propertyName - The specific top-level property key to validate under the manifest object root (e.g., "manifest_version").
 * @param {string} expectedValue - The target value or structural primitive expected by the extension configuration specifications.
 *
 * @returns {Promise<void>} A promise that resolves once the top-level value validation assertion is complete.
 */
async function testPropertyHasValidValueAsync(manifestJsonPromise, manifestJsonFileName, manifestJsonFilePath, propertyName, expectedValue) {
  const manifest = await manifestJsonPromise;

  fileTestHelper.testIsExists(manifest, manifestJsonFileName, manifestJsonFilePath);

  vitest.expect(manifest[propertyName], createPropertyInvalidValueErrorMessage(`manifest.${propertyName}`, expectedValue)).toBe(expectedValue);
}

/**
 * @private
 *
 * Generates a standardized, padded diagnostic error message for collection length or count violations.
 *
 * This utility acts as a centralized string formatter for collection capacity assertions. It processes the targeted manifest property field key alongside its strict element count threshold requirements, compiling
 * them into a uniform multiline error notification block. This error string is intended to be fed directly into test assertion frameworks or build exceptions to cleanly highlight array length mismatches.
 *
 * @param {string} propertyName - The fully qualified or nested object array key path that violated capacity rules (e.g., "permissions").
 * @param {number} numberOf - The target exact length or item count constraint expected by the extension layout.
 *
 * @returns {string} A formatted, padded diagnostic error string isolating the collection capacity violation.
 */
function createLengthErrorMessage(propertyName, numberOf) {
  return `\nNumber of [${propertyName}] must be ${numberOf}.\n`;
}

/**
 * @private
 *
 * Generates a standardized, padded diagnostic error message for property value specification violations.
 *
 * This utility acts as a centralized string formatter for configuration assertions. It processes the targeted manifest property field key alongside its canonical path requirements, compiling them into a
 * uniform multiline error notification block. This error string is intended to be fed directly into test assertion frameworks or build exceptions to cleanly highlight configuration mismatches.
 *
 * @param {string} propertyName - The fully qualified or nested object key path that violated validation rules (e.g., "icons.16").
 * @param {string} expectedValue - The target canonical value string expected by the extension specification layout.
 *
 * @returns {string} A formatted, padded diagnostic error string isolating the configuration path violation.
 */
function createPropertyInvalidValueErrorMessage(propertyName, expectedValue) {
  return `\nThe '${propertyName}' property in manifest.json has an invalid value. Expected: '${expectedValue}'\n`;
}

/**
 * @private
 *
 * Formats a structural specification violation report from an accumulation of validation errors.
 *
 * This utility acts as an error aggregation formatter (typically consuming AJV compilation outputs). It evaluates the errors payload: if the collection is null, undefined, or empty (`errors.length === 0`),
 * it yields `undefined`, signaling a pristine passing validation state. Otherwise, it compiles a multiline diagnostic block string capturing the specific field paths (`instancePath`), descriptive
 * fault messages, and structural property params violations to print a human-readable manifest review.
 *
 * @param {ErrorObject[] | null | undefined} errors - An optional array of structural compilation error logs dispatched by the schema validator.
 *
 * @returns {string | undefined} A fully formatted, multiline diagnostic report string if specification anomalies exist; otherwise, `undefined`.
 */
function createSchemaErrorMessage(errors) {
  if (errors === null || errors === undefined || errors.length === 0) {
    return undefined;
  }

  const errorMessageArray = [ '\nThe official manifest.json specification has been violated.' ];

  for (const error of errors) {
    errorMessageArray.push(`Error in field [${error.instancePath}]: ${error.message}`);

    if (error.params?.additionalProperty !== undefined) {
      errorMessageArray[errorMessageArray.length - 1] += `. Invalid property: ${error.params.additionalProperty}`;
    }
  }

  errorMessageArray.push('');

  return errorMessageArray.join('\n');
}
