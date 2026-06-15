/**
 * @name ModulerV5.prototype.define
 * @parameter `...args:Array` - Soporta varias firmas
 * @signature `...args:[factory:Function]` - Solo 1 función, que se entiende como factoría.
 * @signature `...args:[dependencies:Array, factory:Function]` - Función factoría precedida por array de dependencias. Las dependencias pueden ser varias cosas.
 * @returns `Promise<any>` - Devuelve una promesa con lo que devuelve o exporta la factoría que se le pasa como parámetro.
 * @returns Devuelve lo que devolvería `this._callModuleFactory(dependencyPromises, factory)`.
 * @returns Teniendo en cuenta que dependencyPromises se construye mapeando `dependencies` a través de `this.mean(dependency)`.
 * @returns Pero hay que mirar el método `_callModuleFactory` para entender este método bien.
 * @returns Se mantiene separado porque ese método también se llama en el `this.mean`. 
 * @description Resuelve una factoría, inyectándole las dependencias especificadas.
 * @description Se puede dividir en 3 pasos:
 * @description 1. Validar parámetros. Se cerciora que los parámetros estén cumpliendo con alguna de las firmas antes especificadas.
 * @description 2. Resolver dependencias. Esto es que se llama al `this.mean(dependency)` y se construye `dependencyPromises` como un array de promesas.
 * @description 3. Resolver módulo. Esta parte consiste en llamar a `this._callModuleFactory(dependencyPromises, factory)`.
 * @description En este último paso, se entiende que se devuelve una Promise.
 * @description El método, sin embargo, se define como síncrono, para evitar sobrecargar de asincronicidad una función tan clave del framework.
 */
define(...args) {
  let dependencies = [];
  let factory = undefined;
  Validate_parameters: {
    if (args.length === 1) {
      this.assert(typeof args[0] === "function", `using define: if args.length is 1 then args[0] must be factory function but «${typeof args[0]}» was found instead on «ModulerV5.prototype.define»`);
      factory = args[0];
    } else if (args.length === 2) {
      this.assert(Array.isArray(args[0]), `using define: if args.length is 2 then args[0] must be array of dependencies but «${typeof args[0]}» was found instead on «ModulerV5.prototype.define»`);
      this.assert(typeof args[1] === "function", `using define: if args.length is 2 then args[1] must be factory function but «${typeof args[1]}» was found instead on «ModulerV5.prototype.define»`);
      dependencies = args[0];
      factory = args[1];
    } else {
      throw new Error(`current arguments.length «${args.length}» is not supported`);
    }
  }
  let dependencyPromises = undefined;
  Resolve_dependencies: {
    dependencyPromises = dependencies.map(dependency => this.mean(dependency));
  }
  Resolve_module: {
    return this._callModuleFactory(dependencyPromises, factory);
  }
}