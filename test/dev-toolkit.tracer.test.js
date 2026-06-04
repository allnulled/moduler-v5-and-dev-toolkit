module.exports = async function ({ DevToolkit, devToolkit, startTime, titleColumns }) {
  const { assert } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "Tracer".padEnd(titleColumns) });
  assert(1, "Starting DevToolkit.Tracer test");
  assert(typeof DevToolkit.Tracer === "function", "Can find DevToolkit.Tracer");
  // console.log("events test");
  // console.log(DevToolkit);
  // console.log(devToolkit);
  // throw new Error("Incompleted");
};