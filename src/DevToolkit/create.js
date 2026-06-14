/**
 * @name DevToolkit.create
 * @type static method
 * @arguments Los mismos que el DevToolkit.constructor
 * @description Método para fácil construcción del objeto.
 */
static create(...args) { return new this(...args); }