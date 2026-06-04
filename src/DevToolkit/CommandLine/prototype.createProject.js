async createProject(targetDirectory) {
  const fs = require("fs");
  const targetFullpath = this.toolkit.fullpathOf(targetDirectory);
  const contents = await fs.promises.readdir(targetFullpath);
  this.toolkit.assert(contents.length === 0, `required directory «${targetFullpath}» to be empty to create project «DevToolkit.CommandLine.prototype.createProject»`);
  const output = JSON.parse(JSON.stringify(this.constructor.baseProject));
  output["src"]["lib"]["dev-toolkit"]["dev-toolkit.dist.js"] = await fs.promises.readFile(__filename, "utf8");
  await this.toolkit.constructor.FileSystem.fromObjectToDirectory(output, targetFullpath);
  return true;
}