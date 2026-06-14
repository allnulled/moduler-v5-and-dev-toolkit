/**
 * @name DevToolkit.FileSystem.deleteFile
 * @type static method
 * @parameter dir:String - Fichero absoluto
 * @parameter options:Object - Opciones. Ahora mismo solo acepta `inTry:Boolean=false`, que en `true` falla silenciosamente.
 * @returns Promise<void> - Lo mismo que fs.promises.unlink
 * @description Elimina un directorio, recursivamente.
 */
static deleteFile(file, options = { inTry: false }) {
  if(options.inTry) {
    require("fs").promises.unlink(file).catch(error => false);
  }
  return require("fs").promises.unlink(file);
}