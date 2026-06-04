isTracing = false;
trace(method, args = [], debugLevel = 0) {
  if(!this.isTracing) return;
  console.log(`[${method}] ${this.constructor.inspectToString(args, debugLevel)}`)
}