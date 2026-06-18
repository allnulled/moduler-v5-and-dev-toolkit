(function (mod) {
  if (typeof window !== 'undefined') window['ModulerV5'] = mod;
  if (typeof global !== 'undefined') global['ModulerV5'] = mod;
  if (typeof module !== 'undefined') module.exports = mod;
})(function () {
  /**
   * @name ModulerV5
   * @type class
   * @description Clase útil para modulación en runtime de JavaScript y CSS.
   * @exports window.ModulerV5 - Para poder encontrarla en el browser globalmente
   * @exports global.ModulerV5 - Para poder encontrarla en node.js globalmente
   * @exports module.exports - Para poder importarla en node.js con require o import
   * @file moduler-v5.dist.js
   */
  const ModulerV5 = /*<$=await include("./ModulerV5.class.js")$>*/0;
  /*<$=await include("./Dictionary.js")$>*/
  /*<$=await include("./Promise.fromObject.js")$>*/
  return ModulerV5;
}.call());