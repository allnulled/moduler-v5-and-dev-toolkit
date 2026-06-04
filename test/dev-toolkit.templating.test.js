module.exports = async function ({ DevToolkit, devToolkit, startTime, titleColumns }) {
  const { assert } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "Templating".padEnd(titleColumns) });
  assert(1, "Starting DevToolkit.Templating test");
  assert(typeof DevToolkit.Templating.Tjs === "function", "Can find DevToolkit.Templating.Tjs");
  assert(devToolkit.templating.tjs instanceof DevToolkit.Templating.Tjs, "Can compile html string using DevToolkit.prototype.templating.tjs.renderFile");
  const output = await devToolkit.templating.tjs.renderFile("html-as-string.test/component.js");
  assert(output === 'static source = "<div>Mensaje</div>";', "Can compile html string using stringifyFile accepting relative path");
};