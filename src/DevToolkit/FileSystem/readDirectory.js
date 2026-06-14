/**
 * @name DevToolkit.FileSystem.readDirectory
 * @type static method
 * @parameter dir:String - Directorio absoluto
 * @parameter options:Object - Opciones. Ahora mismo solo permite `inTry:Boolean=false`, que en `true` silenciará el error, y devolverá `false`.
 * @returns `Promise<Array<String>>` - Los ficheros y directorios contenidos dentro.
 * @description Devuelve los contenidos de un directorio.
 */
static readDirectory(dir, options = { inTry: false }) {
  if(options.inTry) {
    return require("fs").promises.readdir(dir).catch(error => false);
  }
  return require("fs").promises.readdir(dir);
}