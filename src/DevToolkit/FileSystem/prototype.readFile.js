/**
 * @name DevToolkit.FileSystem.prototype.readDirectory
 * @type class method
 * @parameter file:String - Fichero, puede ser relativo.
 * @returns Promise<Array<String>>
 * @description Lee un fichero y devuelve su contenido en utf8
 * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
 */
readFile(file, ...args) {
  return this.constructor.readFile(this.toolkit.fullpathOf(file), ...args);
}