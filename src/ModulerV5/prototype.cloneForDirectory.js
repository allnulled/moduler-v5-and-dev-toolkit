/**
 * @name ModulerV5.prototype.cloneForDirectory
 * @type class method
 * @parameter directory:String - Directorio base para la nueva instancia de ModulerV5.
 * @returns ModulerV5 - Una nueva instancia de ModulerV5, que hereda de la actual, el this.
 * @description Básicamente hace: `return ModulerV5.create(this, directory)`. Puedes ir al constructor de ModulerV5 para entender qué sucede al hacer esto.
 */
cloneForDirectory(directory) {
  return ModulerV5.create(this, directory);
}