/**
 * @name DevToolkit.Reflection.printDescriptionOf
 * @type static method
 * @parameter obj:Object|Function|Class - Ontología a debuggar sus propiedades.
 * @returns void - Nada.
 * @description Imprime una descripción profunda del objeto pasado con parámetros. Usa this.getDescriptionOf y lo pasa a console.log.
 */
static printDescriptionOf(obj) {
  console.log(this.getDescriptionOf(obj));
}