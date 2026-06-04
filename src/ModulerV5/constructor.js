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
    if(input2 === null) {
      // @OK: no extra file
    } else if(typeof input2 === "string") {
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