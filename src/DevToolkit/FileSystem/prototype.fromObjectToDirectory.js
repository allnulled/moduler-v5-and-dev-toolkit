/**
 * @name DevToolkit.FileSystem.prototype.fromObjectToDirectory
 * @type class method
 * @parameter obj:Object - Representación objetual de un directorio.
 * @parameter dir:String - Directorio raíz donde se quiere reconstruir la representación objetual
 * @returns Promise<void>
 * @description Reconstruye un directorio a partir de una representación objetual de directorio, y el directorio raíz.
 * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
 */
fromObjectToDirectory(obj, dir) {
  return this.constructor.fromObjectToDirectory(obj, this.toolkit.fullpathOf(dir));
}