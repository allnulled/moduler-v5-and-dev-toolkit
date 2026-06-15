/**
 * @name ModulerV5.prototype.assert
 * @type class method
 * @parameter condition:Boolean - Condición a comprobar
 * @parameter message:String - Mensaje del error, lanzado si la condición no se cumple.
 * @description Método de aserción interno.
 */
assert(condition, message) {
  if (!condition) throw new Error("AssertionError in ModulerV5: " + message);
}