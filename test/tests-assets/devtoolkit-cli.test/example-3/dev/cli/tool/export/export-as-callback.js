module.exports = async function (file) {
  const fs = require("fs");
  console.log(file);
  const path = require("path");
  const rootDir = path.resolve(`${__dirname}/../../../..`);
  const outputDir = path.resolve(`${__dirname}/../../../../../moduler-v5-and-dev-toolkit/src/DevToolkit/CommandLine/blank-project`);
  const contents = await fs.promises.readdir(outputDir);
  const isDir = () => fs.promises.lstat(outputDir).then(lstat => lstat.isDirectory()).catch(error => false);
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  assert(await isDir(outputDir), `Could not find output directory: ${outputDir}`);
  assert(await isDir(rootDir), `Could not find root directory: ${rootDir}`);
  const fromDirectoryToObject = async function (dir, options = {}) {
    const entries = await fs.promises.readdir(dir, {
      withFileTypes: true
    });
    const result = {};
    Iterating_entries:
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (typeof options.filter === "function") {
        if (!options.filter(fullPath, entry)) {
          continue Iterating_entries;
        }
      }
      if (entry.isDirectory()) {
        result[entry.name] = await fromDirectoryToObject(fullPath, options);
      } else {
        result[entry.name] = await fs.promises.readFile(fullPath, "utf8");
      }
    }
    return result;
  };
  const summary = await fromDirectoryToObject(rootDir, {
    filter(file, lstat) {
      return !file.includes("node_modules") && !file.includes("dev-toolkit.dist.js") && !file.includes("package-lock.json");
    }
  });
  console.log(summary);
  // summary["src"]["lib"]["dev-toolkit"]["dev-toolkit.dist.js"] = await fs.promises.readFile(`${rootDir}/src/lib/dev-toolkit/dev-toolkit.dist.js`, "utf8");
  await fs.promises.writeFile(path.resolve(outputDir, "blank-project.json"), JSON.stringify(summary, null, 2), "utf8");
  
};