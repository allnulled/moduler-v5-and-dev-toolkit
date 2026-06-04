static exists(file) {
  return require("fs").promises.lstat(file).catch(error => false);
}