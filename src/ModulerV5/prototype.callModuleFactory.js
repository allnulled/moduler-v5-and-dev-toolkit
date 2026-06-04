callModuleFactory(dependencyPromises, factory, submoduler = null, filename = null, dirname = null) {
  if(typeof filename === "string" && filename.endsWith(".css")) {
    return this.css.add(filename);
  }
  const initialState = {};
  const modulo = { exports: initialState };
  return Promise.all(dependencyPromises).then(async resolvedDependencies => {
    const output = await factory(...resolvedDependencies, modulo, modulo.exports, submoduler ?? this, filename, dirname);
    const returnsUndefined = typeof output === "undefined";
    const isNotInitialState = modulo.exports !== initialState;
    const hasNewProperties = 0 !== Object.keys(modulo.exports).length;
    return modulo.exports = (returnsUndefined && (isNotInitialState || hasNewProperties) ? modulo.exports : output);
  });
}