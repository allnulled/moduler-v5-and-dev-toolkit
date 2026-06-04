constructor(toolkit, filename = "semaphore.main.txt") {
  this.trace = Tracer.createTracer("DevToolkit.Semaphore", "constructor");
  this.toolkit = toolkit;
  this.filename = filename;
}