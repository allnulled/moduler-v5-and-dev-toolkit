/**
 * @name DevToolkit.FileSystem.deleteDirectory
 * @type static method
 * @parameter dir:String - Directorio absoluto
 * @parameter options:Object - Opciones. Ahora mismo solo acepta `inTry:Boolean=false`, que en `true` falla silenciosamente.
 * @returns Promise<void> - Lo mismo que fs.promises.rm
 * @description Elimina un directorio, recursivamente.
 */
static deleteDirectory(dir, options = { inTry: false }) {
  if(options.inTry) {
    return require("fs").promises.rm(dir, { recursive: true }).catch(error => false);
  }
  return require("fs").promises.rm(dir, { recursive: true });
}