/**
 * @name ModulerV5.prototype._callModuleFactory
 * @type private method
 * @parameter `dependencyPromises:Array<Promise>` - Dependencias a inyectar en el factory.
 * @parameter `factory:Function` - Función factoría. A continuación se explicará la firma que sigue.
 * @parameter `submoduler:ModulerV5=null` - Instancia de ModulerV5 que quieres inyectar en la factoría. Puede ser distinta de la instancia actual, para conseguir una resolución de rutas relativas personalizada en el caso concreto.
 * @parameter `filename:String=null` - Fichero de la llamada. Se inyecta por conveniencia.
 * @parameter `dirname:String=null` - Directorio de la llamada. Se inyecta por conveniencia.
 * @returns `Promise<any>` - Devuelve lo que la factoría devuelve al llamarse, en este orden:
 * @returns 1. Si el filename termina con `.css`, devuelve lo que devuelve `this.css.add(filename)`.
 * @returns 2. Lo que devuelve la factoría con `return`, si no es `undefined`.
 * @returns 3. Lo que exporta la factoría con `module.exports` o con `export.<prop>`, si con `return` no devuelve nada o `undefined`.
 * @description Método que permite resolver módulos JavaScript y CSS.
 * @description Se utiliza para resolver cualquiera de los 2 tipos de módulos.
 * @description Es de uso interno, pero hay que saber cómo funciona para usar correctamente los métodos `define` y `mean`.
 * @description El método se define como síncrono aunque se entiende que devuelve una Promise.
 * @description Se hace así para evitar sobrecargar de asincronicidad una función tan clave en el framework.
 */
_callModuleFactory(dependencyPromises, factory, submoduler = null, filename = null, dirname = null) {
  if(typeof filename === "string" && filename.endsWith(".css")) {
    return this.css.add(filename);
  }
  const initialState = {};
  const modulo = { exports: initialState };
  return Promise.all(dependencyPromises).then(async resolvedDependencies => {
    const output = await factory(resolvedDependencies, modulo, modulo.exports, submoduler ?? this, filename, dirname);
    const returnsUndefined = typeof output === "undefined";
    const isNotInitialState = modulo.exports !== initialState;
    const hasNewProperties = 0 !== Object.keys(modulo.exports).length;
    return modulo.exports = (returnsUndefined && (isNotInitialState || hasNewProperties) ? modulo.exports : output);
  });
}