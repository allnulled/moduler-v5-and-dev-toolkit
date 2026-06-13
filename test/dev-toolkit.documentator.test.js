module.exports = async function (...args) {
  const { DevToolkit, devToolkit, ModulerV5, startTime, titleColumns } = args[0];
  const { assert, assertDeepEqual } = DevToolkit.Testing.Asserter.createLoggerAssert({ startTime, prefix: "DevToolkit/documentator".padEnd(titleColumns) });
  assert(1, "DevToolkit/documentator");
  const docsJson = await devToolkit.documentator.extractJavadocCommentsFromDirectory();
  /*
  console.log(docsJson);
  for (let index = 0; index < docsJson.length; index++) {
    const doc = docsJson[index];
  }
  //*/
  const expectedJson = {
    "{@root}/devtoolkit-documentator.test/documentable-1.js": [
      {
        "@tipo": [
          "Class"
        ],
        "@descripción": [
          "Es una clase de ejemplo"
        ],
        "@sección": [
          "Tests/Documentación/Ejemplo/1/Example\n\n"
        ]
      },
      {
        "@tipo": [
          "Database"
        ],
        "@descripción": [
          "Es una clase que finge ser una base de datos"
        ],
        "@sección": [
          "Tests/Documentación/Ejemplo/1/Example/Database\n\n"
        ]
      },
      {
        "@parameter": [
          "table:String - Nombre de la tabla de la que se quieren extraer las filas.",
          "filter:Function - Función que se usa para filtrar los elementos de la tabla que quieren extraerse"
        ],
        "@returns": [
          "data:Array<Object> - Filas retornadas por la tabla y el filtro especificados. ",
          "data:Array<Object> - \nPero puedes poner mas",
          "data:Array<Object> - Filas retornadas por la tabla y el filtro especificados. \n"
        ]
      }
    ]
  };
  assertDeepEqual(docsJson, expectedJson, "can extract javadoc comments as expected");
  const docsText = await devToolkit.documentator.extractJavadocTextFromDirectory();
  await require("fs").promises.writeFile(`${__dirname}/unwatched/devtoolkit-documentator.test/documented-1.md`, docsText, "utf8");
  DevToolkit.Debug.die(0);
};