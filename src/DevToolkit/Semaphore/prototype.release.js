/**
 * @name DevToolkit.Semaphore.prototype.release
 * @returns `Promise<void>` - No devuelve nada, solo que usa fs.promises.writeFile y devuelve lo que este.
 * @description Escribe `"released"` en el fichero semáforo.
 */
release() {
  return require("fs").promises.writeFile(this.getFilepath(), "released", "utf8");
}