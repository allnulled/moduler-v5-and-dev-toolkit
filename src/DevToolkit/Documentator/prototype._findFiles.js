_findFiles(globPattern = "**/*.js", options = {}) {
  this.trace("_findFiles", arguments);
  return require("glob").glob(globPattern, {
    // 1. Changeable options:
    cwd: this.toolkit.basedir,
    // 2. User options:
    ...options,
    // 3. Fixed options:
    absolute: true,
    ignore: [
      "node_modules",
      ...(typeof options.ignore === "undefined" ? [] : options.ignore),
    ],
  });
}