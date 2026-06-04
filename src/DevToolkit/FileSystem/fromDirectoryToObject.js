static async fromDirectoryToObject(dir, options = {}) {
  const entries = await fs.promises.readdir(dir, {
    withFileTypes: true
  });
  const result = {};
  Iterating_entries:
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (typeof options.filter === "function") {
      if (!options.filter(fullPath, entry)) {
        continue Iterating_entries;
      }
    }
    if (entry.isDirectory()) {
      result[entry.name] = await fromDirectoryToObject(fullPath, options);
    } else {
      result[entry.name] = await fs.promises.readFile(fullPath, "utf8");
    }
  }
  return result;
}