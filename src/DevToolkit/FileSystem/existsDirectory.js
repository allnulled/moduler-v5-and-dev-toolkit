static existsDirectory(file) {
  return require("fs").promises.lstat(file).then(lstat => {
    return lstat.isDirectory();
  }).catch(error => false);
}