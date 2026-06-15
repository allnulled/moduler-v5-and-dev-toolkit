/**
 * @name ModulerV5.prototype.readUrl
 * @parameter url:String - URL. Puede ser relativa.
 * @returns `Promise<String>` - El contenido utf8 de la URL.
 * @description Devuelve el contenido de la URL, aceptando rutas relativas.
 */
readUrl(url) {
  return fetch(this.fullpathOf(url)).then(response => response.text());
}