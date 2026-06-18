/**
 * @name ModulerV5.prototype.css
 * @type class property + CssModuler
 * @in-constructor
 * @not-prototype
 * @description Instancia de ModulerV5.CssModuler asociada a este ModulerV5. En una misma cadena de clonación se comparte el mismo CssModuler. Esto implica que un cambio en el this.css desde cualquier punto de la cadena de clones, afecta igual y simultáneamente a toda la cadena.
 */
this.css = cloneRoot ? cloneRoot.css : this.constructor.CssModuler.create(this);