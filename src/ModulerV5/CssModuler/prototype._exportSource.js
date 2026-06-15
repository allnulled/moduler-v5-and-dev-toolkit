/**
 * @name ModulerV5.CssModuler.prototype._exportSource
 * @type private method
 * @parameter eventToSync:Object - Objeto del evento de sincronización. Se usará su propiedad source:String.
 * @parameter options:Object - Objeto de opciones de la sincronización. Se usará su propiedad outFile:String.
 * @returns `Promise<void>` - No devuelve nada concreto
 * @description Método que exporta el CSS acumulado en esta instancia, a un fichero. Lo que hace es que escribe en el fichero especificado en options.outFile el código acumulado en el eventToSync.source.
 */
async _exportSource(eventToSync, options) {
  if(options.outFile) {
    await require("fs").promises.writeFile(this.moduler.fullpathOf(outFile), eventToSync.source, "utf8");
  }
}