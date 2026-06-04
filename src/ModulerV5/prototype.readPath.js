readPath(file) {
  this.trace("readPath", arguments, 0);
  return this.isBrowser ? this.readUrl(file) : this.readFile(file);
}