/**
 * @name DevToolkit.CommandLine.Tools.constructor
 * @type class constructor
 * @parameter commandLine:DevToolkit.CommandLine - Instancia de DevToolkit.CommandLine para esta clase.
 * @sets this.toolkit a partir del parámetro proporcionado. Nótese que se pasa la instancia de CommandLine como parámetro del método, pero se fija su propiedad `toolkit` como propiedad. Si necesitas acceder a la cli, puedes hacer `this.toolkit.cli`, pero se hace por homogeneizar con todas las otras instancias de clase que se derivan del DevToolkit, aunque se encuentre dentro de la instancia `toolkit.cli.tools` (segundo nivel desde toolkit).
 * @description Construye la instancia de DevToolkit.CommandLine.Tools
 */
constructor(commandLine) {
  /*<$=await include("./prototype.toolkit.js")$>*/
}