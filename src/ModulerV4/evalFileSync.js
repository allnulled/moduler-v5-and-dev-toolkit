static evalFileSync(file, injection = {}) {
  return this.evalSync(require("fs").readFileSync(file).toString(), injection);
}