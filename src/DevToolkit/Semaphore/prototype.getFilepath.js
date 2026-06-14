/**
 * @name DevToolkit.Semaphore.prototype.getFilepath
 * @type class method
 * @returns String - Ruta completa del fichero semáforo.
 * @description Devuelve la ruta completa del fichero usado como semáforo.
 */
getFilepath() {
  return this.toolkit.fullpathOf(this.filename);
}