static existsFile(file) {
  return require("fs").promises.lstat(file).then(lstat => {
    return lstat.isFile();
  }).catch(error => false);
}