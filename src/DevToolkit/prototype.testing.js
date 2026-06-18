/**
 * @name DevToolkit.prototype.testing
 * @type class property + DevToolkit.Testing
 * @not-prototype
 * @in-constructor
 * @description Instancia de DevToolkit.Testing para esta instancia de DevToolkit.
 * @description Se utiliza para poder crear asertores (DevToolkit.Testing.Asserter)
 * @description No se hace un gran uso de esta instancia, pero por razones de provisionamiento anticipado, ya se adjunta también al DevToolkit una instancia de esta clase.
 * @description Para saber más, puedes ir a la clase DevToolkit.Testing
 */
this.testing = new this.constructor.Testing(this);