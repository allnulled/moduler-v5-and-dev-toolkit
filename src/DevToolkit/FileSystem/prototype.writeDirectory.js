/**
 * @name DevToolkit.FileSystem.prototype.writeDirectory
 * @type class method
 * @parameter file:String - Directorio, puede ser relativo.
 * @returns `Promise<void>`
 * @description Crea un directorio con fs.promises.mkdir
 * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
 */
writeDirectory(file, ...args) {
  return this.constructor.writeDirectory(this.toolkit.fullpathOf(file), ...args);
}