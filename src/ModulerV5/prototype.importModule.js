importModule(subpath, injection = {}) {
  
  return this.readPath(subpath).then(source => {
    const asyncFunction = new (async function () { }).constructor(`[${Object.keys(injection).join(",")}]`, "module", "exports", "LocalDictionary", "__filename", "__dirname", source);
    // console.log(asyncFunction.toString())
    
    return this.callModuleFactory(Object.values(injection), asyncFunction, this.cloneForFile(subpath), subpath, this.normalizationOf(subpath + "/.."));
  });
}