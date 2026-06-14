/**
 * @name DevToolkit.Documentator.prototype.extractJavadocTextFromDirectory
 * @type class method
 * @parameter dir:String - Directorio del cual se quieren extraer los comentarios javadoc.
 * @parameter options:Object - Opciones. Actualmente no tiene uso. Por defecto, un objeto vacío.
 * @returns `Promise<String>` - Texto compuesto por todos los comentarios javadoc encontrados.
 * @description Devuelve el texto de todos los comentarios javadoc encontrador bajo un directorio. Utiliza `this.extractJavadocCommentsFromDirectory` por dentro.
 */
async extractJavadocTextFromDirectory(dir = this.toolkit.basedir, options = {}) {
  const allJavadocCommentsPerFile = await this.extractJavadocCommentsFromDirectory(dir);
  let outputMd = "";
  for (let file in allJavadocCommentsPerFile) {
    outputMd += `----\n\n**${file}**\n\n`;
    const commentsInFile = allJavadocCommentsPerFile[file];
    for (let indexComment = 0; indexComment < commentsInFile.length; indexComment++) {
      outputMd += `----\n\n`;
      const comment = commentsInFile[indexComment];
      for (let tagName in comment) {
        outputMd += `- **${tagName}:**`;
        const tagUnits = comment[tagName];
        if (tagUnits.length === 0) {
          outputMd += "\n";
        } else if (tagUnits.length === 1) {
          outputMd += ` ${tagUnits[0]}\n`;
        } else {
          for (let indexTagUnit = 0; indexTagUnit < tagUnits.length; indexTagUnit++) {
            const tagUnit = tagUnits[indexTagUnit];
            outputMd += `\n   - ${tagUnit.trim().replace(/(\r?\n)+/g, "\n      - ")}`;
          }
          outputMd += `\n`;
        }
      }
    }
  }
  return outputMd;
}