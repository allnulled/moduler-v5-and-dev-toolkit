remove(input1) {
  const id = this.moduler.fullpathOf(input1);
  this.assert(id in this.sheets, "cannot remove sheet because it is not added: " + id);
  delete this.sheets[id];
  return this;
}