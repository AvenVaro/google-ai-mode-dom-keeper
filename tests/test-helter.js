import * as vitest from 'vitest';

//================================
// Typedefs
//================================

/**
 * @typedef {import('./test-helper.d.ts').TestHelper} TestHelper
 */

//================================
// Constants
//================================

/** @type {TestHelper} */
const testHelper = Object.freeze({
  testEntityIsFunction: testEntityIsFunction
});

//================================
// Exports
//================================

export default testHelper;

//================================
// Private Functions
//================================

/**
 * @private
 *
 * Asserts that a targeted runtime entity or export is strictly structured as a function.
 *
 * This structural contract utility validates interface footprints within your test suites. It runs an immediate runtime reflection check via `typeof` and leverages Vitest to compare
 * the outcome against a 'function' primitive requirement, passing a padded, highly scannability-focused error string into the matcher block to cleanly surface typing anomalies during failure sweeps.
 *
 * @param {any} entity - The live runtime component, object property, or export module under evaluation.
 * @param {string} entityName - The human-readable interface or variable name used to populate descriptive error traces.
 *
 * @returns {void}
 */
function testEntityIsFunction(entity, entityName) {
  const actualType = typeof entity;

  vitest.expect(actualType, `\n'${entityName}' must be a function, not be a '${actualType}'.\n`).toBe('function');
}
