/**
 * @name DevToolkit.CommandLine.prototype.buildDocs
 * @not-finished
 */
async buildDocs(dir, options = {}) {
  const txt = await this.toolkit.documentator.extractJavadocTextFromDirectory(dir, options);
  return {markdown:txt};
}