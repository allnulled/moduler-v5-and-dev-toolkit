mean(id) {
  let meaning = undefined;
  if (typeof id === "function") {
    Resolve_as_anonymous_factory: {
      meaning = id(id, this);
    }
  } else {
    Validate_parameters: {
      this.assert(typeof id === "string", "required «arguments[0]=id» as string to use «mean»");
    }
    if (id in this.statics) {
      Resolve_as_static: {
        meaning = this.statics[id];
      }
    } else {
      Resolve_as_definition: {
        this.assert(id in this.definitions, "required «arguments[0]=id» to be defined to use «mean»");
        meaning = this.definitions[id];
      }
    }
  }
  return meaning;
}