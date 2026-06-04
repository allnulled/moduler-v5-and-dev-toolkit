module.exports = function(file) {
  require("fs").writeFileSync(__dirname + "/on-touch-event.txt", "happened", "utf8");
};