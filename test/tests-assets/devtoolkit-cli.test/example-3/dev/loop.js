const dev = require(__dirname + "/cli/api.js");

process.chdir(__dirname + "/..");

dev.Toolkit.FileWatcher.Refrescador.run({
  port: 3008,
  message: "OKKKK",
  watch: [__dirname + "/.."],
  ignore: [],
  extensions: [
    "js",
    "css",
    "html",
    "sh",
    "json",
    "md",
  ],
  executeCallback: [
    "dev/cli/api.js", // Cargamos el «dev» global
    // Aquí compilaríamos con el touch
    "!test/driven/current.js", // Ejecutamos el test actual
    "!dev/cli/tool/export/export-as-callback.js", // Exportamos
  ]
});