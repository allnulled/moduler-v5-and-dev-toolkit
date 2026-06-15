/**
 * @name ModulerV5.prototype.knows
 * @type class method
 * @parameter id:String - Ruta de un módulo en this.definitions.
 * @returns Boolean - Si se conoce el id o no por this.definitions.
 * @description Aclara si la instancia conoce una ruta de módulo o no. Se utiliza el método this.normalizationOf con el id para normalizar la ruta, por lo cual soporta rutas relativas.
 */
knows(id) {
  // Comprueba si un id está en definitions
  Validate_parameters: {
    this.assert(typeof id === "string", "required «arguments[0]=id» as string to use «knows»");
  }
  Search_as_definition: {
    const normalizedId = this.normalizationOf(id);
    if (!(normalizedId in this.definitions)) {
      if(!(id in this.definitions)) {
        return false;
      }
    }
    return true;
  }
}