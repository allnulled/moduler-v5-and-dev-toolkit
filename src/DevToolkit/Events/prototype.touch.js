/**
 * @name DevToolkit.Events.prototype.touch
 * @parameter file:String - Fichero que se quiere hacer el touch.
 * @returns Promise<void> - No devuelve nada actualmente
 * @description Primero bloquea el semáforo, luego propaga el touch, el test, el distribute, y luego desbloquea el semáforo.
 */
async touch(file) {
  Acquire_semaphore: {
    await this.toolkit.semaphore.acquire();
  }
  Make_propagations: {
    try {
      await this.propagateOnTouch(file);
      await this.propagateOnTest(file);
      await this.propagateOnDistribute(file);
    } catch (error) {
      DevToolkit.CommandLine.printError(error);
    }
  }
  Release_semaphore: {
    await this.toolkit.semaphore.release();
  }
}