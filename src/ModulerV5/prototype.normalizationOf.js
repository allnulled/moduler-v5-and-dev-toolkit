normalizationOf = function (subpath, debug = false) {
  const parts = (() => {
    if (subpath.match(/^[A-Za-z0-9\_\-]+\:\/\//g)) {
      return subpath;
    } else if (subpath.startsWith("./")) {
      return [this.basedir.replace(/(?!\:\/)\/$/g, ""), subpath.substr(2)].join("/");
    } else if (subpath.startsWith("../")) {
      return [this.basedir.replace(/(?!\:\/)\/$/g, "") + "/..", subpath.substr(3)].join("/");
    } else if (subpath.startsWith("@/")) {
      return [this.rootdir.replace(/(?!\/)\/$/g, ""), subpath.substr(2)].join("/");
    } else if (subpath.startsWith("/")) {
      return subpath;
    } else {
      return [this.basedir.replace(/(?!\/)\/$/g, ""), subpath].join("/");
    }
  })().split(/(\/+)/g).filter(p => p !== "");
  //console.log(parts);
  const stack = [];
  Iterating_parts:
  for (const part of parts) {
    if (part === ".") {
      // @OK
    } else if (part === "..") {
      if (stack.length && stack[stack.length - 1] === "/") {
        stack.pop();
        stack.pop();
      } else if (stack.length && stack[stack.length - 1] === "//") {
        // @OK
      } else if (stack.length) {
        stack.pop();
      } else {
        // @OK
      }
    } else if (part === "/") {
      if (stack.length && stack[stack.length - 1] === "/") {
        // @OK
      } else if (stack.length && stack[stack.length - 1] === "//") {
        // @OK
      } else {
        stack.push(part);
      }
    } else {
      stack.push(part);
    }
  }
  let finalUrl = stack.join("");
  if(finalUrl.length !== 1) {
    finalUrl = finalUrl.replace(/\/$/g, "");
  }
  if (debug) {
    console.log(finalUrl);
  }
  return finalUrl;
};