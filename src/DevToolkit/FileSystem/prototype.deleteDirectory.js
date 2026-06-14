/**
 * @name DevToolkit.FileSystem.prototype.deleteDirectory
 * @type class method
 * @parameter dir:String - Directorio
 * @parameter options:Object - Opciones pasadas a su homólogo estático.
 * @returns `Promise<void>`
 * @description Elimina un directorio.
 * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
 */
deleteDirectory(file, ...args) {
  return this.constructor.deleteDirectory(this.toolkit.fullpathOf(file), ...args);
}