static deleteDirectory(file, options = { inTry: false }) {
  if(options.inTry) {
    return require("fs").promises.rm(file, { recursive: true }).catch(error => false);
  }
  return require("fs").promises.rm(file, { recursive: true });
}