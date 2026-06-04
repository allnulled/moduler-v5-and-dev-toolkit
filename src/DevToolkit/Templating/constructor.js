constructor(toolkit) {
  this.toolkit = toolkit;
  this.tjs = this.constructor.Tjs.create(this.toolkit.basedir);
}