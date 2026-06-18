/**
 * @name DevToolkit.prototype.basedir
 * @type class property + String
 * @not-prototype
 * @in-constructor
 * @description Propiedad que indica el directorio base de la instancia DevToolkit actual. 
 * @description Sirve para poder resolver rutas relativas en métodos de la instancia (no estáticos, la clase no conoce este valor)
 * @description DevToolkit, a diferencia de ModulerV5, no juega con subinstancias clon, así que aquí no hay un this.rootdir.
 */
this.basedir = require("path").resolve(basedir);