/**
 * @name DevToolkit.Time
 * @type class
 * @description Clase con utilidades para tiempo.
 * 
 */
static Time = class Time {
  static timeout(ms) {
    return require("timers/promises").setTimeout(ms);
  }
}