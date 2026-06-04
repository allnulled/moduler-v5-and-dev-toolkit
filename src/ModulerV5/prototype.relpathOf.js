relpathOf(subpath) {
  this.trace("relpathOf", arguments);
  if(this.isBrowser) {
    throw new Error("Must polyfill method «fullpathOf» to support browser environment");
  }
  return "@/" + this.fullpathOf(subpath).replace(this.rootdir, "").replace(/^\//g,"");
}