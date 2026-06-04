knows(id) {
  // Comprueba si un id está en definitions
  Validate_parameters: {
    this.assert(typeof id === "string", "required «arguments[0]=id» as string to use «knows»");
  }
  Search_as_static: {
    if(id in this.statics) {
      return true;
    }
  }
  Search_as_definition: {
    if(!(id in this.definitions)) {
      return false;
    }
    return true;
  }
}