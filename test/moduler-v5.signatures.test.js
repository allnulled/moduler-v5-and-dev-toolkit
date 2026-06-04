module.exports = async function ({ DevToolkit, devToolkit, ModulerV5, startTime, titleColumns }) {
  const { assert } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "ModulerV5/signatures".padEnd(titleColumns) });
  assert(1, "ModulerV5/signatures");
  const Dictionary = ModulerV5.create(devToolkit.fullpathOf("moduler-v5.test"));
  Imports_simples: {
    const lib1 = await Dictionary.mean("./lib1.js");
    assert(typeof lib1 === "object", "Can import object (point 1)");
    assert(lib1.a === 1, "Can import object (point 2)");
    assert(lib1.b === 2, "Can import object (point 3)");
    assert(lib1.c === 3, "Can import object (point 4)");
  }
  Todas_las_firmas: {
    // signa1.js: ⚫️ define(dependencies:Array, factory:Function)
    // signa2.js: ⚫️ define(factory:Function)
    // signa3.js: ⚫️ mean(dependencies:Array, factory:Function)
    // signa4.js: ⚫️ mean(dependencies:Array)
    // signa5.js: ⚫️ mean(path:String)
    // signa6.js: ⚫️ mean(factory:Function)
    const signatures = await Dictionary.mean("./signatures/test.js");
    assert(typeof signatures === "object", "Can import signatures test (point 1)");
    assert(signatures.signa1 === 2, "Can import using signature define(Array,Function) (point 2)");
    assert(signatures.signa2 === 50, "Can import using signature define(Function) (point 3)");
    assert(signatures.signa3 === 33, "Can import using signature mean(Array,Function) (point 4)");
    assert(Array.isArray(signatures.signa4), "Can import using signature mean(Array) (point 5)");
    assert(signatures.signa4.length === 2, "Can import using signature mean(Array) (point 6)");
    assert(signatures.signa4[0] === "part-1", "Can import using signature mean(Array) (point 7)");
    assert(signatures.signa4[1] === "part-2", "Can import using signature mean(Array) (point 8)");
    assert(signatures.signa5 === 44, "Can import using signature mean(String) (point 9)");
    assert(signatures.signa6 === 77, "Can import using signature mean(Function) (point 10)");
  }
  Firma_interna_de_factory_en_mean_Function: {
    await Dictionary.mean(function (module, exports, dictionary, __filename, __dirname) {
      assert(typeof module === "object", "Can find module as parameter from mean(Function) (point 2)");
      assert(typeof exports === "object", "Can find exports as parameter from mean(Function) (point 3)");
      assert(module.exports === exports, "Can find module and exports as parameters from mean(Function) (point 4)");
      assert(__filename === null, "Can find __filename as parameter from mean(Function) (point 5)");
      assert(__dirname === null, "Can find __dirname as parameter from mean(Function) (point 6)");
      assert(dictionary instanceof ModulerV5, "Can find local dictionary as parameter from mean(Function) (point 7)");
    })
  }
  Firma_interna_de_factory_en_define_Function: {
    await Dictionary.define(function (module, exports, dictionary, __filename, __dirname) {
      assert(typeof module === "object", "Can find module as parameter from define(Function) (point 2)");
      assert(typeof exports === "object", "Can find exports as parameter from define(Function) (point 3)");
      assert(module.exports === exports, "Can find module and exports as parameters from define(Function) (point 4)");
      assert(__filename === null, "Can find __filename as parameter from define(Function) (point 5)");
      assert(__dirname === null, "Can find __dirname as parameter from define(Function) (point 6)");
      assert(dictionary instanceof ModulerV5, "Can find local dictionary as parameter from define(Function) (point 7)");
    });
  }
  Firma_interna_de_factory_en_define_Array_Function: {
    await Dictionary.define([() => 800], function (p1, module, exports, dictionary, __filename, __dirname) {
      assert(p1 === 800, "Can find injected parameters from define(Array,Function) (point 1)");
      assert(typeof module === "object", "Can find module as parameter from define(Array,Function) (point 2)");
      assert(typeof exports === "object", "Can find exports as parameter from define(Array,Function) (point 3)");
      assert(module.exports === exports, "Can find module and exports as parameters from define(Array,Function) (point 4)");
      assert(__filename === null, "Can find __filename as parameter from define(Array,Function) (point 5)");
      assert(__dirname === null, "Can find __dirname as parameter from define(Array,Function) (point 6)");
      assert(dictionary instanceof ModulerV5, "Can find local dictionary as parameter from define(Array,Function) (point 7)");
    });
  }
};