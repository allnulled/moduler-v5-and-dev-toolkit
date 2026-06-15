/**
 * @name ModulerV5.prototype.relpath
 * @parameter subpath:String - Subruta o ruta. Será normalizada por this.fullpathOf.
 * @returns `String` - Representación de la ruta relativa al this.rootdir.
 * @description Devuelve la ruta relativa al this.rootdir.
 * @description La ruta devuelta siempre empieza por `@/` que es la representación del this.rootdir que usa este framework.
 */
relpathOf(subpath) {
  if(this.isBrowser) {
    throw new Error("Must polyfill method «fullpathOf» to support browser environment");
  }
  return "@/" + this.fullpathOf(subpath).replace(this.rootdir, "").replace(/^\//g,"");
}