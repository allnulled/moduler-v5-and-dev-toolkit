(function (mod) {
  if (typeof window !== 'undefined') window['DevToolkit'] = mod;
  if (typeof global !== 'undefined') global['DevToolkit'] = mod;
  if (typeof module !== 'undefined') module.exports = mod;
})(function () {
  const Tracer = /*<$=await include("./Tracer/Tracer.js")$>*/0;
  return class DevToolkit {
    static Tracer = Tracer;
    static Utils = /*<$=await include("./Utils/Utils.js")$>*/0;
    static Debug = /*<$=await include("./Debug/Debug.js")$>*/0;
    static Documentator = /*<$=await include("./Documentator/Documentator.js")$>*/0;
    static CommandLine = /*<$=await include("./CommandLine/CommandLine.js")$>*/0;
    static Testing = /*<$=await include("./Testing/Testing.js")$>*/0;
    static Events = /*<$=await include("./Events/Events.js")$>*/0;
    static Semaphore = /*<$=await include("./Semaphore/Semaphore.js")$>*/0;
    static FileWatcher = /*<$=await include("./FileWatcher/FileWatcher.js")$>*/0;
    static FileSystem = /*<$=await include("./FileSystem/FileSystem.js")$>*/0;
    static Templating = /*<$=await include("./Templating/Templating.js")$>*/0;
    static Time = /*<$=await include("./Time/Time.js")$>*/0;
    /*<$=await include("./constructor.js")$>*/
    /*<$=await include("./prototype.fullpathOf.js")$>*/
    /*<$=await include("./prototype.subpathOf.js")$>*/
  };
}.call());