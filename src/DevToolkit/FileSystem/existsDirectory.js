/**
 * @name DevToolkit.FileSystem.existsDirectory
 * @type static method
 * @parameter dir:String - Directorio absoluto
 * @returns `Promise<Boolean>` - Devuelve true si es un directorio, false en cualquier otro caso.
 * @description Comprueba si un directorio vive en la ruta proporcionada.
 */
static existsDirectory(dir) {
  return require("fs").promises.lstat(dir).then(lstat => {
    return lstat.isDirectory();
  }).catch(error => false);
}