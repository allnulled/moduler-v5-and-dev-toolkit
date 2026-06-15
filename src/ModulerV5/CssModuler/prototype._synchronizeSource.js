/**
 * @name ModulerV5.CssModuler.prototype._synchronizeSource
 * @type private method
 * @parameter eventToSync:Object - Se usará la propiedad source:String
 * @returns `Promise<void>` - Nada
 * @description Sincroniza el CSS de la página con las hojas añadidas en la instancia. Se llama al método CSSStyleSheet.prototype.replace. En entornos no-navegador, usará el polifill propio, así no explote en ningún entorno.
 */
async _synchronizeSource(eventToSync) {
  // @BROWSER pero polifileado:
  await this.entry.replace(eventToSync.source);
}