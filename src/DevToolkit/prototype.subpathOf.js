subpathOf(subpath) {
  if(!subpath.startsWith(this.basedir + "/")) throw new Error(`provided file is not a subpath of «${this.toolkit.basedir}»`);
  return subpath.replace(this.basedir + "/", "");
}