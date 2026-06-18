/**
 * @name ModulerV5.CssModuler.prototype.extractCompilation
 * @type class method
 * @parameter inputFile:String - Fichero CSS de entrada para ser compilado
 * @returns `Promise<eventToSync:Object>` - Evento de sincronización.
 * @returns Contiene el texto CSS compilado de salida en la propiedad `source:String`.
 * @returns Tiene 2 propiedades extra además de las propias del evento: `added:Object` que es el evento de añadir, y `cssModuler:CssModuler` que es la instancia de CssModuler que ha hecho la compilación (porque no es el this, es otra instancia, para que no interfiera en el estado actual de la instancia).
 * @description Este método hace varios pasos:
 * @description 1. Crea una nueva instancia CssModuler con la misma referencia de su this.moduler
 * @description 2. Llama al css.add(inputFile)
 * @description 3. Llama al css.synchronize() pero sin afectar al estado de la página
 * @description 4. Devuelve el objeto de sincronización, que contiene el código fuente resultante de la compilación en la propiedad `source:String`.
 */
async extractCompilation(inputFile) {
  const tmpCss = new this.constructor(this.moduler);
  const eventToAdd = await tmpCss.add(inputFile);
  const eventToSync = await tmpCss.synchronize({ skipSync:true });
  Object.assign(eventToSync, {
    added: eventToAdd,
    cssModuler: tmpCss,
  });
  return eventToSync;
}