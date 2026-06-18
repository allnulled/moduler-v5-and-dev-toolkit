/**
 * @name DevToolkit.Reflection.getDescriptionOf
 * @type static method
 * @parameter obj:Object|Function|Class - Ontología a debuggar sus propiedades.
 * @returns Object - El objeto con la descripción. Tiene propiedades, metodos, simbolos, y heredadas.
 * @by ChatGPT.
 * @description Obtiene un objeto con una descripción del objeto pasado con parámetros. Por el camino usa Reflect.ownKeys, Object.getOwnPropertyDescriptor y Object.getPrototypeOf.
 */
static getDescriptionOf(obj) {
  const resultado = {
    propiedades: [],
    metodos: [],
    simbolos: [],
    heredadas: []
  };
  // Propiedades propias (incluyendo no enumerables)
  for (const key of Reflect.ownKeys(obj)) {
    const desc = Object.getOwnPropertyDescriptor(obj, key);
    if (typeof key === "symbol") {
      resultado.simbolos.push(key);
    } else if (typeof desc.value === "function") {
      resultado.metodos.push(key);
    } else {
      resultado.propiedades.push(key);
    }
  }
  // Recorrer la cadena de prototipos
  let proto = Object.getPrototypeOf(obj);
  while (proto && proto !== Object.prototype) {
    for (const key of Reflect.ownKeys(proto)) {
      if (key === "constructor") continue;
      resultado.heredadas.push({
        nombre: key,
        tipo: typeof proto[key]
      });
    }
    proto = Object.getPrototypeOf(proto);
  }
  return resultado;
}