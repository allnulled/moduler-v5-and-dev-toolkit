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
  const ModulerV5 = class {
    /*<$=await include("./default.js")$>*/
    /*<$=await include("./CssModuler/CssModuler.js")$>*/0;
    /*<$=await include("./create.js")$>*/
    /*<$=await include("./constructor.js")$>*/
    /*<$=await include("./inspectToString.js")$>*/
    /*<$=await include("./stringify.js")$>*/
    /*<$=await include("./prototype.isTracing.js")$>*/
    /*<$=await include("./prototype.trace.js")$>*/
    /*<$=await include("./prototype.assert.js")$>*/
    /*<$=await include("./prototype.normalizationOf.js")$>*/
    /*<$=await include("./prototype.fullpathOf.js")$>*/
    /*<$=await include("./prototype.relpathOf.js")$>*/
    /*<$=await include("./prototype.importModule.js")$>*/
    /*<$=await include("./prototype.readPath.js")$>*/
    /*<$=await include("./prototype.readUrl.js")$>*/
    /*<$=await include("./prototype.readFile.js")$>*/
    /*<$=await include("./prototype.knows.js")$>*/
    /*<$=await include("./prototype.define.js")$>*/
    /*<$=await include("./prototype.mean.js")$>*/
    /*<$=await include("./prototype.cloneForFile.js")$>*/
    /*<$=await include("./prototype.cloneForDirectory.js")$>*/
    /*<$=await include("./prototype._callModuleFactory.js")$>*/
  };

  /*<$=await include("./Dictionary.js")$>*/

  /*<$=await include("./Promise.fromObject.js")$>*/
  
  return ModulerV5;

}.call());