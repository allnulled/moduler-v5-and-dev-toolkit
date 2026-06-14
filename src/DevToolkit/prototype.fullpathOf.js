/**
 * @name DevToolkit.prototype.fullpathOf
 * @type class method
 * @parameter subpath:String - ruta relativa al `DevToolkit.prototype.basedir`
 * @returns String - ruta completa resultante. 
 * @description Reconstruye la ruta completa a partir de una ruta relativa. Utiliza `path.resolve` con el `this.basedir`.
 */
fullpathOf(subpath) {
  return require("path").resolve(this.basedir, subpath);
}