readUrl(file) {
  this.trace("readUrl", arguments);
  return fetch(this.fullpathOf(file)).then(response => response.text());
}