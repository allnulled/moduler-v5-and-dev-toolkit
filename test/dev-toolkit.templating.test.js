module.exports = async function ({ DevToolkit, devToolkit, startTime, titleColumns }) {
  const { assert } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "Templating".padEnd(titleColumns) });
  assert(1, "Starting DevToolkit.Templating test");
  assert(typeof DevToolkit.Templating.Tjs === "function", "Can find DevToolkit.Templating.Tjs");
  assert(devToolkit.templating.tjs instanceof DevToolkit.Templating.Tjs, "Can compile html string using DevToolkit.prototype.templating.tjs.renderFile");
  Ejemplo_con_html_e_include: {
    const output = await devToolkit.templating.tjs.renderFile("html-as-string.test/component.js");
    assert(output === 'static source = "<div>Mensaje</div>";', "Can compile html string using stringifyFile accepting relative path");
  }
  Ejemplo_con_injection_directamente: {
    const output = await devToolkit.templating.tjs.renderFile("injection-syntax/main.js");
    const syncFunction = new Function(output);
    const result = syncFunction();
    assert(result.a === 1, "Can compile using injection syntax (punto 1)");
    assert(result.b === 2, "Can compile using injection syntax (punto 2)");
    assert(result.c === 3, "Can compile using injection syntax (punto 3)");
  }
};