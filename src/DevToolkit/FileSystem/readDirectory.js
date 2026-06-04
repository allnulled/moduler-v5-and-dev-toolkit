static readDirectory(file, options = { inTry: false }) {
  if(options.inTry) {
    return require("fs").promises.readdir(file).catch(error => false);
  }
  return require("fs").promises.readdir(file);
}