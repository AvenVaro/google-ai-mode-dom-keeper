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
}

declare const testHelper: TestHelper;

export default testHelper;
