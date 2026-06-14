/**
 * @name DevToolkit.FileSystem.prototype.exists
 * @type class method
 * @parameter dir:String - Directorio, puede ser relativo.
 * @returns Promise<Boolean>
 * @description Dice si existe un directorio en la ruta proporcionada
 * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
 */
existsDirectory(dir, ...args) {
  return this.constructor.existsDirectory(this.toolkit.fullpathOf(dir), ...args);
}