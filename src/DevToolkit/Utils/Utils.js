class Utils {
  static die(...args) {
    console.log(...args);
    process.exit(1);
  }
}