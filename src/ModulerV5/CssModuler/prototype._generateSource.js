_generateSource(eventToSync) {
  let css = "";
  for(let index=0; index<eventToSync.dependencies.length; index++) {
    const dependency = eventToSync.dependencies[index];
    css += `/*!original:${this.moduler.relpathOf(dependency.id)}*/\n`;
    css += `/*!order:${index+1}*/\n`;
    css += `${dependency.source.replace(this.constructor.symbols.REQUIRES_REGEX, match => "/*!" + match.substr(3))}\n\n`;
  }
  eventToSync.source = css;
}