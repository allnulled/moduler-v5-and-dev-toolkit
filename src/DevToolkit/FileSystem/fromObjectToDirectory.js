/**
 * @name DevToolkit.FileSystem.prototype.fromObjectToDirectory
 * @type class method
 * @parameter obj:Object - Representación objetual de un directorio.
 * @parameter dir:String - Directorio raíz donde se quiere reconstruir la representación objetual
 * @returns `Promise<void>`
 * @description Reconstruye un directorio a partir de una representación objetual de directorio, y el directorio raíz.
 * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
 */
static async fromObjectToDirectory(obj, dir) {
  const fs = require("fs/promises");
  const path = require("path");
  const tasks = [];
  for (const [name, value] of Object.entries(obj)) {
    const fullPath = path.join(dir, name);
    if (typeof value === "string") {
      tasks.push(fs.writeFile(fullPath, value));
    } else {
      tasks.push(
        (async () => {
          await fs.mkdir(fullPath, { recursive: true });
          await this.fromObjectToDirectory(value, fullPath);
        })()
      );
    }
  }
  await Promise.all(tasks);
}