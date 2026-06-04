async propagateOnTouch(file) {
  this.trace("prototype.propagateOnTouch", arguments);
  Propagate_on_touch: {
    const path = require("path");
    const subpath = this.toolkit.subpathOf(file);
    const parts = subpath.split("/").filter(part => part !== "");
    // Iteramos los directorios superiores del fichero touched hasta la raíz del toolkit:
    Iterating_directories:
    for (let index = parts.length - 1; index > -1; index--) {
      const subparts = parts.toSpliced(index);
      const touchedPath = this.toolkit.fullpathOf(subparts.join("/"));
      Trigger_by_entry: {
        const files = await DevToolkit.FileSystem.readDirectory(touchedPath, { inTry: true });
        for (let index = 0; index < files.length; index++) {
          const file = files[index];
          if (file.endsWith(".entry.js")) {
            const entryPath = path.resolve(touchedPath, file);
            DevToolkit.CommandLine.Colors.style("yellow").print("Found «*.entry.js» at: " + this.toolkit.subpathOf(entryPath));
            const entryOutput = await this.toolkit.templating.tjs.renderFile(entryPath);
            const distPath = path.resolve(entryPath.replace(/\.entry\.js$/g, ".dist.js"));
            DevToolkit.CommandLine.Colors.style("yellow").print("Making «*.dist.js» at: " + this.toolkit.subpathOf(distPath));
            await DevToolkit.FileSystem.writeFile(distPath, entryOutput, "utf8");
          }
        }
      }
      const triggableByOnTouch = path.resolve(`${touchedPath}/on-touch.js`);
      Trigger_by_onTouch:
      if (await DevToolkit.FileSystem.existsFile(triggableByOnTouch)) {
        DevToolkit.CommandLine.Colors.style("yellow").print("Found «on-touch.js» at: " + this.toolkit.subpathOf(triggableByOnTouch));
        const callback = require(triggableByOnTouch);
        if (typeof callback === "function") {
          await callback.call(this.toolkit, file);
        }
      }
      const triggableByOnTest = path.resolve(`${touchedPath}/on-test.js`);
      Trigger_by_onTest:
      if (await DevToolkit.FileSystem.existsFile(triggableByOnTest)) {
        DevToolkit.CommandLine.Colors.style("yellow").print("Found «on-test.js» at: " + this.toolkit.subpathOf(triggableByOnTest));
        const callback = require(triggableByOnTest);
        if (typeof callback === "function") {
          await callback.call(this.toolkit, file);
        }
      }
    }
  }
}