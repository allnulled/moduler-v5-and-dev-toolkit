assert(condition, message) {
  
  if (!condition) throw new Error("AssertionError in ModulerV5: " + message);
}