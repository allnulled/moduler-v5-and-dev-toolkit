importModule(subpath, injection = {}) {
  this.trace("importModule", arguments);
  return this.readPath(subpath).then(source => {
    const asyncFunction = new (async function () { }).constructor(...Object.keys(injection), "module", "exports", "$dictionary", "__filename", "__dirname", source);
    this.trace("importModule::evaluating JS", [], 2);
    return this.callModuleFactory(Object.values(injection), asyncFunction, this.cloneForFile(subpath), subpath, this.normalizationOf(subpath + "/.."));
  });
}