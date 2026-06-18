#!/usr/bin/env node

console.log(process.argv);
module.exports = require(__dirname + "/api.js").cli.tool(process.argv);