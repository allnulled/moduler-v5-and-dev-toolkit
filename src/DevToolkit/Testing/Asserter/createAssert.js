static createAssert(onSuccess = this.defaultOnSuccess, onError = this.defaultOnError, specificOutputs = {}) {
  const assert = function (condition, message) {
    if (["string", "number"].includes(typeof condition) && condition in specificOutputs) {
      return specificOutputs[condition](message);
    } else if (condition) {
      return onSuccess(message);
    } else {
      return onError(message);
    }
  };
  return {
    assert,
    // Aserciones de filesystem:
    assertFileExists: function (file, message) {
      return DevToolkit.FileSystem.readFile(file, { inTry: true }).then(out => assert(typeof out === "string", message));
    },
    assertDirectoryExists: function (dir, message) {
      return DevToolkit.FileSystem.readDirectory(dir, { inTry: true }).then(out => assert(typeof out === "object", message));
    },
    assertFileContents: function (file, contents, message) {
      return DevToolkit.FileSystem.readFile(file, { inTry: true }).then(out => assert(out === contents, message));
    },
    assertFileMissing: function (file, message) {
      return DevToolkit.FileSystem.readFile(file, { inTry: true }).then(out => assert(typeof out !== "string", message));
    },
    assertDirectoryMissing: function (dir, message) {
      return DevToolkit.FileSystem.readDirectory(dir, { inTry: true }).then(out => assert(typeof out !== "object", message));
    },
  };
}