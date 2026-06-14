/**
 * @name DevToolkit.FileSystem.prototype.readDirectory
 * @type class method
 * @parameter dir:String - Directorio, puede ser relativo.
 * @returns Promise<Array<String>>
 * @description Lee un directorio y devuelve sus rutas
 * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
 */
readDirectory(dir, ...args) {
  return this.constructor.readDirectory(this.toolkit.fullpathOf(dir), ...args);
}