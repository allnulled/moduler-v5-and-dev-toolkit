/**
 * @name DevToolkit.Tracer.stringify
 * @type static method
 * @parameter it:any - Cosa que quieres stringificar.
 * @description Usa JSON.stringify para stringificar algo, o devuelve el algo tal cual.
 */
static stringify(it) {
  try {
    return JSON.stringify(it);
  } catch (error) {
    return it;
  }
}