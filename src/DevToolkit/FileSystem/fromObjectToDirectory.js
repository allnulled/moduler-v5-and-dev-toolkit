static async fromObjectToDirectory(obj, dir) {
  const fs = require("fs/promises");
  const path = require("path");
  const tasks = [];
  for (const [name, value] of Object.entries(obj)) {
    const fullPath = path.join(dir, name);
    if (typeof value === "string") {
      tasks.push(fs.writeFile(fullPath, value));
    } else {
      tasks.push(
        (async () => {
          await fs.mkdir(fullPath, { recursive: true });
          await this.fromObjectToDirectory(value, fullPath);
        })()
      );
    }
  }
  await Promise.all(tasks);
}