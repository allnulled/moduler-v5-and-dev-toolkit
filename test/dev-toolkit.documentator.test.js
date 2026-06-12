module.exports = async function (...args) {
  const { DevToolkit, devToolkit, ModulerV5, startTime, titleColumns } = args[0];
  const { assert } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "DevToolkit/documentator".padEnd(titleColumns) });
  assert(1, "DevToolkit/documentator");
  const docs = await devToolkit.documentator.extractJavadocCommentsFromDirectory();
  for(let index=0; index<docs.length; index++) {
    const doc = docs[index];
    console.log(doc);
  }
  console.log(JSON.stringify(docs, null, 2));
  DevToolkit.Debug.die(0);
};