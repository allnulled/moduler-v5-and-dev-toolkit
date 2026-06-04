static createLoggerAssert(options = {}) {
  const startTime = options.startTime || new Date();
  return this.createAssert(message => {
    console.log(DevToolkit.CommandLine.Colors.style("greenBright").text(`${options.prefix || ""} |  OK | ${(((new Date()) - startTime) + "").padStart(6)} | ${message}`));
  }, message => {
    console.log(DevToolkit.CommandLine.Colors.style("redBright,underline,bold").text(`${options.prefix || ""} | ERR | ${(((new Date()) - startTime) + "").padStart(6)} | ${message}`));
    if(options.bulletproof !== true) {
      throw new this.AssertionError(message);
    }
  }, {
    "1"(message) {
      console.log(DevToolkit.CommandLine.Colors.style("cyan,underline").text(`${options.prefix || ""} |  #  | ${(((new Date()) - startTime) + "").padStart(6)} | ${message}`));
    }
  });
}