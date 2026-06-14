/**
 * @name DevToolkit.FileWatcher.start
 * @type static method
 * @parameter options:Object - Opciones que se le pasarán al refrescador.
 * @description Llama al `run` del refrescador.
 */
static start(options) {
  return this.Refrescador.run(options);
}