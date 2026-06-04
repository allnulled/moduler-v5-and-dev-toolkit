module.exports = $dictionary.define([
  "./lib1/a.js",
  "./lib1/b.js",
  "./lib1/c.js"
], function(a, b, c) {
    return { a, b, c };
});