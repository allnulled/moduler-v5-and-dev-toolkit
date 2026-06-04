static evalFile(file, injection = {}) {
  return require("fs").promises.readFile(file, "utf8").then(source => this.evalAsync(source, injection));
}