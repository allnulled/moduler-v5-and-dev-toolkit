/**
 * @name DevToolkit.Debug.die
 * @type class method
 * @parameters ...args:Array - Lo que se quiere imprimir por consola antes de interrumpir el proceso.
 * @description Sirve para interrumpir el proceso, sacando con console.log lo que quieras antes. Usa `process.exit(1)` para ello.
 */
static die(...args) {
  console.log(...args);
  process.exit(1);
}