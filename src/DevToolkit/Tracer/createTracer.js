/**
 * @name DevToolkit.Tracer.createTracer
 * @type static method
 * @parameter prefix:String - Prefijo del traceador. Se refiere a la clase.
 * @parameter firstMessage:String|Boolean = false - Primer mensaje que quieres trazar ya al construir el traceador. Para no hacerlo en 2 llamadas.
 * @parameter isTracing:Boolean = true - Flag para activar o desactivar el traceador.
 * @returns Function<method:String,args:Arguments|Array>:void - Función que acepta 1 string y 1 array o 1 arguments, y imprime la traza. El segundo argumento será pasado a `inspectToString`.
 * @description Devuelve un traceador, que es una función que va imprimiendo las trazas que le dices. Esta función acepta 2 argumentos: el nombre del metodo en String, y los argumentos de la función traceada, en Array o Arguments.
 * @note Este método de traceo es muy precario ahora mismo, y no es para producción en ningún caso.
 */
static createTracer(prefix, firstMessage = false, isTracing = true) {
  let callback = function (method, args = [], debugLevel = 0) {
    if(callback.isTracing === true) {
      console.log(DevToolkit.CommandLine.Colors.style("cyan").text(`[Trace:${prefix}.${method}]`) + ` ${Tracer.inspectToString(args, debugLevel)}`);
    }
    return callback;
  };
  callback.isTracing = isTracing;
  if (firstMessage) callback(firstMessage);
  return callback;
}