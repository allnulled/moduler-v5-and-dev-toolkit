readPath(file) {
  
  return this.isBrowser ? this.readUrl(file) : this.readFile(file);
}