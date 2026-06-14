/**
 * @name DevToolkit.prototype.subpathOf
 * @type class
 * @parameter absolutePath:String - ruta relativa al `DevToolkit.prototype.basedir`
 * @returns String - ruta relativa resultante. 
 * @throws Error - Si la proporcionada no es una ruta relativa al `this.basedir`, lanza un error con `Provided file is not a subpath of...`.
 * @description Se asegura que la ruta absoluta proporcionada es relativa al `this.basedir`, y devuelve la ruta relativa resultante.
 */
subpathOf(absolutePath) {
  if(!absolutePath.startsWith(this.basedir + "/")) throw new Error(`Provided file is not a subpath of «${this.toolkit.basedir}»`);
  return absolutePath.replace(this.basedir + "/", "");
}