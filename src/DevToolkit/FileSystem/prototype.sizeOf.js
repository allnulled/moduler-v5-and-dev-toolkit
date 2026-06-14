/**
 * @name DevToolkit.FileSystem.prototype.sizeOf
 * @type class method
 * @parameter file:String - fichero, puede ser relativo.
 * @returns Promise<Integer> - El size que devuelve el lstat de node.js
 * @description Lee el lstat del fichero y devuelve el resultado.
 * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
 */
sizeOf(file, ...args) {
  return this.constructor.sizeOf(this.toolkit.fullpathOf(file), ...args);
}