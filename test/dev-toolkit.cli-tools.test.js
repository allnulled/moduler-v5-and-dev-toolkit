module.exports = async function (...args) {
  const { DevToolkit, devToolkit, ModulerV5, startTime, titleColumns } = args[0];
  const { assert, assertFileExists, assertFileMissing, } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "DevToolkit/CommandLine/tools".padEnd(titleColumns) });
  assert(1, "DevToolkit/CommandLine/tools");
  const memorize = {};
  Proyecto_1: {
    const targetDirectory = __dirname + "/tests-assets/devtoolkit-cli.test/example-1";
    const packageJsonPath = `${targetDirectory}/package.json`;
    Empezar_un_nuevo_proyecto: {
      await DevToolkit.FileSystem.emptyDirectory(targetDirectory);
      assertFileMissing(packageJsonPath, "Can prepare newly created project (point 1)");
      await devToolkit.cli.createProject(targetDirectory);
      assertFileExists(packageJsonPath, "Can prepare newly created project (point 2)");
    }
    Los_comandos_basicos_del_cli_estan_como_tools: {
      assertFileExists(`${targetDirectory}/dev/cli/tool/build/css/build.css.js`, "Can find tool to build css in created project");
      assertFileExists(`${targetDirectory}/dev/cli/tool/build/doc/build.doc.js`, "Can find tool to build doc in created project");
      assertFileExists(`${targetDirectory}/dev/cli/tool/build/js/build.js.js`, "Can find tool to build js in created project");
      assertFileExists(`${targetDirectory}/dev/cli/tool/loop/loop.js`, "Can find tool to loop in created project");
    }
    Eliminar_todo: {
      memorize.size1 = await DevToolkit.FileSystem.sizeOf(`${targetDirectory}/src/lib/dev-toolkit/dev-toolkit.dist.js`);
      await DevToolkit.FileSystem.emptyDirectory(targetDirectory);
      assertFileMissing(packageJsonPath, "Can prepare newly created project (point 1)");
    }
  }
  Proyecto_2: {
    const targetDirectory = __dirname + "/tests-assets/devtoolkit-cli.test/example-2";
    const packageJsonPath = `${targetDirectory}/package.json`;
    Empezar_un_nuevo_proyecto: {
      await DevToolkit.FileSystem.emptyDirectory(targetDirectory);
      assertFileMissing(packageJsonPath, "Can prepare newly created project again (point 2.1)");
      await devToolkit.cli.createProject(targetDirectory);
      assertFileExists(packageJsonPath, "Can prepare newly created project again (point 2.2)");
    }
    Eliminar_todo: {
      memorize.size2 = await DevToolkit.FileSystem.sizeOf(`${targetDirectory}/src/lib/dev-toolkit/dev-toolkit.dist.js`);
      await DevToolkit.FileSystem.emptyDirectory(targetDirectory);
      assertFileMissing(packageJsonPath, "Can prepare newly created project again (point 2.1)");
    }
  }
  assert(memorize.size1 === memorize.size2, "Can inject «dev-toolkit.dist.js» without making it grow infinite")
  Esto_es_para_que_github_no_ignore_los_directorios: {
    await DevToolkit.FileSystem.writeFile(__dirname + "/tests-assets/devtoolkit-cli.test/example-1/empty.txt", "");
    await DevToolkit.FileSystem.writeFile(__dirname + "/tests-assets/devtoolkit-cli.test/example-2/empty.txt", "");
    await DevToolkit.FileSystem.writeFile(__dirname + "/tests-assets/devtoolkit-cli.test/example-3/empty.txt", "");
  }
  Proyecto_3: {
    const targetDirectory = __dirname + "/tests-assets/devtoolkit-cli.test/example-3";
    const packageJsonPath = `${targetDirectory}/package.json`;
    Empezar_un_nuevo_proyecto: {
      await DevToolkit.FileSystem.emptyDirectory(targetDirectory);
      assertFileMissing(packageJsonPath, "Can prepare newly created project again (point 3.1)");
      await devToolkit.cli.createProject(targetDirectory);
      assertFileExists(packageJsonPath, "Can prepare newly created project again (point 3.2)");
    }
    let devToolkit3 = undefined;
    Crear_devtoolkit_para_el_proyecto: {
      devToolkit3 = DevToolkit.create(targetDirectory);
    }
    Comprobar_las_firmas_basicas: {
      assert(typeof devToolkit3.cli.tools.buildDocs === "function", "Can find method cli.tools.buildDocs");
      assert(typeof devToolkit3.cli.tools.buildCss === "function", "Can find method cli.tools.buildCss");
      assert(typeof devToolkit3.cli.tools.buildJs === "function", "Can find method cli.tools.buildJs");
      assert(typeof devToolkit3.cli.tools.testJs === "function", "Can find method cli.tools.testJs");
      assert(typeof devToolkit3.cli.tools.loop === "function", "Can find method cli.tools.loop");
      assert(typeof devToolkit3.cli.tools.up === "function", "Can find method cli.tools.up");
      assert(typeof devToolkit3.cli.findProjectRoot === "function", "Can find method cli.findProjectRoot");
      const projectRoot = await devToolkit3.cli.findProjectRoot(`${targetDirectory}/src/lib/dev-toolkit/dev-toolkit.dist.js`);
      assert(projectRoot === targetDirectory, "Can find project root");
    }
    assertFileMissing(`${targetDirectory}/src/tmp/test.entry.js`, "Can prepare cli tool method test (point 1.1)");
    assertFileMissing(`${targetDirectory}/src/tmp/test2.js`, "Can prepare cli tool method test (point 1.2)");
    assertFileMissing(`${targetDirectory}/src/tmp/test.css`, "Can prepare cli tool method test (point 1.3)");
    assertFileMissing(`${targetDirectory}/src/tmp/test2.css`, "Can prepare cli tool method test (point 1.4)");
    await DevToolkit.FileSystem.writeDirectory(`${targetDirectory}/src/tmp`);
    await DevToolkit.FileSystem.writeFile(`${targetDirectory}/src/tmp/test.entry.js`, `module.exports = () => /*${''}<$=await include("./test2.js")$>${''}*/;`);
    await DevToolkit.FileSystem.writeFile(`${targetDirectory}/src/tmp/test2.js`, `500`);
    await DevToolkit.FileSystem.writeFile(`${targetDirectory}/src/tmp/test.css`, `/*${''}@requires:./test2.css${''}*/`);
    await DevToolkit.FileSystem.writeFile(`${targetDirectory}/src/tmp/test2.css`, `html{background:black}`);
    assertFileExists(`${targetDirectory}/src/tmp/test.entry.js`, "Can prepare cli tool method test (point 1.5)");
    assertFileExists(`${targetDirectory}/src/tmp/test2.js`, "Can prepare cli tool method test (point 1.6)");
    assertFileExists(`${targetDirectory}/src/tmp/test.css`, "Can prepare cli tool method test (point 1.7)");
    assertFileExists(`${targetDirectory}/src/tmp/test2.css`, "Can prepare cli tool method test (point 1.8)");
    // 1. Comprobar que buildJs funciona como se espera
    Testear_buildJs: {
      const targetFile = `${targetDirectory}/src/tmp/test.entry.js`;
      const targetFileDist = `${targetDirectory}/dist/tmp/test.dist.js`;
      assertFileMissing(`${targetDirectory}/dist/tmp/test.dist.js`, "Can use buildJs and works as expected (point 1)");
      await devToolkit3.cli.tools.buildJs("src/tmp/test.entry.js");
      assertFileExists(`${targetDirectory}/dist/tmp/test.dist.js`, "Can use buildJs and works as expected (point 2)");
      const callback = require(targetFileDist);
      const result = callback();
      assert(result === 500, "Can use buildJs and works as expected (point 3)");
    }
    // 2. Comprobar que buildCss funciona como se espera
    Testear_buildCss: {
      const targetFile = `${targetDirectory}/src/tmp/test.css`;
      await devToolkit3.cli.tools.buildCss(targetFile);
      // @TODO: el test del método
      // @TODO: el test del método
      // @TODO: el test del método
      // @TODO: el test del método
    }
    // 3. Comprobar que buildDocs funciona como se espera
    Testear_buildDocs: {
      const targetDocumentableDir = `${targetDirectory}/src/tmp`;
      await devToolkit3.cli.tools.buildDocs(targetDocumentableDir);
      // @TODO: el test del método
      // @TODO: el test del método
      // @TODO: el test del método
      // @TODO: el test del método
    }
    // 4. Comprobar que testJs funciona como se espera
    Testear_testJs: {
      const targetFile = `${targetDirectory}/src/tmp/test.entry.js`;
      await devToolkit3.cli.tools.testJs(targetFile);
      // @TODO: el test del método
      // @TODO: el test del método
      // @TODO: el test del método
      // @TODO: el test del método
    }
    // 5. Comprobar que loop funciona como se espera (difícil)
    // 6. Comprobar que up funciona como se espera (imposible)
    Eliminar_todo: {
      //break Eliminar_todo;
      await DevToolkit.FileSystem.emptyDirectory(targetDirectory);
      assertFileMissing(packageJsonPath, "Can prepare newly created project again (point 4.1)");
    }
  }
};