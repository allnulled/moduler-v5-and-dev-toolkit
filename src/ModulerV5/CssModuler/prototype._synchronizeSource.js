/**
 * @name ModulerV5.CssModuler.prototype._synchronizeSource
 * @type private method
 * @parameter eventToSync:Object - Se usará la propiedad source:String
 * @returns `Promise<eventToSync:Object>` - Evento de sincronización. Permite acceder al código fuente generado.
 * @description Sincroniza el CSS de la página con las hojas añadidas en la instancia. 
 * @description Se llama al método CSSStyleSheet.prototype.replace.
 * @description En entornos no-navegador, usará el polifill propio, así no explote en ningún entorno.
 * @description Devuelve el evento de sincronización, que permite acceder al código CSS compilado final.
 */
async _synchronizeSource(eventToSync, options = {}) {
  // @BROWSER pero polifileado:
  if(!options.skipSync) {
    await this.entry.replace(eventToSync.source);
  }
  return eventToSync;
}