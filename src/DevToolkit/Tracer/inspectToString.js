/**
 * @name DevToolkit.Tracer.inspectToString
 * @type static method
 * @parameter args:Array|Arguments - Típicamente, el `arguments` de la función que se está inspeccionando, pero cualquier array también valdría.
 * @parameter debugLevel:0|1|2 - Nivel de debug que quieres aplicar. El 1 solo dice cuantos argumentso, el 2 da los tipos, el 3 da el tipo y stringifica el valor.
 */
static inspectToString(args, debugLevel = 0) {
  if (debugLevel === 0) return `${[...args].length} args`;
  if (debugLevel === 1) return `${[...args].map((it, i) => i + ":" + typeof it).join(",")} args`;
  if (debugLevel === 2) return `${[...args].map((it, i) => i + ":" + typeof it + this.stringify(it)).join(",")} args`;
}