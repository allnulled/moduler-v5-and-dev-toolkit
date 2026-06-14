/**
 * @name DevToolkit.CommandLine.printError
 * @parameter error:Error - Instancia de la clase Error que se quiere imprimir.
 * @description Imprime un error pero bonitamente, con colores.
 */
static printError(error) {
  console.log(DevToolkit.CommandLine.Colors.style("redBright,bold").text(DevToolkit.CommandLine.Colors.box(`${error.name}: ${error.message}`)), "\n", error);
}