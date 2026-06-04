module.exports = async function (...args) {
  const { DevToolkit, devToolkit, ModulerV5, startTime, titleColumns } = args[0];
  const { assert } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "DevToolkit/documentator".padEnd(titleColumns) });
  assert(1, "DevToolkit/documentator");
  await devToolkit.documentator.generateDocumentation();
  
};