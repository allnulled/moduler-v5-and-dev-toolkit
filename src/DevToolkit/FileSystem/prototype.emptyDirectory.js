/**
 * @name DevToolkit.FileSystem.prototype.emptyDirectory
 * @type class method
 * @returns Promise<void>
 * @description Vacía un directorio pero no lo elimina.
 * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
 */
emptyDirectory(file, ...args) {
  return this.constructor.emptyDirectory(this.toolkit.fullpathOf(file), ...args);
}