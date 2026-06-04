define(...args) {
  this.trace("define", arguments);
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
    return this.callModuleFactory(dependencyPromises, factory);
  }
}