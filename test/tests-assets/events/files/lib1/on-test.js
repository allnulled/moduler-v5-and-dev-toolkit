module.exports = function(file) {
  require("fs").writeFileSync(__dirname + "/on-test-event.txt", "happened", "utf8");
};