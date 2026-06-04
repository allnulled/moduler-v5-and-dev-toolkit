release() {
  return require("fs").promises.writeFile(this.getFilepath(), "released", "utf8");
}