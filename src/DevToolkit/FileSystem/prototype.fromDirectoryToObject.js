/**
 * @name DevToolkit.FileSystem.prototype.fromDirectoryToObject
 * @type class method
 * @parameter file:String - Directorio, puede ser relativo.
 * @returns `Promise<Object>`
 * @description Construye la representación objetual de un directorio.
 * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
 */
fromDirectoryToObject(file, ...args) {
  return this.constructor.fromDirectoryToObject(this.toolkit.fullpathOf(file), ...args);
}