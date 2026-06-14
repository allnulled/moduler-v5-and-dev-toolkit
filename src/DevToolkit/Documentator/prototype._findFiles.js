/**
 * @name DevToolkit.Documentator.prototype._findFiles
 * @type private class method
 * @parameter globPattern:String - Patrón glob para encontrar los ficheros que contienen comentarios javadoc.
 * @parameter options:Object - Opciones pasadas a la llamada de la librería [`glob`](https://www.npmjs.com/package/glob). Algunas opciones están ya prefijadas por el método:
 *   - cwd: `this.toolkit.basedir` (este sí puede sobreescribir)
 *   - absolute: `true`
 *   - ignore: `node_modules` (este puede extenderse, pero no sobreescribirse)
 * @returns `Promise<Array<String>>` - Es una llamada asíncrona, así que devuelve una promesa, con la lista de ficheros encontrados.
 */
_findFiles(globPattern = "**/*.js", options = {}) {
  return require("glob").glob(globPattern, {
    // 1. Changeable options:
    cwd: this.toolkit.basedir,
    // 2. User options:
    ...options,
    // 3. Fixed options:
    absolute: true,
    ignore: [
      "node_modules",
      ...(typeof options.ignore === "undefined" ? [] : options.ignore),
    ],
  });
}