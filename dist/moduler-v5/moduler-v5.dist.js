(function(mod) {
 if (typeof window !== 'undefined') window['ModulerV5'] = mod;
 if (typeof global !== 'undefined') global['ModulerV5'] = mod;
 if (typeof module !== 'undefined') module.exports = mod;
})(function() {

 const ModulerV5 = class {
  static CssModuler = class CssModuler {
   static create(...args) {
    return new this(...args);
   }
   static fakeCssStyleSheet() {
    return new class FakeCssStyleSheet {
     isFake = true;
     replace(...args) {
      // console.log("in node.js this does nothing", args)
     }
    }();
   }
   static symbols = {
    REQUIRES_REGEX: /(\/\*\@requires\:((?!\*\/).)+\*\/)+(\r|\t|\n| )?/g
   };
   constructor(moduler) {
    this.moduler = moduler;
    this.sheets = {};
    this.entry = typeof CSSStyleSheet === "function" ? new CSSStyleSheet() : this.constructor.fakeCssStyleSheet();
    if (!this.entry.isFake) {
     document.adoptedStyleSheets.push(this.entry);
    }
   }
   assert(condition, message) {
    if (!condition) throw new Error("AssertionError in CssModuler: " + message);
   }
   async add(input1 = null, eventToAdd = {
    newSheets: {},
    oldSheets: {},
    count: 0
   }) {
    this.assert(typeof input1 === "string", "on CssModuler.prototype.add: arguments[0] must be string");
    const id = this.moduler.fullpathOf(input1);
    if (id in this.sheets) {
     if (!(id in eventToAdd.oldSheets)) {
      eventToAdd.oldSheets = [];
     }
     eventToAdd.oldSheets[id].push(eventToAdd.count++);
    } else {
     const source = await this.moduler.readPath(id);
     const allRequires = source.match(this.constructor.symbols.REQUIRES_REGEX);
     const submoduler = this.moduler.cloneForFile(id);
     const requires = !allRequires ? [] : allRequires.map(match => {
      const subpath = match.substr("/*@requires:".length).trim().slice(0, -2).trim();
      return submoduler.fullpathOf(subpath);
     });
     const moduloCss = {
      id,
      source,
      requires
     };
     this.sheets[id] = moduloCss;
     eventToAdd.newSheets[id] = eventToAdd.count++;
     for (let index = 0; index < requires.length; index++) {
      const subid = requires[index];
      await this.add(subid, eventToAdd);
     }
    }
    return eventToAdd;
   }
   _sortSheets(eventToSync) {
    const dependencies = [];
    const visited = new Set();
    const visit = (sheetId) => {
     if (visited.has(sheetId)) {
      return;
     }
     visited.add(sheetId);
     const sheet = this.sheets[sheetId];
     if (!sheet) {
      return;
     }
     for (const dependencyId of sheet.requires) {
      visit(dependencyId);
     }
     dependencies.push(sheet);
    };
    for (const sheetId in this.sheets) {
     visit(sheetId);
    }
    eventToSync.dependencies = dependencies;
    eventToSync.counter = dependencies.length;
   }
   _generateSource(eventToSync) {
    let css = "";
    for (let index = 0; index < eventToSync.dependencies.length; index++) {
     const dependency = eventToSync.dependencies[index];
     css += `/*!original:${this.moduler.relpathOf(dependency.id)}*/\n`;
     css += `/*!order:${index+1}*/\n`;
     css += `${dependency.source.replace(this.constructor.symbols.REQUIRES_REGEX, match => "/*!" + match.substr(3))}\n\n`;
    }
    eventToSync.source = css;
   }
   async _synchronizeSource(eventToSync) {
    // @BROWSER pero polifileado:
    await this.entry.replace(eventToSync.source);
   }
   async _exportSource(eventToSync, options) {
    if (options.outFile) {
     await require("fs").promises.writeFile(this.moduler.fullpathOf(outFile), eventToSync.source, "utf8");
    }
   }
   remove(input1) {
    const id = this.moduler.fullpathOf(input1);
    this.assert(id in this.sheets, "cannot remove sheet because it is not added: " + id);
    delete this.sheets[id];
    return this;
   }
   async synchronize(options = {
    outFile: false
   }) {
    const eventToSync = {
     counter: 0,
     dependencies: [],
    };
    await this._sortSheets(eventToSync, options);
    await this._generateSource(eventToSync, options);
    await this._synchronizeSource(eventToSync, options);
    await this._exportSource(eventToSync, options);
    return eventToSync;
   }
  };
  static InjectionParser = class InjectionParser {
   static TOKENS = [
    "/* @inject.source(",
    "/* @inject.source.string(",
    "/* @inject.template(",
    "/* @inject.template.string(",
    "/* @inject.module(",
    "// @inject.source(",
    "// @inject.source.string(",
    "// @inject.template(",
    "// @inject.template.string(",
    "// @inject.module(",
    "inject.source(",
    "inject.source.string(",
    "inject.template(",
    "inject.template.string(",
    "inject.module(",
   ];
   static create(code) {
    return new this(code);
   }
   constructor(code) {
    this.code = code;
    this.i = 0;
   }
   parse() {
    const results = [];
    this.i = 0;
    while (!this.eof()) {
     const tokenInfo = this.findNextToken();
     if (!tokenInfo) {
      break;
     }
     const {
      token,
      start
     } = tokenInfo;
     this.i = start + token.length;
     const tokenStart = start;
     this.skipSpaces();
     const path = this.parseString();
     this.skipSpaces();
     let options = null;
     if (this.peek() === ",") {
      this.next();
      this.skipSpaces();
      options = this.parseBalanced();
     }
     this.skipSpaces();
     if (this.peek() === ")") {
      this.next();
     }
     // cerrar comentario multilinea
     this.skipSpaces();
     if (
      token.startsWith("/*") &&
      this.code.slice(this.i, this.i + 2) === "*/"
     ) {
      this.i += 2;
      Linter_bypassers: {
       if (this.code.slice(this.i, this.i + 1) === "0") {
        this.i += 1;
       }
       if (this.code.slice(this.i, this.i + 1) === "nulo") {
        this.i += 4;
       }
      }
     }
     const tokenEnd = this.i;
     const raw = this.code.slice(tokenStart, tokenEnd);
     const cleanStart = raw.replace(/^((\/\/)|(\/\*))( )*(\@)?/g, "");
     results.push({
      path,
      options,
      method: cleanStart.substr(0, cleanStart.indexOf("(")),
      start: tokenStart,
      end: tokenEnd,
      raw: raw,
     });
    }
    return results;
   }
   // =====================================================
   // TOKEN SEARCH
   // =====================================================
   findNextToken() {
    let bestIndex = Infinity;
    let bestToken = null;
    for (const token of this.constructor.TOKENS) {
     const idx = this.code.indexOf(token, this.i);
     if (idx !== -1 && idx < bestIndex) {
      bestIndex = idx;
      bestToken = token;
     }
    }
    if (bestToken === null) {
     return null;
    }
    return {
     token: bestToken,
     start: bestIndex
    };
   }
   // =====================================================
   // CORE
   // =====================================================
   eof() {
    return this.i >= this.code.length;
   }
   peek(offset = 0) {
    return this.code[this.i + offset];
   }
   next() {
    return this.code[this.i++];
   }
   skipSpaces() {
    while (
     !this.eof() &&
     /\s/.test(this.peek())
    ) {
     this.i++;
    }
   }
   // =====================================================
   // STRING
   // =====================================================
   parseString() {
    const quote = this.peek();
    if (
     quote !== '"' &&
     quote !== "'" &&
     quote !== "`"
    ) {
     throw new Error(`Expected string at ${this.i}`);
    }
    this.next();
    let result = "";
    while (!this.eof()) {
     const c = this.next();
     // escape
     if (c === "\\") {
      result += c;
      if (!this.eof()) {
       result += this.next();
      }
      continue;
     }
     // close
     if (c === quote) {
      return result;
     }
     result += c;
    }
    throw new Error("Unexpected EOF while parsing string");
   }
   // =====================================================
   // BALANCED
   // =====================================================
   parseBalanced() {
    const start = this.peek();
    if (!"([{".includes(start)) {
     throw new Error(`Expected balanced structure at ${this.i}`);
    }
    const stack = [start];
    let result = this.next();
    while (!this.eof()) {
     const c = this.next();
     result += c;
     // ==========================================
     // STRING MODE
     // ==========================================
     if (
      c === '"' ||
      c === "'" ||
      c === "`"
     ) {
      result += this.consumeString(c);
      continue;
     }
     // ==========================================
     // OPEN
     // ==========================================
     if (
      c === "(" ||
      c === "[" ||
      c === "{"
     ) {
      stack.push(c);
      continue;
     }
     // ==========================================
     // CLOSE
     // ==========================================
     if (
      c === ")" ||
      c === "]" ||
      c === "}"
     ) {
      const last =
       stack[stack.length - 1];
      if (!this.matches(last, c)) {
       throw new Error(`Unexpected closing token "${c}" at ${this.i}`);
      }
      stack.pop();
      if (stack.length === 0) {
       return result;
      }
     }
    }
    throw new Error("Unexpected EOF while parsing balanced structure");
   }
   consumeString(quote) {
    let result = "";
    while (!this.eof()) {
     const c = this.next();
     result += c;
     if (c === "\\") {
      if (!this.eof()) {
       result += this.next();
      }
      continue;
     }
     if (c === quote) {
      return result;
     }
    }
    throw new Error("Unexpected EOF inside string");
   }
   matches(open, close) {
    return (
     (open === "(" && close === ")") ||
     (open === "[" && close === "]") || (open === "{" && close === "}"));
   }
  };
  static create(...args) {
   return new this(...args);
  }
  constructor(...args) {
   this.isBrowser = typeof window !== "undefined";
   let input1 = null;
   let input2 = null;
   Step_1_Receive_arguments: {
    if (args.length === 0) {
     input1 = null;
     input2 = null;
    } else if (args.length === 1) {
     input1 = args[0] || null;
     input2 = null;
    } else if (args.length === 2) {
     input1 = args[0] || null;
     input2 = args[1];
    } else {
     throw new Error("on «ModulerV5.constructor»: parameter «arguments.length» must be between 0-2");
    }
   }
   let rootdir = null;
   let basedir = null;
   let definitions = null;
   let cloneRoot = null;
   Step_2_Fulfill_parameters: {
    if (input1 === null) {
     basedir = null;
     definitions = {};
    } else if (typeof input1 === "string") {
     basedir = input1;
     definitions = {};
    } else if (typeof input1 === "object" && input1 instanceof ModulerV5) {
     cloneRoot = input1;
     rootdir = input1.rootdir;
     basedir = input1.basedir;
     definitions = input1.definitions;
    } else {
     throw new Error("on «ModulerV5.constructor»: parameter «arguments[0]» must be undefined, string, null or instance of ModulerV5");
    }
    if (input2 === null) {
     // @OK: no extra file
    } else if (typeof input2 === "string") {
     this.assert(typeof input1 === "object" && input1 instanceof ModulerV5, "on «ModulerV5.constructor»: parameter «arguments[1]» can only be used when «arguments[0]» is instance of ModulerV5");
     basedir = input1.fullpathOf(input2);
    } else {
     throw new Error("on «ModulerV5.constructor»: parameter «arguments[1]» must be string, null or instance of ModulerV5");
    }
   }
   Step_3_Fix_default_values: {
    if (basedir === null) {
     if (this.isBrowser) {
      basedir = window.location.origin + window.location.pathname;
     } else {
      basedir = process.cwd();
     }
    }
   }
   Step_4_Validate_final_format: {
    this.assert(typeof basedir === "string", "on «ModulerV5.constructor»: variable «basedir» was not well formatted");
    this.assert(typeof definitions === "object", "on «ModulerV5.constructor»: variable «definitions» was not well formatted");
   }
   Step_5_Stablish_values: {
    this.rootdir = rootdir ?? basedir;
    this.basedir = basedir;
    this.definitions = definitions;
    this.css = cloneRoot ? cloneRoot.css : this.constructor.CssModuler.create(this);
   }
  }
  static inspectToString(args, debugLevel) {
   if (debugLevel === 0) return `${[...args].length} args`;
   if (debugLevel === 1) return `${[...args].map((it, i) => i + ":" + typeof it).join(",")} args`;
   if (debugLevel === 2) return `${[...args].map((it, i) => i + ":" + typeof it + this.stringify(it)).join(",")} args`;
  }
  static stringify(it) {
   try {
    return JSON.stringify(it);
   } catch (error) {
    return it;
   }
  }
  isTracing = false;
  trace(method, args = [], debugLevel = 0) {
   if (!this.isTracing) return;
   console.log(`[${method}] ${this.constructor.inspectToString(args, debugLevel)}`)
  }
  assert(condition, message) {
   this.trace("assert", arguments);
   if (!condition) throw new Error("AssertionError in ModulerV5: " + message);
  }
  normalizationOf = function(subpath, debug = false) {
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
   if (finalUrl.length !== 1) {
    finalUrl = finalUrl.replace(/\/$/g, "");
   }
   if (debug) {
    console.log(finalUrl);
   }
   return finalUrl;
  };
  fullpathOf(subpath) {
   this.trace("fullpathOf", arguments);
   return this.normalizationOf(subpath);
   return require("path").normalize(base);
   // return require("path").resolve(this.basedir, subpath);
  }
  relpathOf(subpath) {
   this.trace("relpathOf", arguments);
   if (this.isBrowser) {
    throw new Error("Must polyfill method «fullpathOf» to support browser environment");
   }
   return "@/" + this.fullpathOf(subpath).replace(this.rootdir, "").replace(/^\//g, "");
  }
  importModule(subpath, injection = {}) {
   this.trace("importModule", arguments);
   return this.readPath(subpath).then(source => {
    const asyncFunction = new(async function() {}).constructor(...Object.keys(injection), "module", "exports", "$dictionary", "__filename", "__dirname", source);
    this.trace("importModule::evaluating JS", [], 2);
    return this.callModuleFactory(Object.values(injection), asyncFunction, this.cloneForFile(subpath), subpath, this.normalizationOf(subpath + "/.."));
   });
  }
  readPath(file) {
   this.trace("readPath", arguments, 0);
   return this.isBrowser ? this.readUrl(file) : this.readFile(file);
  }
  readUrl(file) {
   this.trace("readUrl", arguments);
   return fetch(this.fullpathOf(file)).then(response => response.text());
  }
  readFile(file) {
   this.trace("readFile", arguments);
   return require("fs").promises.readFile(this.fullpathOf(file), "utf8");
  }
  knows(id) {
   this.trace("knows", arguments);
   // Comprueba si un id está en definitions
   Validate_parameters: {
    this.assert(typeof id === "string", "required «arguments[0]=id» as string to use «knows»");
   }
   Search_as_definition: {
    if (!(id in this.definitions)) {
     return false;
    }
    return true;
   }
  }
  define(...args) {
   this.trace("define", arguments);
   let dependencies = [];
   let factory = undefined;
   Validate_parameters: {
    if (args.length === 1) {
     this.assert(typeof args[0] === "function", `using define: if args.length is 1 then args[0] must be factory function but «${typeof args[0]}» was found instead on «ModulerV5.prototype.define»`);
     factory = args[0];
    } else if (args.length === 2) {
     this.assert(Array.isArray(args[0]), `using define: if args.length is 2 then args[0] must be array of dependencies but «${typeof args[0]}» was found instead on «ModulerV5.prototype.define»`);
     this.assert(typeof args[1] === "function", `using define: if args.length is 2 then args[1] must be factory function but «${typeof args[1]}» was found instead on «ModulerV5.prototype.define»`);
     dependencies = args[0];
     factory = args[1];
    } else {
     throw new Error(`current arguments.length «${args.length}» is not supported`);
    }
   }
   let dependencyPromises = undefined;
   Resolve_dependencies: {
    dependencyPromises = dependencies.map(dependency => this.mean(dependency));
   }
   Resolve_module: {
    return this.callModuleFactory(dependencyPromises, factory);
   }
  }
  mean(...args) {
   this.trace("mean", arguments);
   let id = undefined;
   let dependencies = [];
   let callback = undefined;
   Validate_and_format_parameters: {
    if (args.length === 1) {
     if (typeof args[0] === "function") {
      callback = args[0];
     } else if (Array.isArray(args[0])) {
      return Promise.all(args[0].map(dependency => this.mean(dependency)));
     } else {
      this.assert(typeof args[0] === "string", `using mean: if args.length is 1 then args[0] must be id string or factory function but «${typeof args[0]}» was found instead on «ModulerV5.prototype.mean»`);
      id = args[0];
     }
    } else if (args.length === 2) {
     this.assert(Array.isArray(args[0]), `using mean: if args.length is 2 then args[0] must be dependencies array but «${typeof args[0]}» was found instead on «ModulerV5.prototype.mean»`);
     this.assert(typeof args[1] === "function", `using mean: if args.length is 2 then args[1] must be factory function but «${typeof args[1]}» was found instead on «ModulerV5.prototype.mean»`);
     dependencies = args[0];
     callback = args[1];
    } else {
     throw new Error(`using mean: args.length must be between 1 and 2 but «${args.length}» was found instead on «ModulerV5.prototype.mean»`);
    }
   }
   if (typeof callback === "function") {
    Resolve_as_callback: {
     const dependencyPromises = dependencies.map(dependency => this.mean(dependency));
     return this.callModuleFactory(dependencyPromises, callback);
    }
   }
   else if (typeof id === "string") {
    Resolve_as_id: {
     id = this.fullpathOf(id);
     if (id in this.definitions) {
      return this.definitions[id];
     }
     return this.importModule(id);
    }
   }
   throw new Error("No, aquí no debería entrar, esta condición ya ha sido filtrada antes");
  }
  cloneForFile(file) {
   return ModulerV5.create(this, file + "/..");
  }
  cloneForDirectory(directory) {
   return ModulerV5.create(this, directory);
  }
  callModuleFactory(dependencyPromises, factory, submoduler = null, filename = null, dirname = null) {
   if (typeof filename === "string" && filename.endsWith(".css")) {
    return this.css.add(filename);
   }
   const initialState = {};
   const modulo = {
    exports: initialState
   };
   return Promise.all(dependencyPromises).then(async resolvedDependencies => {
    const output = await factory(...resolvedDependencies, modulo, modulo.exports, submoduler ?? this, filename, dirname);
    const returnsUndefined = typeof output === "undefined";
    const isNotInitialState = modulo.exports !== initialState;
    const hasNewProperties = 0 !== Object.keys(modulo.exports).length;
    return modulo.exports = (returnsUndefined && (isNotInitialState || hasNewProperties) ? modulo.exports : output);
   });
  }
 };

 ModulerV5.Dictionary = new ModulerV5();

 Promise.fromObject = function(obj) {
  const allKeys = Object.keys(obj);
  return Promise.all(Object.values(Object.values(obj))).then(output => {
   let toObject = {};
   for (let index = 0; index < output.length; index++) {
    const item = output[index];
    toObject[allKeys[index]] = item;
   }
   return toObject;
  })
 };

 return ModulerV5;

}.call());