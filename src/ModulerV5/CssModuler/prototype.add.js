async add(input1 = null, eventToAdd = { newSheets: {}, oldSheets: {}, count: 0 }) {
  this.assert(typeof input1 === "string", "on CssModuler.prototype.add: arguments[0] must be string");
  const id = this.moduler.fullpathOf(input1);
  if (id in this.sheets) {
    if (!(id in eventToAdd.oldSheets)) {
      eventToAdd.oldSheets = [];
    }
    eventToAdd.oldSheets[id].push(eventToAdd.count++);
  } else {
    const source = await this.moduler.readPath(id);
    const allRequires = source.match(this.constructor.symbols.REQUIRES_REGEX);
    const submoduler = this.moduler.cloneForFile(id);
    const requires = !allRequires ? [] : allRequires.map(match => {
      const subpath = match.substr("/*@requires:".length).trim().slice(0, -2).trim();
      return submoduler.fullpathOf(subpath);
    });
    const moduloCss = { id, source, requires };
    this.sheets[id] = moduloCss;
    eventToAdd.newSheets[id] = eventToAdd.count++;
    for (let index = 0; index < requires.length; index++) {
      const subid = requires[index];
      await this.add(subid, eventToAdd);
    }
  }
  return eventToAdd;
}