module.exports = async function (...args) {
  const { DevToolkit, devToolkit, ModulerV5, startTime, titleColumns } = args[0];
  const { assert, assertFileExists, assertFileMissing, } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "DevToolkit/CommandLine/api".padEnd(titleColumns) });
  assert(1, "DevToolkit/CommandLine/api");
  Los_comandos_basicos_del_cli_estan_en_la_api: {
    assert(typeof devToolkit.cli.tools.buildJs === "function", `Can find «dev build js» as method in «devToolkit.cli»`);
    assert(typeof devToolkit.cli.tools.buildCss === "function", `Can find «dev build css» as method in «devToolkit.cli»`);
    assert(typeof devToolkit.cli.tools.testJs === "function", `Can find «dev test js» as method in «devToolkit.cli»`);
    assert(typeof devToolkit.cli.tools.loop === "function", `Can find «dev loop» as method in «devToolkit.cli»`);
    assert(typeof devToolkit.cli.tools.up === "function", `Can find «dev up» as method in «devToolkit.cli»`);
  }
  Plantillas_funcionan: {
    await devToolkit.fileSystem.writeFile("devtoolkit-cli.test/api-test-1/asset-1.1.js", `1`);
    await devToolkit.fileSystem.writeFile("devtoolkit-cli.test/api-test-1/asset-1.2.js", `2`);
    await devToolkit.fileSystem.writeFile("devtoolkit-cli.test/api-test-1/asset-1.3.js", `3`);
    await devToolkit.fileSystem.writeFile("devtoolkit-cli.test/api-test-1/example-1.js", `module.exports = [
      /*<$=await include("./asset-1.1.js")$>*/,
      /*<$=await include("./asset-1.2.js")$>*/,
      /*<$=await include("./asset-1.3.js")$>*/,
    ];`);
    const outputSource = await devToolkit.templating.tjs.renderFile("devtoolkit-cli.test/api-test-1/example-1.js");
    await devToolkit.fileSystem.writeFile("devtoolkit-cli.test/api-test-1/output-1.js", outputSource);
    const output = require(devToolkit.fullpathOf("devtoolkit-cli.test/api-test-1/output-1.js"));
    assert(Array.isArray(output), "Can create templates by composition and load them (point 1)");
    assert(output[0] === 1, "Can create templates by composition and load them (point 2)");
    assert(output[1] === 2, "Can create templates by composition and load them (point 3)");
    assert(output[2] === 3, "Can create templates by composition and load them (point 4)");
  }
};