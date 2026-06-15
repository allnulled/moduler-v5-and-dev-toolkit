/**
 * @name ModulerV5.create
 * @type static method
 * @description Constructor que evita el `new`.
 */
static create(...args) {
  return new this(...args);
}