/**
 * @name DevToolkit.FileSystem.readFile
 * @type static method
 * @parameter dir:String - Fichero absoluto
 * @parameter options:Object - Opciones. Ahora mismo solo permite `inTry:Boolean=false`, que en `true` silenciará el error, y devolverá `false`.
 * @returns Promise<String> - El contenido de un fichero en utf8.
 * @description Devuelve el contenido de un fichero.
 */
static readFile(file, inTry = false) {
  if (inTry) {
    return require("fs").promises.readFile(file, "utf8").catch(error => false);
  }
  return require("fs").promises.readFile(file, "utf8");
}