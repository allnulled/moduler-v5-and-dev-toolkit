/**
 * @name DevToolkit.FileSystem.existsDirectory
 * @type static method
 * @parameter file:String - Ficero absoluto
 * @returns Promise<Boolean> - Devuelve true si es un fichero, false en cualquier otro caso.
 * @description Comprueba si un fichero vive en la ruta proporcionada.
 */
static existsFile(file) {
  return require("fs").promises.lstat(file).then(lstat => {
    return lstat.isFile();
  }).catch(error => false);
}