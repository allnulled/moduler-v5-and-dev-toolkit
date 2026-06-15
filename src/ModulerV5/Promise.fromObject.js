/**
 * @name Promise.fromObject
 * @type static method
 * @parameter obj:Object - Objeto con las Promise.
 * @description Hace lo mismo que Promise.all pero en lugar de usar y devolver un Array, usa y devuelve un Object. Es un polyfill.
 */
Promise.fromObject = function (obj) {
  const allKeys = Object.keys(obj);
  return Promise.all(Object.values(Object.values(obj))).then(output => {
    let toObject = {};
    for (let index = 0; index < output.length; index++) {
      const item = output[index];
      toObject[allKeys[index]] = item;
    }
    return toObject;
  })
};