/**
 * Provides an immutable, freeze-wrapped interface controlling boundary interface validations and type contract testing assertions.
 */
export interface TestHelper {
  /**
   * Asserts that a targeted runtime entity or export is strictly structured as a function.
   *
   * @param entity - The live runtime component, object property, or export module under evaluation.
   * @param entityName - The human-readable interface or variable name used to populate descriptive error traces.
   */
  testEntityIsFunction(entity: any, entityName: string): void; // eslint-disable-line @typescript-eslint/no-explicit-any

  /**
   * Asserts that a targeted runtime entity, namespace, or export is strictly structured as an object.
   *
   * @param entity - The live runtime component, object property, or export module under evaluation.
   * @param entityName - The human-readable interface or variable name used to populate descriptive error traces.
   */
  testEntityIsObject(entity: any, entityName: string): void; // eslint-disable-line @typescript-eslint/no-explicit-any

  /**
   * Asserts that a targeted runtime entity is a valid object structure that is neither null nor empty.
   *
   * @param entity - The live runtime component, dictionary, or config namespace under evaluation.
   * @param entityName - The human-readable variable or interface name used to populate descriptive error traces.
   */
  testEntityIsNotNullOrEmptyObject(entity: any, entityName: string): void; // eslint-disable-line @typescript-eslint/no-explicit-any

  /**
   * Asserts that a targeted entity matches a strict, populated object layout with an exact key footprint size.
   *
   * @param entity - The live runtime component, frozen dictionary, or config namespace under evaluation.
   * @param entityName - The human-readable variable or interface name used to populate descriptive error traces.
   * @param numberOfKeys - The target exact number of visible keys expected on the evaluated object boundary.
   */
  testEntityIsImmutableObject(entity: any, entityName: string, numberOfKeys: number): void; // eslint-disable-line @typescript-eslint/no-explicit-any

  /**
   * Generates a standardized, padded diagnostic error message for object key footprint capacity violations.
   *
   * This utility acts as a centralized string formatter for interface structural verification assertions. It processes the targeted entity name identifier alongside its expected and actual runtime key counts,
   * compiling them into a uniform multiline error notification block. This error string is intended to be fed directly into test assertion frameworks or exceptions to cleanly isolate capacity mismatches.
   *
   * @param entityName - The human-readable name or qualified path of the runtime module or object under validation.
   * @param expectedNumberOfKeys - The target exact number of visible keys expected by the structural contract interface rules.
   * @param actualNumberOfKeys - The live, unresolved count of property keys discovered on the evaluated object boundary.
   *
   * @returns A formatted, padded diagnostic error string isolating the structural key count violation.
   */
  createEntityInvalidKeysCountErrorMessage(entityName: string, expectedNumberOfKeys: number, actualNumberOfKeys: number): string;
}

declare const testHelper: TestHelper;

export default testHelper;
