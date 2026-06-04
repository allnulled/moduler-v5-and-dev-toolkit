module.exports = async function (...args) {
  const { DevToolkit, devToolkit, ModulerV5, startTime, titleColumns } = args[0];
  const { assert, assertFileExists, assertFileMissing, } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "DevToolkit/CommandLine/tools".padEnd(titleColumns) });
  assert(1, "DevToolkit/CommandLine/tools");
  const memorize = {};
  Proyecto_1: {
    const targetDirectory = __dirname + "/unwatched/devtoolkit-cli.test/example-1";
    const packageJsonPath = `${targetDirectory}/package.json`;
    Empezar_un_nuevo_proyecto: {
      await DevToolkit.FileSystem.emptyDirectory(targetDirectory);
      assertFileMissing(packageJsonPath, "Can prepare newly created project (point 1)");
      await devToolkit.cli.createProject(targetDirectory);
      assertFileExists(packageJsonPath, "Can prepare newly created project (point 2)");
    }
    Los_comandos_basicos_del_cli_estan_como_tools: {
      assertFileExists(`${targetDirectory}/dev/cli/tool/build/js/build.js.js`, "Can find tool to build js in created project");
      assertFileExists(`${targetDirectory}/dev/cli/tool/build/css/build.css.js`, "Can find tool to build css in created project");
      assertFileExists(`${targetDirectory}/dev/cli/tool/build/ts/build.ts.js`, "Can find tool to build ts in created project");
      assertFileExists(`${targetDirectory}/dev/cli/tool/build/doc/build.doc.js`, "Can find tool to build doc in created project");
      assertFileExists(`${targetDirectory}/dev/cli/tool/loop/loop.js`, "Can find tool to loop in created project");
    }
    Eliminar_todo: {
      memorize.size1 = await DevToolkit.FileSystem.sizeOf(`${targetDirectory}/src/lib/dev-toolkit/dev-toolkit.dist.js`);
      await DevToolkit.FileSystem.emptyDirectory(targetDirectory);
      assertFileMissing(packageJsonPath, "Can prepare newly created project (point 1)");
    }
  }
  Proyecto_2: {
    const targetDirectory = __dirname + "/unwatched/devtoolkit-cli.test/example-2";
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
  await DevToolkit.FileSystem.writeFile(__dirname + "/unwatched/devtoolkit-cli.test/example-1/empty.txt", "");
  await DevToolkit.FileSystem.writeFile(__dirname + "/unwatched/devtoolkit-cli.test/example-2/empty.txt", "");
  await DevToolkit.FileSystem.writeFile(__dirname + "/unwatched/devtoolkit-cli.test/example-3/empty.txt", "");
};