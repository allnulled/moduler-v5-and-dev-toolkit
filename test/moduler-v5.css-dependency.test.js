module.exports = async function ({ DevToolkit, devToolkit, ModulerV5, startTime, titleColumns }) {
  const { assert } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "ModulerV5/CssModuler/css-dependency".padEnd(titleColumns) });
  assert(1, "ModulerV5/CssModuler/css-dependency");
  const Dictionary = ModulerV5.create(devToolkit.fullpathOf("moduler-v5.test/css-dependency"));
  await Dictionary.css.add("./example.css");
  Css_usecase_1: {
    await Dictionary.mean("./main.css");
    const info = await Dictionary.css.synchronize();
    assert(info.counter === 2, "Can add css through mean(String) (point 1)");
  }
  Css_usecase_2: {
    await Dictionary.mean(["./usecase-2.css"], function(usecase2) {
      assert(typeof usecase2 === "object", "Can access css sheet (point 1)");
      assert(typeof usecase2.newSheets === "object", "Can access css sheet (point 2)");
      assert(typeof usecase2.oldSheets === "object", "Can access css sheet (point 3)");
      assert(typeof usecase2.count === "number", "Can access css sheet (point 4)");
    });
    const info = await Dictionary.css.synchronize();
    assert(info.counter === 4, "Can add css through mean(Array, Function) (point 1)");
  }
  Css_usecase_3: {
    await Dictionary.define(["./usecase-3.css"], function(usecase3) {
      assert(typeof usecase3 === "object", "Can access css sheet (point 1)");
      assert(typeof usecase3.newSheets === "object", "Can access css sheet (point 2)");
      assert(typeof usecase3.oldSheets === "object", "Can access css sheet (point 3)");
      assert(typeof usecase3.count === "number", "Can access css sheet (point 4)");
    });
    const info = await Dictionary.css.synchronize();
    assert(info.counter === 6, "Can add css through define(Array, Function) (point 1)");
  }
};