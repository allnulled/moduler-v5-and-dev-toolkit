async _exportSource(eventToSync, options) {
  if(options.outFile) {
    await require("fs").promises.writeFile(this.moduler.fullpathOf(outFile), eventToSync.source, "utf8");
  }
}