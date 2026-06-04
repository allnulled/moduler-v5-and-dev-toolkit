return {
  assertions: [
    ["Can find $dictionary from dependency script (point 1)", typeof $dictionary === "object" && $dictionary instanceof ModulerV5],
    ["Can find expected $dictionary.basedir from dependency script (point 2)", typeof $dictionary.basedir === "string" && $dictionary.basedir.endsWith("/demo2")],
    ["Can find expected $dictionary.rootdir from dependency script (point 3)", typeof $dictionary.rootdir === "string" && $dictionary.rootdir.endsWith("/moduler-v5.test/pathmodes")],
  ]
};