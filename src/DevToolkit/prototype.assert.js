/**
 * @name DevToolkit.prototype.assert
 * @type class method + Function
 * @not-prototype
 * @in-constructor
 * @description Método assert propio de la clase.
 * @description Se saca de `this.constructor.Testing.Asserter.createAssert().assert`
 * @description Para saber su firma puedes mirar DevToolkit.Testing.Asserter.createAssert, y del objeto que saca, el método `assert`.
 */
this.assert = this.constructor.Testing.Asserter.createAssert().assert;