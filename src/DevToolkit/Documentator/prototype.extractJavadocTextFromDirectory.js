async extractJavadocTextFromDirectory(dir = this.toolkit.basedir, options = {}) {
  this.trace("extractJavadocTextFromDirectory", arguments);
  const allJavadocCommentsPerFile = await this.extractJavadocCommentsFromDirectory(dir);
  const hideFiles = ("hideFiles" in options) ? options.hideFiles : true;
  let outputMd = "";
  for(let file in allJavadocCommentsPerFile) {
    outputMd += `----\n\n**${file}**\n\n`;
    const commentsInFile = allJavadocCommentsPerFile[file];
    for(let indexComment=0; indexComment<commentsInFile.length; indexComment++) {
      outputMd += `----\n\n`;
      const comment = commentsInFile[indexComment];
      for(let tagName in comment) {
        outputMd += `- **${tagName}:**`;
        const tagUnits = comment[tagName];
        if(tagUnits.length === 0) {
          outputMd += "\n";
        } else if(tagUnits.length === 1) {
          outputMd += ` ${tagUnits[0]}\n`;
        } else {
          for(let indexTagUnit=0; indexTagUnit<tagUnits.length; indexTagUnit++) {
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