readFile(file) {
  
  return require("fs").promises.readFile(this.fullpathOf(file), "utf8");
}