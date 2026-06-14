return {
  assertions: [
    ["Can find LocalDictionary from dependency script (point 1)", typeof LocalDictionary === "object" && LocalDictionary instanceof ModulerV5],
    ["Can find expected LocalDictionary.basedir from dependency script (point 2)", typeof LocalDictionary.basedir === "string" && LocalDictionary.basedir.endsWith("/demo2")],
    ["Can find expected LocalDictionary.rootdir from dependency script (point 3)", typeof LocalDictionary.rootdir === "string" && LocalDictionary.rootdir.endsWith("/moduler-v5.test/pathmodes")],
  ]
};