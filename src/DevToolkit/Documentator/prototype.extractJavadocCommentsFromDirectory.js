/**
 * @name DevToolkit.Documentator.prototype.extractJavadocCommentsFromDirectory
 * @type class method
 * @parameter dir:String - Directorio del cual que quieren extraer los comentarios. Se entiende que solo son ficheros `.js`. Ahora mismo esto no se puede cambiar, pero puede que se cambie más adelante. Por defecto usa el `this.toolkit.basedir`.
 * @returns Promise<Object> - Objeto con los nombres de ficheros (relativos, empiezan con `{@root}/`) y los comentarios javadoc encontrados en cada uno.
 * @description Extrae todos los comentarios javadoc encontrados en ficheros js de un directorio dado.
 */
async extractJavadocCommentsFromDirectory(dir = this.toolkit.basedir) {
  const inputFiles = await this._findFiles(require("path").resolve(dir, "**/*.js"));
  const allJavadocComments = {};
  for (let index = 0; index < inputFiles.length; index++) {
    const file = inputFiles[index];
    const content = await require("fs").promises.readFile(file, "utf8");
    const comments = this._extractJavadocCommentsFromString(content);
    if (comments.length) {
      allJavadocComments[file.replace(this.toolkit.basedir + "/", "{@root}/")] = comments;
    }
  }
  return allJavadocComments;
}