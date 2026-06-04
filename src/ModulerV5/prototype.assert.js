assert(condition, message) {
  this.trace("assert", arguments);
  if (!condition) throw new Error("AssertionError in ModulerV5: " + message);
}