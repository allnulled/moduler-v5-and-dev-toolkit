mean(...args) {
  this.trace("mean", arguments);
  let id = undefined;
  let dependencies = [];
  let callback = undefined;
  Validate_and_format_parameters: {
    if (args.length === 1) {
      if (typeof args[0] === "function") {
        callback = args[0];
      } else if(Array.isArray(args[0])) {
        return Promise.all(args[0].map(dependency => this.mean(dependency)));
      } else {
        this.assert(typeof args[0] === "string", `using mean: if args.length is 1 then args[0] must be id string or factory function but «${typeof args[0]}» was found instead on «ModulerV5.prototype.mean»`);
        id = args[0];
      }
    } else if (args.length === 2) {
      this.assert(Array.isArray(args[0]), `using mean: if args.length is 2 then args[0] must be dependencies array but «${typeof args[0]}» was found instead on «ModulerV5.prototype.mean»`);
      this.assert(typeof args[1] === "function", `using mean: if args.length is 2 then args[1] must be factory function but «${typeof args[1]}» was found instead on «ModulerV5.prototype.mean»`);
      dependencies = args[0];
      callback = args[1];
    } else {
      throw new Error(`using mean: args.length must be between 1 and 2 but «${args.length}» was found instead on «ModulerV5.prototype.mean»`);
    }
  }
  if (typeof callback === "function") {
    Resolve_as_callback: {
      const dependencyPromises = dependencies.map(dependency => this.mean(dependency));
      return this.callModuleFactory(dependencyPromises, callback);
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