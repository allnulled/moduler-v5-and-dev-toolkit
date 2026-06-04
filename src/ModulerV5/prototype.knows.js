knows(id) {
  this.trace("knows", arguments);
  // Comprueba si un id está en definitions
  Validate_parameters: {
    this.assert(typeof id === "string", "required «arguments[0]=id» as string to use «knows»");
  }
  Search_as_definition: {
    if (!(id in this.definitions)) {
      return false;
    }
    return true;
  }
}