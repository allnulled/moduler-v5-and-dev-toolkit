/**
 * @name ModulerV5.prototype.readPath
 * @parameter file:String - Ruta. Puede ser relativa. Acepta fichero (en node.js) o URL (en browser).
 * @returns `Promise<String>` - El contenido utf8 del fichero o de la URL.
 * @description Devuelve el contenido de un fichero o URL, aceptando rutas relativas.
 */
readPath(file) {
  return this.isBrowser ? this.readUrl(file) : this.readFile(file);
}