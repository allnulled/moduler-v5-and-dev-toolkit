const Toolkit = require(__dirname + "/../../src/lib/dev-toolkit/dev-toolkit.dist.js");
const toolkit = new Toolkit(__dirname + "/../..");

const dev = {
  Toolkit: Toolkit,
  toolkit: toolkit,
  cli: toolkit.cli,
  // Add other dev tools you wanna use globally in cli commands
};

module.exports = global.dev = dev;