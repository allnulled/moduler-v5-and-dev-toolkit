/**
 * @name ModulerV5.prototype.cloneForFile
 * @type class method
 * @parameter file:String - Fichero base para la nueva instancia de ModulerV5. Interesa su directorio, pero se facilita el no tener que extraerlo.
 * @returns ModulerV5 - Una nueva instancia de ModulerV5, que hereda de la actual, el this.
 * @description Básicamente hace: `return ModulerV5.create(this, file + "/..")`. Puedes ir al constructor de ModulerV5 para entender qué sucede al hacer esto.
 */
cloneForFile(file) {
  return ModulerV5.create(this, file + "/..");
}