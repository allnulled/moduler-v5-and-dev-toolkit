/**
 * @name DevToolkit.FileSystem.sizeOf
 * @type static method
 * @parameter dir:String - Fichero absoluto
 * @returns Promise<Integer> - El tamaño de un fichero o directorio
 * @description Devuelve el tamaño de un fichero o directorio
 */
static sizeOf(file) {
  return require("fs").promises.lstat(file).then(lstat => lstat.size);
}