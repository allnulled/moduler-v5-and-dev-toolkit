static writeDirectory(file, options = { recursive: false }) {
  return require("fs").promises.mkdir(file, options);
}