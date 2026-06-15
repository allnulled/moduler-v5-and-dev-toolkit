/**
 * @name ModulerV5.CssModuler.symbols
 * @type static property + Object
 * @description Contiene las regex usadas por la clase, como la del `/ *@requires:...* /`.
 */
static symbols = {
  REQUIRES_REGEX: /(\/\*\@requires\:((?!\*\/).)+\*\/)+(\r|\t|\n| )?/g
};