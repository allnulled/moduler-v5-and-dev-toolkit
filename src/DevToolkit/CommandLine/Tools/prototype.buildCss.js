/**
 * @name DevToolkit.CommandLine.Tools.prototype.buildCss
 * @type class method
 * @parameter file:String - Fichero css a construir.
 * @requirement El file:String debe empezar por `src/`
 * @requirement El file:String debe terminar por `.entry.css`
 * @returns `Promise<void>` - Nada
 * @description Lo que va a hacer es crear el fichero `dist/{ruta}.dist.css` con la compilación de este.
 * @description La compilación se hace con el método `this.toolkit.moduler.css.renderFile(file)`
 */
async buildCss(file) {
  const { assert } = this.toolkit;
  assert(file.startsWith("src/"), "Parameter «file» must start with «src/» on «DevToolkit.CommandLine.Tools.prototype.buildCss»");
  assert(file.endsWith(".entry.css"), "Parameter «file» must end with «.entry.css» on «DevToolkit.CommandLine.Tools.prototype.buildCss»");
  const distFile = file.replace(/^src\//g, "dist/").replace(/\.entry\.css$/g, ".dist.css");
  const fullpathSrcFile = this.toolkit.fullpathOf(file);
  const fullpathDistFile = this.toolkit.fullpathOf(distFile);
  // 1. Conseguir source compilado
  const syncEvent = await this.toolkit.moduler.css.extractCompilation(fullpathSrcFile);
  // 2. Persistir source compilado
  await this.toolkit.fileSystem.writeFile(distFile, syncEvent.source, { recursive: true });
}