/**
 * @name DevToolkit.FileSystem.prototype.exists
 * @type class method
 * @parameter file:String - Fichero o directorio, puede ser relativo.
 * @returns `Promise<Boolean>`
 * @description Dice si existe un fichero o directorio en la ruta proporcionada
 * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
 */
exists(file, ...args) {
  return this.constructor.exists(this.toolkit.fullpathOf(file), ...args);
}