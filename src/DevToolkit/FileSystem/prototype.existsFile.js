/**
 * @name DevToolkit.FileSystem.prototype.existsFile
 * @type class method
 * @parameter file:String - Fichero, puede ser relativo.
 * @returns Promise<Boolean>
 * @description Dice si existe un fichero (no directorio) en la ruta proporcionada
 * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
 */
existsFile(file, ...args) {
  return this.constructor.existsFile(this.toolkit.fullpathOf(file), ...args);
}