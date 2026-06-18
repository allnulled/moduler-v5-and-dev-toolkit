module.exports = async function() {
  await require("timers/promises").setTimeout(100);
  return 300;
}