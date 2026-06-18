(function (mod) {
  if (typeof window !== 'undefined') window['DevToolkit'] = mod;
  if (typeof global !== 'undefined') global['DevToolkit'] = mod;
  if (typeof module !== 'undefined') module.exports = mod;
})(function () {
  /**
   * @name DevToolkit
   * @type class
   * @description Clase para las utilidades principales en el tiempo de desarrollo.
   */
  return class DevToolkit {
    /*<$=await include("./create.js")$>*/
    /*<$=await include("./Tracer/Tracer.js")$>*/
    /*<$=await include("./Utils/Utils.js")$>*/
    /*<$=await include("./Debug/Debug.js")$>*/
    /*<$=await include("./Reflection/Reflection.js")$>*/
    /*<$=await include("./Documentator/Documentator.js")$>*/
    /*<$=await include("./CommandLine/CommandLine.js")$>*/
    /*<$=await include("./Testing/Testing.js")$>*/
    /*<$=await include("./Events/Events.js")$>*/
    /*<$=await include("./Semaphore/Semaphore.js")$>*/
    /*<$=await include("./FileWatcher/FileWatcher.js")$>*/
    /*<$=await include("./FileSystem/FileSystem.js")$>*/
    /*<$=await include("./Templating/Templating.js")$>*/
    /*<$=await include("./Time/Time.js")$>*/
    /*<$=await include("./constructor.js")$>*/
    /*<$=await include("./prototype.fullpathOf.js")$>*/
    /*<$=await include("./prototype.subpathOf.js")$>*/
  };
}.call());