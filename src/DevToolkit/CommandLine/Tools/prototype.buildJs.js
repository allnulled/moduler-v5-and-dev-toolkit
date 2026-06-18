/**
 * @name DevToolkit.CommandLine.Tools.prototype.buildJs
 * @type class method
 * @parameter file:String - Fichero a construir.
 * @requirement El file:String debe empezar por `src/`
 * @requirement El file:String debe terminar por `.entry.js`
 * @returns `Promise<void>` - Nada
 * @description Lo que va a hacer es crear el fichero `dist/{ruta}.dist.js` con la compilación de este.
 * @description La compilación se hace con el método `this.toolkit.templating.tjs.renderFile(file)`
 */
async buildJs(file) {
  const { assert } = this.toolkit;
  assert(file.startsWith("src/"), "Parameter «file» must start with «src/» on «DevToolkit.CommandLine.Tools.prototype.buildJs»");
  assert(file.endsWith(".entry.js"), "Parameter «file» must end with «.entry.js» on «DevToolkit.CommandLine.Tools.prototype.buildJs»");
  const distFile = file.replace(/^src\//g, "dist/").replace(/\.entry\.js$/g, ".dist.js");
  const fullpathSrcFile = this.toolkit.fullpathOf(file);
  const fullpathDistFile = this.toolkit.fullpathOf(distFile);
  const compiledContent = await this.toolkit.templating.tjs.renderFile(fullpathSrcFile);
  await this.toolkit.fileSystem.writeFile(distFile, compiledContent, { recursive: true });
}