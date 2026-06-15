/**
 * @name ModulerV5.CssModuler.prototype._generateSource
 * @type private method
 * @parameter eventToSync:Object - Se usará su propiedad eventToSync.dependencies y eventToSync.source
 * @returns void - Nada.
 * @description Este método acumula el css de las dependencias especificadas y lo vuelva en eventToSync.source.
 * @explanation En el camino pone una cabecera para cada dependencia, para que en el resultado se pueda distinguir el fragmento de cada dependencia css.
 * @explanation Las cabeceras son: **!original** con la ruta del fichero y **!order** con el número ordinal de la dependencia.
 * @explanation También hace un reemplazo de los `@requires:fichero.css` por `!requires:fichero.css`, lo cual permite que cualquier css compilado, pueda usarse, sin problemas de recursividad, como dependencia de otro css que quiere ser compilado.
 */
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