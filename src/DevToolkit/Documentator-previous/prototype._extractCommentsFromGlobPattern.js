async _extractCommentsFromGlobPattern(globPattern = "**/*.js", searchOptions = {}) {
  const allFiles = await this._findFiles(globPattern, searchOptions);
  const allComments = [];
  for (let index = 0; index < allFiles.length; index++) {
    const file = allFiles[index];
    const content = await require("fs").promises.readFile(file, "utf8");
    const matches = this._extractCommentsFromString(content, file, this.toolkit.basedir);
    if(matches.length) {
      allComments.push({
        file: file.replace(this.toolkit.basedir + "/", ""),
        matches,
      });
    }
  }
  return allComments;
}