/**
 * @name ModulerV5.CssModuler.constructor
 * @type class constructor
 * @parameter moduler:ModulerV5 - Instancia de ModulerV5 para esta instancia de CssModuler. 
 * @sets this.moduler:ModulerV5 - Del parámetro proporcionado.
 * @sets this.sheets:`Object<String>` - Objeto con los códigos CSS asociados con el fichero que los introdujo
 * @sets this.entry:CSSStyleSheet|FakeCssStyleSheet - Propiedad que guarda y sincroniza el CSS. Se basa en la clase oficial del estándar de los navegadores, pero en node.js se polifilea con un objeto propio.
 * @description Método constructor. Después de establecer las propiedades, inyecta la CSSStyleSheet en el document.adoptedStyleSheets, aunque esté vacía, que lo está.
 */
constructor(moduler) {
  /*<$=await include("./prototype.moduler.js")$>*/
  /*<$=await include("./prototype.sheets.js")$>*/
  /*<$=await include("./prototype.entry.js")$>*/
  if(!this.entry.isFake) {
    document.adoptedStyleSheets.push(this.entry);
  }
}