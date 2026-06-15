/**
 * @name ModulerV5.prototype.fullpathOf
 * @parameter subpath:String - Subruta de la que se quiere extraer la ruta absoluta.
 * @returns String - Ruta absoluta.
 * @description Retorna la ruta absoluta de una ruta relativa al this.basedir.
 * @description En realidad, retorna una llamada a this.normalizationOf(subpath)
 */
fullpathOf(subpath) {
  return this.normalizationOf(subpath);
}