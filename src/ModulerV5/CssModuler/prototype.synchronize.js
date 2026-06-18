/**
 * @name ModulerV5.CssModuler.prototype.synchronize
 * @type class method
 * @parameter options:Object - Se usa la propiedad outFile:String|false, si quieres exportar el css a un fichero, y la propiedad skipSync:Boolean=false, si quieres evitar sincronizar la página del browser con el resultado.
 * @returns `Promise<eventToSync:Object>` - Devuelve el evento de sincronización.
 * @description Sincroniza el css de la página con el css de la instancia.
 * @calls this._sortSheets - Primero ordena los css
 * @calls this._generateSource - Segundo genera el css resultante, la resolución recursiva ya se ha hecho en el `this.add`, aquí solo se recoge lo ya descargado
 * @calls this._synchronizeSource - Tercero sincroniza el css de la página
 * @calls this._exportSource - Cuarto exporta el css al fichero indicado en options.outFile, si es que se especifica.
 */
async synchronize(options = { outFile:false, skipSync:false }) {
  const eventToSync = {
    counter: 0,
    dependencies: [],
  };
  await this._sortSheets(eventToSync, options);
  await this._generateSource(eventToSync, options);
  await this._synchronizeSource(eventToSync, options);
  await this._exportSource(eventToSync, options);
  return eventToSync;
}