constructor(moduler) {
  this.moduler = moduler;
  this.sheets = {};
  this.entry = typeof CSSStyleSheet === "function" ? new CSSStyleSheet() : this.constructor.fakeCssStyleSheet();
  if(!this.entry.isFake) {
    document.adoptedStyleSheets.push(this.entry);
  }
}