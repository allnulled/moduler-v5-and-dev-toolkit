module.exports = async function ({ DevToolkit, devToolkit, ModulerV5, startTime, titleColumns }) {
  const { assert } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "ModulerV5/paths".padEnd(titleColumns) });
  assert(1, "ModulerV5/paths");
  const Dictionary = ModulerV5.create(devToolkit.fullpathOf("moduler-v5.test"));
  Normalizacion_de_rutas_y_urls: {
    const base = "https://888.99/zx2314/base/de/proyecto";
    const moduler = ModulerV5.create(base);
    const ejemplos = [
      ["path/normal.js", `${base}/path/normal.js`],
      ["@/path/relativo/al/rootdir.js", `${base}/path/relativo/al/rootdir.js`],
      ["/path/absoluto.js", "/path/absoluto.js"],
      ["./unpunto1.js", `${base}/unpunto1.js`],
      ["././././unpunto2.js", `${base}/unpunto2.js`],
      ["../../dospuntos1.js", "https://888.99/zx2314/base/dospuntos1.js"],
      ["../../../../dospuntos2.js", "https://888.99/dospuntos2.js"],
      ["../../../../../../dospuntos2.js", "https://dospuntos2.js"],
    ];
    for (let i = 0; i < ejemplos.length; i++) {
      const [ejemplo, expectativa] = ejemplos[i];
      const normalizado = moduler.normalizationOf(ejemplo);
      assert(normalizado === expectativa, "Can normalize urls and paths with example: " + ejemplo);
    }
  }
  Normalizacion_de_rutas_y_urls_en_moduladores_clonados: {
    const origin = "https://www.whatever.com/path/to/modules";
    const modulerParent = ModulerV5.create(origin);
    const moduler = modulerParent.cloneForFile("./submodules/n");
    const rootdir = moduler.rootdir;
    const basedir = moduler.basedir;
    const ejemplos = [
      ["path/normal.js", `${basedir}/path/normal.js`],
      ["@/path/relativo/al/rootdir.js", `${rootdir}/path/relativo/al/rootdir.js`],
      ["/path/absoluto.js", "/path/absoluto.js"],
      ["./unpunto1.js", `${basedir}/unpunto1.js`],
      ["././././unpunto2.js", `${basedir}/unpunto2.js`],
      ["../../dospuntos1.js", "https://www.whatever.com/path/to/dospuntos1.js"],
      ["../../../dospuntos2.js", "https://www.whatever.com/path/dospuntos2.js"],
      ["../../../../dospuntos2.js", "https://www.whatever.com/dospuntos2.js"],
      ["../../../../../dospuntos2.js", "https://dospuntos2.js"],
    ];
    for (let i = 0; i < ejemplos.length; i++) {
      const [ejemplo, expectativa] = ejemplos[i];
      const normalizado = moduler.normalizationOf(ejemplo);
      assert(normalizado === expectativa, "Can normalize urls and paths of cloned modulers with example: " + ejemplo);
    }
  }
  Uso_de_rutas_relativas_por_cloneFor: {
    const base = devToolkit.fullpathOf("moduler-v5.test/pathmodes");
    const moduler = ModulerV5.create(base);
    const modulerSub1 = moduler.cloneForFile("point0.1.js");
    const modulerSub2 = moduler.cloneForFile("demo1/part1/point1.1.js");
    const modulerSub3 = moduler.cloneForDirectory("demo1/part2");
    assert(modulerSub1.fullpathOf("point0.2.js") === devToolkit.fullpathOf("moduler-v5.test/pathmodes/point0.2.js"), "Can create modulers that change its basedir with cloneForFile (point 1)");
    assert(modulerSub2.fullpathOf("point1.2.js") === devToolkit.fullpathOf("moduler-v5.test/pathmodes/demo1/part1/point1.2.js"), "Can create modulers that change its basedir with cloneForFile (point 2)");
    assert(modulerSub3.fullpathOf("point2.2.js") === devToolkit.fullpathOf("moduler-v5.test/pathmodes/demo1/part2/point2.2.js"), "Can create modulers that change its basedir with cloneForDirectory (point 3)");
  }
  Uso_de_rutas_relativas_por_inyeccion_fantasma_$dictionary: {
    const base = devToolkit.fullpathOf("moduler-v5.test/pathmodes");
    const moduler = ModulerV5.create(base);
    const demo2 = await moduler.mean("demo2/index.js");
    assert(demo2.assertions.length === 3, "Can find returned assertions");
    assert(demo2.assertions[0][1] === true, demo2.assertions[0][0]);
    assert(demo2.assertions[1][1] === true, demo2.assertions[1][0]);
    assert(demo2.assertions[2][1] === true, demo2.assertions[2][0]);
  }
};