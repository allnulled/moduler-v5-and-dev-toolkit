/**
 * @name DevToolkit.FileSystem.prototype.writeFile
 * @type class method
 * @parameter file:String - Fichero, puede ser relativo.
 * @parameter contents:String - Contenido del fichero
 * @returns `Promise<void>`
 * @description Sobreescribe un fichero con fs.promises.writeFile
 * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
 */
writeFile(file, ...args) {
  return this.constructor.writeFile(this.toolkit.fullpathOf(file), ...args);
}