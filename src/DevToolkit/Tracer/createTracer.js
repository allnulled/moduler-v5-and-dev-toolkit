static createTracer(prefix, firstMessage = false, isTracing = true) {
  let callback = undefined;
  callback = function (method, args = [], debugLevel = 0) {
    if(callback.isTracing === true) {
      console.log(DevToolkit.CommandLine.Colors.style("cyan").text(`[Trace:${prefix}.${method}]`) + ` ${Tracer.inspectToString(args, debugLevel)}`);
    }
    return callback;
  };
  callback.isTracing = isTracing;
  if (firstMessage) callback(firstMessage);
  return callback;
}