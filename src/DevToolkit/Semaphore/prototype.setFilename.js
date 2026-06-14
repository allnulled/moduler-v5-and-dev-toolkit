/**
 * @name DevToolkit.Semaphore.prototype.setFilename
 * @parameter filename:String - Nuevo nombre (o subruta) de fichero.
 * @sets this.filename:String - Según el parámetro.
 * @returns void - No devuelve nada, es síncrono.
 * @description Solo cambia el nombre del fichero.
 */
setFilename(filename) {
  this.filename = filename;
}