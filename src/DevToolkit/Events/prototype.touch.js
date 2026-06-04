async touch(file) {
  this.trace("prototype.touch", arguments, 0);
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