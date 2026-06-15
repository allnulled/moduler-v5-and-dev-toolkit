/**
 * @name ModulerV5.prototype.mean
 * @parameter ...args:Array - Acepta diferentes firmas.
 * @signature ...args:[id:String] - Acepta 1 identificador de dependencia
 * @signature ...args:[factory:Function] - Acepta 1 función factoría
 * @signature ...args:[dependencies:Array] - Acepta 1 array de dependencias. En este caso, devuelve las dependencias resueltas directamente, en formato `Promise<Array<?>>`.
 * @signature ...args:[dependencies:Array,factory:Function] - Acepta 1 array de dependencias seguido de 1 función factoría
 * @returns `Promise<any>` - Devuelve o la resolución final de la factoría, o la resolución final de la dependencia, o la lista de resoluciones de dependencias, según el caso de los parámetros de entrada.
 * @description Este método permite resolver dependencias y/o factorías de módulos al vuelo, de forma asíncrona.
 * @description Sin embargo, el método de define como síncrono, para no sobrecargar de asincronía un método tan clave en el framework.
 * @explanation Los pasos que sigue son:
 * @explanation 1. Validación y formateo de parámetros. Aquí encaja los argumentos. En el caso de la firma `dependencies:Array`, retorna, ya en este paso, las promesas construidas con el mapeo de la lista de dependencies mediante this.mean(dependency).
 * @explanation 2. Si hay una factoría, crea la `dependencyPromises` con el `this.mean(dependency)` y devuelve la llamada a `this._callModuleFactory(dependencyPromises, factory)`.
 * @explanation 3. Si hay un id, devuelve la definition de este de haberla, y de no haberla devuelve la llamada a `this.importModule(id)`, habiendo normalizado el id con `this.normalizationOf`.
 * @explanation En el último paso, lanza un error, porque llegados a aquí, ya se han resuelto todas las posibilidades, y la función ya debería haber hecho su return antes.
 */
mean(...args) {
  let id = undefined;
  let dependencies = [];
  let factory = undefined;
  Validate_and_format_parameters: {
    if (args.length === 1) {
      if (typeof args[0] === "function") {
        factory = args[0];
      } else if(Array.isArray(args[0])) {
        return Promise.all(args[0].map(dependency => this.mean(dependency)));
      } else {
        this.assert(typeof args[0] === "string", `using mean: if args.length is 1 then args[0] must be dependencies:array, id:string or factory:function but «${typeof args[0]}» was found instead on «ModulerV5.prototype.mean»`);
        id = args[0];
      }
    } else if (args.length === 2) {
      this.assert(Array.isArray(args[0]), `using mean: if args.length is 2 then args[0] must be dependencies array but «${typeof args[0]}» was found instead on «ModulerV5.prototype.mean»`);
      this.assert(typeof args[1] === "function", `using mean: if args.length is 2 then args[1] must be factory function but «${typeof args[1]}» was found instead on «ModulerV5.prototype.mean»`);
      dependencies = args[0];
      factory = args[1];
    } else {
      throw new Error(`using mean: args.length must be between 1 and 2 but «${args.length}» was found instead on «ModulerV5.prototype.mean»`);
    }
  }
  if (typeof factory === "function") {
    Resolve_as_factory: {
      const dependencyPromises = dependencies.map(dependency => this.mean(dependency));
      return this._callModuleFactory(dependencyPromises, factory);
    }
  } else if (typeof id === "string") {
    Resolve_as_id: {
      id = this.fullpathOf(id);
      if (id in this.definitions) {
        return this.definitions[id];
      }
      return this.importModule(id);
    }
  }
  throw new Error("No, aquí no debería entrar, esta condición ya ha sido filtrada antes");
}