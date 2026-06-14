/**
 * @name DevToolkit.Templating.constructor
 * @type class constructor
 * @parameter toolkit:DevToolkit - Instancia de DevToolkit.
 * @sets this.toolkit:DevToolkit - Con el parámetro proporcionado.
 * @sets this.tjs:Tjs - Instancia de [Tjs](https://github.com/allnulled/templated-js) que ya conoce el `this.toolkit.basedir` y permite rutas relativas
 * @description Construye un gestor de plantillas para DevToolkit. Utiliza [Tjs](https://github.com/allnulled/templated-js)
 */
constructor(toolkit) {
  this.toolkit = toolkit;
  this.tjs = this.constructor.Tjs.create(this.toolkit.basedir);
}