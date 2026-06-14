/**
 * @name DevToolkit.FileSystem.exists
 * @type static method
 * @parameter dir:String - Fichero o directorio absoluto
 * @returns Promise<Object|false> - Lo mismo que fs.promises.lstat. Si falla, silencia el error y devuelve false.
 * @description Comprueba si un fichero o directorio vive en la ruta proporcionada.
 */
static exists(file) {
  return require("fs").promises.lstat(file).catch(error => false);
}