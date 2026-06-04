module.exports = async function ({ DevToolkit, devToolkit, startTime, titleColumns }) {
  const { assert } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "FileWatcher".padEnd(titleColumns) });
  assert(1, "Starting DevToolkit.FileWatcher test");
  assert(typeof DevToolkit.FileWatcher.Refrescador === "object", "Can find DevToolkit.FileWatcher.Refrescador");
  const isUsingRefrescador = (function (args) {
    let isFrom = 0;
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      if (isFrom === 0 && arg === "--from") {
        isFrom++;
      } else if (isFrom === 1) {
        if (arg === "devloop") {
          return true;
        }
        isFrom = 0;
      }
    }
    return false;
  })(process.argv);
  if(isUsingRefrescador) return false;
  Ejemplo_de_uso_de_filewatcher: {
    const fs = require("fs")
    const { setTimeout } = require("timers/promises");
    const { FileWatcher } = DevToolkit;
    const filewatcher = FileWatcher.start({
      watch: [__dirname + "/unwatched"],
      port: 3004,
      extensions: ["txt"],
      message: "Este filewatcher es del test"
    });
    await setTimeout(100);
    await fs.promises.writeFile(__dirname + "/unwatched/test.txt", "ok", "utf8");
    await setTimeout(0);
    filewatcher.server.watcher.close();
    filewatcher.server.server.close();
  }
};