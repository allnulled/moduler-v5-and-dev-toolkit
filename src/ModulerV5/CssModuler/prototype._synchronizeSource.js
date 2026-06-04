async _synchronizeSource(eventToSync) {
  // @BROWSER pero polifileado:
  await this.entry.replace(eventToSync.source);
}