/**
 * @name ModulerV5.CssModuler.prototype.entry
 * @type class property + CSSStyleSheet|FakeCssStyleSheet
 * @description Objeto nativo del browser (CSSStyleSheet) o polyfill propio en entornos no-browser (FakeCssStyleSheet) para hacer (o fake-polifilear) la inyección de estilos en la página.
 * @description De este objeto, lo que se va a usar es el método `.replace(source:String)`.
 */
this.entry = typeof CSSStyleSheet === "function" ? new CSSStyleSheet() : this.constructor.fakeCssStyleSheet();