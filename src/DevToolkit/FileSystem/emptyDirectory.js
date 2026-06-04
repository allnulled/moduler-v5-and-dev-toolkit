static async emptyDirectory(dir) {
  return await require("fs").promises.rm(dir, {
    recursive: true,
    force: true,
  }).then(() => {
    return require("fs").promises.mkdir(dir, {
      recursive: false
    });
  });
}