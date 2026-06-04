static defaultOnError(message) {
  throw new this.AssertionError(message);
}