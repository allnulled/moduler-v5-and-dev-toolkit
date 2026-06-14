/**
 * @name DevToolkit.FileSystem.writeDirectory
 * @type static method
 * @parameter dir:String - Directorio absoluto
 * @returns `Promise<void>` - Devuelve lo mismo que fs.promises.mkdir
 * @description Construye un directorio
 */
static writeDirectory(dir, options = { recursive: false }) {
  return require("fs").promises.mkdir(dir, options);
}