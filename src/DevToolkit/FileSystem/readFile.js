static readFile(file, inTry = false) {
  if (inTry) {
    return require("fs").promises.readFile(file, "utf8").catch(error => false);
  }
  return require("fs").promises.readFile(file, "utf8");
}