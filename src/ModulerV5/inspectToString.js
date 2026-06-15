/**
 * @name ModulerV5.inspectToString
 * @type static method
 * @parameter args:`Array|Arguments` - Argumentos o array con lo que quieras inspeccionar.
 * @parameter debugLevel:Integer = 0 - Nivel de debugging. Por defecto 0. Tiene que ser entre 0, 1 y 2.
 * @returns String - Representación de la inspección de los valores.
 * @description Devuelve un string que explora mínimamente lo que se pasa. Da el número (L0), da el tipo (L1) o da el tipo y la stringificación (L2).
 */
static inspectToString(args, debugLevel = 0) {
  if (debugLevel === 0) return `${[...args].length} args`;
  if (debugLevel === 1) return `${[...args].map((it, i) => i + ":" + typeof it).join(",")} args`;
  if (debugLevel === 2) return `${[...args].map((it, i) => i + ":" + typeof it + this.stringify(it)).join(",")} args`;
}