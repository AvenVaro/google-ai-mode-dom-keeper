import * as vitest from 'vitest';

//================================
// Typedefs
//================================

/**
 * @typedef {import('./test-helper').TestHelper} TestHelper
 */

//================================
// Constants
//================================

/** @type {TestHelper} */
const testHelper = Object.freeze({
  testEntityIsFunction: testEntityIsFunction,
  testEntityIsObject: testEntityIsObject,
  testEntityIsNotNullOrEmptyObject: testEntityIsNotNullOrEmptyObject,
  testEntityIsImmutableObject: testEntityIsImmutableObject
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

/**
 * @private
 *
 * Asserts that a targeted runtime entity, namespace, or export is strictly structured as an object.
 *
 * This structural contract utility validates interface footprints within your test suites. It runs an immediate runtime reflection check via `typeof` and leverages Vitest to compare
 * the outcome against an 'object' primitive requirement, passing a padded, high-visibility error string into the matcher block to cleanly surface typing anomalies during failure sweeps.
 *
 * @param {any} entity - The live runtime component, namespace container, or export module under evaluation.
 * @param {string} entityName - The human-readable interface or variable name used to populate descriptive error traces.
 *
 * @returns {void}
 */
function testEntityIsObject(entity, entityName) {
  const actualType = typeof entity;

  vitest.expect(actualType, `\n'${entityName}' must be a object, not be a '${actualType}'.\n`).toBe('object');
}

/**
 * @private
 *
 * Asserts that a targeted runtime entity is a valid object structure that is neither null nor empty.
 *
 * This structural validation helper executes a multi-tiered contract inspection pass. It runs a baseline `typeof` verification to confirm object structuring, explicitly guards against native `null` pointer
 * anomalies, and evaluates key capacity allocations to ensure the dictionary carries active property mappings, outputting padded, high-visibility diagnostic text if any checkpoint falls short.
 *
 * @param {any} entity - The live runtime component, dictionary, or config namespace under evaluation.
 * @param {string} entityName - The human-readable variable or interface name used to populate descriptive error traces.
 *
 * @returns {void}
 */
function testEntityIsNotNullOrEmptyObject(entity, entityName) {
  testEntityIsObject(entity, entityName);

  vitest.expect(entity, `\n'${entityName}' must be not a null.\n`).not.toBeNull();
  vitest.expect(Object.keys(entity), `\n'${entityName}' must be not a empty object.\n`).not.toHaveLength(0);
}

/**
 * @private
 *
 * Asserts that a targeted entity matches a strict, populated object layout with an exact key footprint size.
 *
 * This contract tracking utility verifies the allocation boundaries of structural dictionary configurations or freeze-wrapped modules. It cascades through non-nullability and content membership validations before
 * isolating the object's active property keys, utilizing Vitest to enforce an exact capacity matching threshold to shield downstream modules from accidental field deletions or unexpected property additions.
 *
 * @param {any} entity - The live runtime component, frozen dictionary, or config namespace under evaluation.
 * @param {string} entityName - The human-readable variable or interface name used to populate descriptive error traces.
 * @param {number} numberOfKeys - The target exact number of visible keys expected on the evaluated object boundary.
 *
 * @returns {void}
 */
function testEntityIsImmutableObject(entity, entityName, numberOfKeys) {
  testEntityIsNotNullOrEmptyObject(entity, entityName);

  const actualKeys = Object.keys(entity);

  vitest.expect(actualKeys, `\n'${entityName}' should have '${numberOfKeys}' keys, but it has '${actualKeys.length}'.\n`).toHaveLength(numberOfKeys);
}
