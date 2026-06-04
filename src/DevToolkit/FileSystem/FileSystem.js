class FileSystem {
  /*<$=await include("./exists.js")$>*/
  /*<$=await include("./existsFile.js")$>*/
  /*<$=await include("./readFile.js")$>*/
  /*<$=await include("./writeFile.js")$>*/
  /*<$=await include("./deleteFile.js")$>*/
  /*<$=await include("./existsDirectory.js")$>*/
  /*<$=await include("./readDirectory.js")$>*/
  /*<$=await include("./writeDirectory.js")$>*/
  /*<$=await include("./deleteDirectory.js")$>*/
  /*<$=await include("./emptyDirectory.js")$>*/
  /*<$=await include("./fromDirectoryToObject.js")$>*/
  /*<$=await include("./fromObjectToDirectory.js")$>*/
  /*<$=await include("./sizeOf.js")$>*/
  /*<$=await include("./constructor.js")$>*/
  exists(file, ...args) {
    return this.constructor.exists(this.toolkit.fullpathOf(file), ...args);
  }
  existsFile(file, ...args) {
    return this.constructor.existsFile(this.toolkit.fullpathOf(file), ...args);
  }
  readFile(file, ...args) {
    return this.constructor.readFile(this.toolkit.fullpathOf(file), ...args);
  }
  writeFile(file, ...args) {
    return this.constructor.writeFile(this.toolkit.fullpathOf(file), ...args);
  }
  deleteFile(file, ...args) {
    return this.constructor.deleteFile(this.toolkit.fullpathOf(file), ...args);
  }
  existsDirectory(file, ...args) {
    return this.constructor.existsDirectory(this.toolkit.fullpathOf(file), ...args);
  }
  readDirectory(file, ...args) {
    return this.constructor.readDirectory(this.toolkit.fullpathOf(file), ...args);
  }
  writeDirectory(file, ...args) {
    return this.constructor.writeDirectory(this.toolkit.fullpathOf(file), ...args);
  }
  deleteDirectory(file, ...args) {
    return this.constructor.deleteDirectory(this.toolkit.fullpathOf(file), ...args);
  }
  emptyDirectory(file, ...args) {
    return this.constructor.emptyDirectory(this.toolkit.fullpathOf(file), ...args);
  }
  fromDirectoryToObject(file, ...args) {
    return this.constructor.fromDirectoryToObject(this.toolkit.fullpathOf(file), ...args);
  }
  fromObjectToDirectory(obj, dir) {
    return this.constructor.fromObjectToDirectory(obj, this.toolkit.fullpathOf(dir));
  }
  sizeOf(file, ...args) {
    return this.constructor.sizeOf(this.toolkit.fullpathOf(file), ...args);
  }
}