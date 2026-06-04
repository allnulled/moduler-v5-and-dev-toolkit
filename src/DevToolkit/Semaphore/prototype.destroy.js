async destroy() {
  const fs = require("fs");
  const target = this.getFilepath();
  try {
    await fs.promises.unlink(target);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}