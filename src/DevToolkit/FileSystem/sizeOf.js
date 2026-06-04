static sizeOf(file) {
  return require("fs").promises.lstat(file).then(lstat => lstat.size);
}