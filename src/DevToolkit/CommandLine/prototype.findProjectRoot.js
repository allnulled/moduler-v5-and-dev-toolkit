/**
 * @name DevToolkit.CommandLine.prototype.findProjectRoot
 * @type class method
 * @parameter fromDirectory:String = process.cwd() - Directorio desde el que quieres iniciar la búsqueda
 * @parameter file:String = "package.json" - Nombre del fichero que se usará para encontrar el directorio raíz del proyecto
 * @throws Error - Lanzará un error de "project root not found by file ${file}"
 * @returns `Promise<String>` - Directorio considerado raíz del proyecto
 * @description Buscará desde el directorio `fromDirectory:String` hacia arriba el primer directorio que encuentre el fichero `file:String`.
 * @description De no encontrarse y llegar a la raíz del sistema operativo, lanzará un error.
 */
async findProjectRoot(fromDirectory = process.cwd(), file = "package.json") {
  const fs = require("fs");
  const path = require("path");
  let previousDirectory = null;
  let currentDirectory = path.resolve(fromDirectory);
  while(currentDirectory !== previousDirectory) {
    previousDirectory = currentDirectory;
    currentDirectory = path.dirname(currentDirectory);
    try {
      await fs.promises.readFile(`${currentDirectory}/${file}`);
      return currentDirectory;
    } catch (error) {
      // @OK.
    }
  }
  throw new Error(`project root not found by file «${file}» from directory «${fromDirectory}» on «DevToolkit.CommandLine.prototype.findProjectRoot»`);
}