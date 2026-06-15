/**
 * @name ModulerV5.prototype.trace
 * @type class method
 * @parameter method:String - Método que estás traceando
 * @parameter args:Array|Arguments - Lista de valores que quieres inspeccionar al tracear. Se le pasarán al `ModulerV5.inspectToString`
 * @description Método de traceo. Consulta al this.isTracing para saber si debe imprimir o evitar.
 */
trace(method, args = [], debugLevel = 0) {
  if(!this.isTracing) return;
  console.log(`[${method}] ${this.constructor.inspectToString(args, debugLevel)}`)
}