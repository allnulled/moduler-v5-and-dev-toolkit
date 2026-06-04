define(...args) {
  let id = undefined;
  let dependencies = [];
  let factory = undefined;
  Format_parameters: {
    if (args.length === 1) {
      [factory] = args;
    } else if (args.length === 2) {
      [id, factory] = args;
    } else if (args.length === 3) {
      [id, dependencies, factory] = args;
    } else {
      throw new Error("required «arguments.length» to be minimum 1 and maximum 3 to use «define»");
    }
  }
  Validate_parameters: {
    this.assert(typeof id === "string", "required «id» as string to use «define»");
    this.assert(Array.isArray(dependencies), `required «dependencies» as array to use «define» but «${typeof dependencies}» was found instead`);
    this.assert(typeof factory === "function", `required «factory» as function to use «define» but «${typeof factory}» was found instead`);
  }
  let parameters = [];
  let data = undefined;
  Resolve_dependencies: {
    for (let index = 0; index < dependencies.length; index++) {
      const dependency = dependencies[index];
      const parameter = this.mean(dependency);
      parameters.push(parameter);
    }
  }
  Resolve_factory: {
    data = factory(...parameters, id, this);
  }
  Export_definition:
  if (id) { // Puede ser solo factory con args.length === 1
    Resolve_definition: {
      this.definitions[id] = data;
    }
    Resolve_promise_as_static: {
      if (data instanceof Promise) {
        data.then(output => this.statics[id] = output);
      }
    }
  }
  Return_definition: {
    return data;
  }
}