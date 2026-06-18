#!/usr/bin/env node

module.exports = function (...args) {
  return require(__dirname + "/api.js").cli.tool(args);
};