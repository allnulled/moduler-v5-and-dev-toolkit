(function (factory) {
  const mod = factory();
  if (typeof window !== 'undefined') {
    window['ModulerV4'] = mod;
  }
  if (typeof global !== 'undefined') {
    global['ModulerV4'] = mod;
  }
  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
})(function () {
  const ModulerV4 = class {
    // Propiedades estáticas:
    // Métodos estáticos:
    /*<$=await include("./create.js")$>*/
    // Métodos estáticos:
    /*<$=await include("./assert.js")$>*/
    /*<$=await include("./import.js")$>*/
    /*<$=await include("./require.js")$>*/
    /*<$=await include("./evalAsync.js")$>*/
    /*<$=await include("./evalSync.js")$>*/
    /*<$=await include("./eval.js")$>*/
    /*<$=await include("./evalFetch.js")$>*/
    /*<$=await include("./evalFile.js")$>*/
    /*<$=await include("./evalFileSync.js")$>*/
    // Propiedades prototipo iniciales:
    /*<$=await include("./prototype.definitions.js")$>*/
    /*<$=await include("./prototype.statics.js")$>*/
    // Métodos dinámicos:
    /*<$=await include("./constructor.js")$>*/
    // Métodos dinámicos para definiciones:
    /*<$=await include("./prototype.knows.js")$>*/
    /*<$=await include("./prototype.define.js")$>*/
    /*<$=await include("./prototype.mean.js")$>*/
  };
  Promise.fromObject = function (obj) {
    const allKeys = Object.keys(obj);
    return Promise.all(Object.values(Object.values(obj))).then(output => {
      let toObject = {};
      for(let index=0; index<output.length; index++) {
        const item = output[index];
        toObject[allKeys[index]] = item;
      }
      return toObject;
    })
  };
  return ModulerV4;
});