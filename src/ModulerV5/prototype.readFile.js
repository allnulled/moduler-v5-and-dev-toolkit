/**
 * @name ModulerV5.prototype.readFile
 * @parameter file:String - Ruta a fichero. Puede ser relativa porque será pasada por this.fullpathOf.
 * @returns `Promise<String>` - El contenido utf8 del fichero.
 * @description Devuelve el contenido de un fichero, aceptando rutas relativas.
 */
readFile(file) {
  return require("fs").promises.readFile(this.fullpathOf(file), "utf8");
}