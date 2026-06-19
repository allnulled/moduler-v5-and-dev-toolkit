module.exports = async function ({ DevToolkit, devToolkit, startTime, titleColumns }) {
  const { assert } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "DevToolkit/ReadmeExamples".padEnd(titleColumns) });
  assert(1, "Starting DevToolkit/ReadmeExamples test");
  
  const source = await devToolkit.templating.tjs.renderFile("injection-syntax/main.js");
  const callback = new Function(source);
  const result = callback();
  assert(typeof result === "object", "Can support $injection syntax (point 1)");
  assert(result.a === 1, "Can support $injection syntax (point 2)");
  assert(result.b === 2, "Can support $injection syntax (point 3)");
  assert(result.c === 3, "Can support $injection syntax (point 4)");
};