/**
 * @name DevToolkit.CommandLine.prototype.createProject
 * @type class method
 * @returns true - Si todo ha ido bien.
 * @description Construye un proyecto que utiliza DevToolkit y ModulerV5 para modular js y css. Requiere que el directorio esté vacío. Este método obliga que el fichero `dev-toolkit.dist.js` esté con todo el contenido de la clase.
 */
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