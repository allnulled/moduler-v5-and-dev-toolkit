static inspectToString(args, debugLevel) {
  if (debugLevel === 0) return `${[...args].length} args`;
  if (debugLevel === 1) return `${[...args].map((it, i) => i + ":" + typeof it).join(",")} args`;
  if (debugLevel === 2) return `${[...args].map((it, i) => i + ":" + typeof it + this.stringify(it)).join(",")} args`;
}