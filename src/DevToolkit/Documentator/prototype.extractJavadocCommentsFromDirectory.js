async extractJavadocCommentsFromDirectory(dir = this.toolkit.basedir) {
  this.trace("extractJavadocCommentsFromDirectory", arguments);
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