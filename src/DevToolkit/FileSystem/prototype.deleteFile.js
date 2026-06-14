/**
 * @name DevToolkit.FileSystem.prototype.deleteFile
 * @type class method
 * @parameter file:String - Fichero
 * @parameter options:Object - Opciones pasadas a su homólogo estático.
 * @returns `Promise<void>`
 * @description Elimina un fichero.
 * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
 */
deleteFile(file, ...args) {
  return this.constructor.deleteFile(this.toolkit.fullpathOf(file), ...args);
}