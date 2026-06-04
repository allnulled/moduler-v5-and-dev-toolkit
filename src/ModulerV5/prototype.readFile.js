readFile(file) {
  this.trace("readFile", arguments);
  return require("fs").promises.readFile(this.fullpathOf(file), "utf8");
}