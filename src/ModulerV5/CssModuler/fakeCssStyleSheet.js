static fakeCssStyleSheet() {
  return new class FakeCssStyleSheet {
    isFake = true;
    replace(...args) {
      // console.log("in node.js this does nothing", args)
    }
  }();
}