readUrl(file) {
  
  return fetch(this.fullpathOf(file)).then(response => response.text());
}