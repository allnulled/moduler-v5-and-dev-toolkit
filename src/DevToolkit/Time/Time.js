class Time {
  static timeout(ms) {
    return require("timers/promises").setTimeout(ms);
  }
}