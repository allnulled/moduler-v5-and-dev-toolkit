static AssertionError = class AssertionError extends Error {
  constructor(...args) {
    super(...args);
    this.name = "AssertionError";
  }
}
