async synchronize(options = {outFile:false}) {
  const eventToSync = {
    counter: 0,
    dependencies: [],
  };
  await this._sortSheets(eventToSync, options);
  await this._generateSource(eventToSync, options);
  await this._synchronizeSource(eventToSync, options);
  await this._exportSource(eventToSync, options);
  return eventToSync;
}