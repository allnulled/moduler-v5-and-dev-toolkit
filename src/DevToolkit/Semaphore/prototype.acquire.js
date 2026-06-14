/**
 * @name DevToolkit.Semaphore.prototype.acquire
 * @type class method
 * @returns Promise<void> - No devuelve nada.
 * @description Bloquea el semáforo, o lanza un error si no está liberado. Si el error es que no existe el fichero, lo ignora y lo crea. El semáforo está desbloqueado si su contenido es `released`.
 */
async acquire() {
  const fs = require("fs");
  const target = this.getFilepath();
  Reading_state: {
    try {
      const contents = await fs.promises.readFile(target, "utf8");
      if (contents !== "released") throw new Error(`cannot acquire semaphore because it is not released right now it is «${contents}»`);
    } catch (error) {
      if (error.code === "ENOENT") break Reading_state;
      throw error;
    }
  }
  await fs.promises.writeFile(target, "acquired", "utf8");
}