static evalFetch(url, injection = {}) {
  return fetch(url).then(response => response.text()).then(source => this.evalAsync(source, injection));
}