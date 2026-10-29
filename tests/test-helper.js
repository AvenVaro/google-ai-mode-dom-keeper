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
  testEntityIsImmutableObject: testEntityIsImmutableObject,
  testEntityIsDefined: testEntityIsDefined,
  createEntityInvalidKeysCountErrorMessage: createEntityInvalidKeysCountErrorMessage
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

  vitest.expect(actualKeys, createEntityInvalidKeysCountErrorMessage(entityName, numberOfKeys, actualKeys.length)).toHaveLength(numberOfKeys);
}

/**
 * @private
 *
 * Asserts that a targeted runtime entity, module export, or property is securely defined.
 *
 * This structural contract utility serves as a baseline lifecycle check within your test suites. It evaluates the target reference and leverages Vitest to strictly enforce that the payload
 * is defined, passing a padded, high-visibility error notification block into the matcher to cleanly isolate missing reference anomalies during execution passes.
 *
 * @param {any} entity - The live runtime component, object property, or module export under evaluation.
 * @param {string} entityName - The human-readable variable or interface name used to populate descriptive error traces.
 *
 * @returns {void}
 */
function testEntityIsDefined(entity, entityName) {
  vitest.expect(entity, `\n'${entityName}' is not defined.\n`).toBeDefined();
}

/**
 * @private
 *
 * Generates a standardized, padded diagnostic error message for object key footprint capacity violations.
 *
 * This utility acts as a centralized string formatter for interface structural verification assertions. It processes the targeted entity name identifier alongside its expected and actual runtime key counts,
 * compiling them into a uniform multiline error notification block. This error string is intended to be fed directly into test assertion frameworks or exceptions to cleanly isolate capacity mismatches.
 *
 * @param {string} entityName - The human-readable name or qualified path of the runtime module or object under validation.
 * @param {number} expectedNumberOfKeys - The target exact number of visible keys expected by the structural contract interface rules.
 * @param {number} actualNumberOfKeys - The live, unresolved count of property keys discovered on the evaluated object boundary.
 *
 * @returns {string} A formatted, padded diagnostic error string isolating the structural key count violation.
 */
function createEntityInvalidKeysCountErrorMessage(entityName, expectedNumberOfKeys, actualNumberOfKeys) {
  return `\n'${entityName}' should have '${expectedNumberOfKeys}' keys, but it has '${actualNumberOfKeys}'.\n`;
}
