module.exports = async function ({ DevToolkit, devToolkit, ModulerV4, startTime, titleColumns }) {
  const { assert } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "ModulerV4".padEnd(titleColumns) });
  assert(1, "ModulerV4");
  const Dictionary = ModulerV4.create(devToolkit.basedir);
  Test_modules_by_factory: {
    Dictionary.define("module/1", () => 1);
    Dictionary.define("module/2", () => 2);
    Dictionary.define("module/3", () => 3);
    Dictionary.define("module/numbers", [
      "module/1",
      "module/2",
      "module/3",
    ], (module1, module2, module3) => {
      return { module1, module2, module3 };
    });
    const numbers = await Dictionary.mean("module/numbers");
    assert(typeof numbers === "object", "Can define modules by factory (point 1): finds numbers as object");
    assert(typeof numbers.module1 === "number", "Can define modules by factory (point 2): finds numbers.module1 as number");
    assert(typeof numbers.module2 === "number", "Can define modules by factory (point 3): finds numbers.module2 as number");
    assert(typeof numbers.module3 === "number", "Can define modules by factory (point 4): finds numbers.module3 as number");
  }
  Test_modules_by_promise: {
    Dictionary.define("promise/1", async () => {
      await DevToolkit.Time.timeout(0);
      return 1;
    });
    Dictionary.define("promise/2", async () => {
      await DevToolkit.Time.timeout(0);
      return 2;
    });
    Dictionary.define("promise/3", async () => {
      await DevToolkit.Time.timeout(0);
      return 3;
    });
    Dictionary.define("promise/numbers", [
      "promise/1",
      "promise/2",
      "promise/3"
    ], (promise1, promise2, promise3) => {
      return Promise.fromObject({ promise1, promise2, promise3 });
    });
    const numbers = await Dictionary.mean("promise/numbers");
    assert(typeof numbers === "object", "Can define modules by promise (point 1): finds numbers as object");
    assert(typeof numbers.promise1 === "number", "Can define modules by promise (point 2): finds numbers.promise1 as number");
    assert(typeof numbers.promise2 === "number", "Can define modules by promise (point 3): finds numbers.promise2 as number");
    assert(typeof numbers.promise3 === "number", "Can define modules by promise (point 4): finds numbers.promise3 as number");
  }
  Test_modules_by_static: {
    // Nótese que aquí no usamos el await,
    // porque sabemos que es una promesa
    // y que el mean anterior habría fallado de no tenerlo cargado,
    // y el mean lo encontrará en statics por ser promesa
    // y nos lo resolverá como valor directo:
    const numbers = Dictionary.mean("promise/numbers");
    assert(typeof numbers === "object", "Can define modules by static (point 1): finds numbers as object");
    assert(typeof numbers.promise1 === "number", "Can define modules by static (point 2): finds numbers.promise1 as number");
    assert(typeof numbers.promise2 === "number", "Can define modules by static (point 3): finds numbers.promise2 as number");
    assert(typeof numbers.promise3 === "number", "Can define modules by static (point 4): finds numbers.promise3 as number");
  }
  Test_module_is_known: {
    assert(Dictionary.knows("jQuery") === false, "Can accept not to know a module");
    assert(Dictionary.knows("promise/1") === true, "Can admit to know a module");
  }
};