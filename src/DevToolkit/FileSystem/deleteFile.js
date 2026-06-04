static deleteFile(file, options = { inTry: false }) {
  if(options.inTry) {
    require("fs").promises.unlink(file).catch(error => false);
  }
  return require("fs").promises.unlink(file);
}