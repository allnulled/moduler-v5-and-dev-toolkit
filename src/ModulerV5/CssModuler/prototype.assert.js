/**
 * @name ModulerV5.CssModuler.prototype.assert
 * @type class method
 * @parameter condition:Boolean - Condición que se aserciona
 * @parameter message:String - Mensaje de error en caso de la aserción fallar
 * @description Método propio para hacer aserciones locales en algunos métodos.
 */
assert(condition, message) {
  if (!condition) throw new Error("AssertionError in CssModuler: " + message);
}