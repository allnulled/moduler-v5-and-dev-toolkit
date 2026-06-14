/**
 * @name DevToolkit.Testing.Asserter.AssertionError
 * @type class
 * @extends Error
 * @description Subclase de `Error` que representa un fallo en aserción. 
 */
static AssertionError = class AssertionError extends Error {
  constructor(...args) {
    super(...args);
    this.name = "AssertionError";
  }
}
