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
}

declare const testHelper: TestHelper;

export default testHelper;
