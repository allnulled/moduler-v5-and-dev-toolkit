constructor(basedir = process.cwd()) {
  this.basedir = require("path").resolve(basedir);
  this.fileSystem = new this.constructor.FileSystem(this);
  this.cli = new this.constructor.CommandLine(this);
  this.documentator = new this.constructor.Documentator(this);
  this.testing = new this.constructor.Testing(this);
  this.templating = new this.constructor.Templating(this);
  this.events = new this.constructor.Events(this);
  this.semaphore = new this.constructor.Semaphore(this, "semaphore.dev-toolkit.txt");
  this.assert = this.constructor.Testing.Asserter.createAssert().assert;
}