/**
 * @name DevToolkit.prototype.cli
 * @type class property + DevToolkit.CommandLine
 * @not-prototype
 * @in-constructor
 * @description Instancia de DevToolkit.CommandLine para esta instancia de DevToolkit.
 * @description Contiene utilidades y datos para interactuar fácilmente con la command-line del sistema operativo huésped.
 * @description Para saber más, puedes ir a la clase DevToolkit.CommandLine.
 */
this.cli = new this.constructor.CommandLine(this);