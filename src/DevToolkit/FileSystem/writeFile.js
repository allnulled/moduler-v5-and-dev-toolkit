static writeFile(file, contents, options = { recursive: false }) {
  if(options.recursive) throw new Error("operation not supported yet: writeFile + recursive=true");
  return require("fs").promises.writeFile(file, contents);
}