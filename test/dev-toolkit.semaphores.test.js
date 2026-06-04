module.exports = async function ({ DevToolkit, devToolkit, startTime, titleColumns }) {
  const { assert } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix:"Semaphore".padEnd(titleColumns) });
  assert(1, "Starting DevToolkit.Semaphore test");
  assert(typeof DevToolkit.Semaphore === "function", "Can find DevToolkit.Semaphore");
  assert(typeof devToolkit.semaphore === "object", "Can find DevToolkit.prototype.semaphore");
  const { semaphore } = devToolkit;
  semaphore.setFilename("semaphore.test.txt");
  Test_that_fails_when_acquired_twice: {
    await semaphore.destroy();
    await semaphore.acquire();
    let failsOnAcquireTwice = false;
    try {
      await semaphore.acquire();
    } catch (error) {
      failsOnAcquireTwice = true;
    }
    assert(failsOnAcquireTwice, "Can throw when semaphore.acquire is called twice in a row");
  }
  Test_that_continues_when_acquired_released_acquired: {
    await semaphore.destroy();
    await semaphore.acquire();
    await semaphore.release();
    await semaphore.acquire();
    await semaphore.release();
    assert(true, "Can continue when semaphore.acquire is released and then re-acquired");
  }
};