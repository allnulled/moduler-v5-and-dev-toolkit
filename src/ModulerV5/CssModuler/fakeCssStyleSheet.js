/**
 * @name ModulerV5.fakeCssStyleSheet
 * @type static method
 * @returns fakeStyleSheet:FakeCssStyleSheet
 * @description Devuelve una CSSStyleSheet de tipo fake, para polifilear lo mínimo en entornos no-navegador.
 */
static fakeCssStyleSheet() {
  return new class FakeCssStyleSheet {
    isFake = true;
    replace(...args) {
      // console.log("in node.js this does nothing", args)
    }
  }();
}