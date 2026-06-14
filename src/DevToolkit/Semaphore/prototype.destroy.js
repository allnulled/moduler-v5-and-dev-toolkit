/**
 * @name DevToolkit.Semaphore.prototype.destroy
 * @type class method
 * @throws Error - Lanza el error que se produzca por unlink, a no ser que fuera que el fichero no existía, en cuyo caso devuelve false solamente.
 * @returns Promise<Boolean> - Devuelve true si existía, false si no existía.
 * @description Elimina el fichero de semáforo.
 */
async destroy() {
  const fs = require("fs");
  const target = this.getFilepath();
  try {
    await fs.promises.unlink(target);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}