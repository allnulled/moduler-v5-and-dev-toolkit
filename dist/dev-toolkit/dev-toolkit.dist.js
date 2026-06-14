(function(mod) {
  if (typeof window !== 'undefined') window['DevToolkit'] = mod;
  if (typeof global !== 'undefined') global['DevToolkit'] = mod;
  if (typeof module !== 'undefined') module.exports = mod;
})(function() {
  /**
   * @name DevToolkit
   * @type class
   * @description Clase para las utilidades principales en el tiempo de desarrollo.
   */
  return class DevToolkit {
    /**
     * @name DevToolkit.create
     * @type static method
     * @arguments Los mismos que el DevToolkit.constructor
     * @description Método para fácil construcción del objeto.
     */
    static create(...args) {
      return new this(...args);
    }
    /**
     * @name DevToolkit.Tracer
     * @type class
     * @description Clase con utilidades para el traceo.
     */
    static Tracer = class Tracer {
      /**
       * @name DevToolkit.Tracer.createTracer
       * @type static method
       * @parameter prefix:String - Prefijo del traceador. Se refiere a la clase.
       * @parameter firstMessage:String|Boolean = false - Primer mensaje que quieres trazar ya al construir el traceador. Para no hacerlo en 2 llamadas.
       * @parameter isTracing:Boolean = true - Flag para activar o desactivar el traceador.
       * @returns Function<method:String,args:Arguments|Array>:void - Función que acepta 1 string y 1 array o 1 arguments, y imprime la traza. El segundo argumento será pasado a `inspectToString`.
       * @description Devuelve un traceador, que es una función que va imprimiendo las trazas que le dices. Esta función acepta 2 argumentos: el nombre del metodo en String, y los argumentos de la función traceada, en Array o Arguments.
       * @note Este método de traceo es muy precario ahora mismo, y no es para producción en ningún caso.
       */
      static createTracer(prefix, firstMessage = false, isTracing = true) {
        let callback = function(method, args = [], debugLevel = 0) {
          if (callback.isTracing === true) {
            console.log(DevToolkit.CommandLine.Colors.style("cyan").text(`[Trace:${prefix}.${method}]`) + ` ${Tracer.inspectToString(args, debugLevel)}`);
          }
          return callback;
        };
        callback.isTracing = isTracing;
        if (firstMessage) callback(firstMessage);
        return callback;
      }
      /**
       * @name DevToolkit.Tracer.inspectToString
       * @type static method
       * @parameter args:Array|Arguments - Típicamente, el `arguments` de la función que se está inspeccionando, pero cualquier array también valdría.
       * @parameter debugLevel:0|1|2 - Nivel de debug que quieres aplicar. El 1 solo dice cuantos argumentso, el 2 da los tipos, el 3 da el tipo y stringifica el valor.
       */
      static inspectToString(args, debugLevel = 0) {
        if (debugLevel === 0) return `${[...args].length} args`;
        if (debugLevel === 1) return `${[...args].map((it, i) => i + ":" + typeof it).join(",")} args`;
        if (debugLevel === 2) return `${[...args].map((it, i) => i + ":" + typeof it + this.stringify(it)).join(",")} args`;
      }
      /**
       * @name DevToolkit.Tracer.stringify
       * @type static method
       * @parameter it:any - Cosa que quieres stringificar.
       * @description Usa JSON.stringify para stringificar algo, o devuelve el algo tal cual.
       */
      static stringify(it) {
        try {
          return JSON.stringify(it);
        } catch (error) {
          return it;
        }
      }
    };
    /**
     * @name DevToolkit.Utils
     * @type class
     * @description Clase con utilidades que no encajan en otro dominio.
     */
    static Utils = class Utils {

    };
    /**
     * @name DevToolkit.Debug
     * @type class
     * @description Utilidades para el debugging de DevToolkit
     */
    static Debug = class Debug {
      /**
       * @name DevToolkit.Debug.die
       * @type class method
       * @parameters ...args:Array - Lo que se quiere imprimir por consola antes de interrumpir el proceso.
       * @description Sirve para interrumpir el proceso, sacando con console.log lo que quieras antes. Usa `process.exit(1)` para ello.
       */
      static die(...args) {
        console.log(...args);
        process.exit(1);
      }
    };
    /**
     * @name DevToolkit.Documentator
     * @type class 
     * @description Utilidades para documentación de DevToolkit
     */
    static Documentator = class Documentator {
      constructor(toolkit) {
        this.toolkit = toolkit;
      }
      /**
       * @name DevToolkit.Documentator.symbols
       * @type Object
       * @description Tiene varias expresiones regulares que interesan para capturar y limpiar los comentarios javadoc.
       */
      static symbols = {
        REGEX_JAVADOC_COMMENT: new RegExp("" +
          "(\\/\\*\\*)(\\n)" +
          "(" +
          "((?!(\\t| )*\\*\\/).)*" +
          "(\\n)" +
          ")*" +
          "((\\t| )*\\*\\/)", "g"
        ),
        REGEX_JAVADOC_LINE_START: new RegExp("^(\\t| )*\\*(\\t| )*", "g"),
        REGEX_JAVADOC_NEXT_LINES_START: new RegExp("(\n)(\\t| )*\\*(\\t| )*", "g"),
        REGEX_JAVADOC_BLOCK_START: new RegExp("^(\\/\\*\\*)(\\n)", "g"),
        REGEX_JAVADOC_BLOCK_END: new RegExp("((\\t| )*\\*\\/)$", "g"),
        REGEX_JAVADOC_TAG: new RegExp("^(\@((?! |\\:).)+)", "g"),
      }
      /**
       * @name DevToolkit.Documentator.prototype._findFiles
       * @type private class method
       * @parameter globPattern:String - Patrón glob para encontrar los ficheros que contienen comentarios javadoc.
       * @parameter options:Object - Opciones pasadas a la llamada de la librería [`glob`](https://www.npmjs.com/package/glob). Algunas opciones están ya prefijadas por el método:
       *   - cwd: `this.toolkit.basedir` (este sí puede sobreescribir)
       *   - absolute: `true`
       *   - ignore: `node_modules` (este puede extenderse, pero no sobreescribirse)
       * @returns `Promise<Array<String>>` - Es una llamada asíncrona, así que devuelve una promesa, con la lista de ficheros encontrados.
       */
      _findFiles(globPattern = "**/*.js", options = {}) {
        return require("glob").glob(globPattern, {
          // 1. Changeable options:
          cwd: this.toolkit.basedir,
          // 2. User options:
          ...options,
          // 3. Fixed options:
          absolute: true,
          ignore: [
            "node_modules",
            ...(typeof options.ignore === "undefined" ? [] : options.ignore),
          ],
        });
      }
      /**
       * @name DevToolkit.Documentator.prototype._extractJavadocCommentsFromString
       * @type private class method
       * @parameter text:String - Texto que puede contener comentarios javadoc. 
       * @returns `Array<Object>`- Lista de comentarios javadoc, representados por objetos.
       * @description Método que devuelve los comentarios javadoc encontrados en un string.
       */
      _extractJavadocCommentsFromString(text) {
        const matches = text.match(this.constructor.symbols.REGEX_JAVADOC_COMMENT);
        if (!matches) return [];
        const javadocComments = [];
        for (let index = 0; index < matches.length; index++) {
          const matchedComment = matches[index];
          let matchedContent = matchedComment;
          Eliminar_los_asteriscos_necesarios_y_espacios_implicados: {
            matchedContent = matchedContent.replace(this.constructor.symbols.REGEX_JAVADOC_BLOCK_START, "");
            matchedContent = matchedContent.replace(this.constructor.symbols.REGEX_JAVADOC_BLOCK_END, "");
            matchedContent = matchedContent.replace(this.constructor.symbols.REGEX_JAVADOC_LINE_START, "");
            matchedContent = matchedContent.replace(this.constructor.symbols.REGEX_JAVADOC_NEXT_LINES_START, "\n");
          }
          const javadocComment = {
            "<notag>": []
          };
          const matchedLines = matchedContent.split("\n");
          let currentTag = "<notag>";
          Rejuntar_por_lineas:
            for (let index = 0; index < matchedLines.length; index++) {
              let matchedLine = matchedLines[index];
              let isNewTag = false;
              if (matchedLine.startsWith("@")) {
                isNewTag = true;
                matchedLine = matchedLine.replace(this.constructor.symbols.REGEX_JAVADOC_TAG, match => {
                  currentTag = match;
                  return "";
                }).trimLeft();
              }
              if (!(currentTag in javadocComment)) {
                javadocComment[currentTag] = [];
              }
              if (isNewTag) {
                javadocComment[currentTag].push(matchedLine);
              } else {
                javadocComment[currentTag][javadocComment[currentTag].length - 1] += "\n" + matchedLine;
              }
            }
          if (!javadocComment["<notag>"].length) {
            delete javadocComment["<notag>"];
          }
          javadocComments.push(javadocComment);
        }
        return javadocComments;
      }
      /**
       * @name DevToolkit.Documentator.prototype.extractJavadocCommentsFromDirectory
       * @type class method
       * @parameter dir:String - Directorio del cual que quieren extraer los comentarios. Se entiende que solo son ficheros `.js`. Ahora mismo esto no se puede cambiar, pero puede que se cambie más adelante. Por defecto usa el `this.toolkit.basedir`.
       * @returns `Promise<Object>` - Objeto con los nombres de ficheros (relativos, empiezan con `{@root}/`) y los comentarios javadoc encontrados en cada uno.
       * @description Extrae todos los comentarios javadoc encontrados en ficheros js de un directorio dado.
       */
      async extractJavadocCommentsFromDirectory(dir = this.toolkit.basedir) {
        const inputFiles = await this._findFiles(require("path").resolve(dir, "**/*.js"));
        const allJavadocComments = {};
        for (let index = 0; index < inputFiles.length; index++) {
          const file = inputFiles[index];
          const content = await require("fs").promises.readFile(file, "utf8");
          const comments = this._extractJavadocCommentsFromString(content);
          if (comments.length) {
            allJavadocComments[file.replace(this.toolkit.basedir + "/", "{@root}/")] = comments;
          }
        }
        return allJavadocComments;
      }
      /**
       * @name DevToolkit.Documentator.prototype.extractJavadocTextFromDirectory
       * @type class method
       * @parameter dir:String - Directorio del cual se quieren extraer los comentarios javadoc.
       * @parameter options:Object - Opciones. Actualmente no tiene uso. Por defecto, un objeto vacío.
       * @returns `Promise<String>` - Texto compuesto por todos los comentarios javadoc encontrados.
       * @description Devuelve el texto de todos los comentarios javadoc encontrador bajo un directorio. Utiliza `this.extractJavadocCommentsFromDirectory` por dentro.
       */
      async extractJavadocTextFromDirectory(dir = this.toolkit.basedir, options = {}) {
        const allJavadocCommentsPerFile = await this.extractJavadocCommentsFromDirectory(dir);
        let outputMd = "";
        for (let file in allJavadocCommentsPerFile) {
          outputMd += `----\n\n**${file}**\n\n`;
          const commentsInFile = allJavadocCommentsPerFile[file];
          for (let indexComment = 0; indexComment < commentsInFile.length; indexComment++) {
            outputMd += `----\n\n`;
            const comment = commentsInFile[indexComment];
            for (let tagName in comment) {
              outputMd += `- **${tagName}:**`;
              const tagUnits = comment[tagName];
              if (tagUnits.length === 0) {
                outputMd += "\n";
              } else if (tagUnits.length === 1) {
                outputMd += ` ${tagUnits[0]}\n`;
              } else {
                for (let indexTagUnit = 0; indexTagUnit < tagUnits.length; indexTagUnit++) {
                  const tagUnit = tagUnits[indexTagUnit];
                  outputMd += `\n   - ${tagUnit.trim().replace(/(\r?\n)+/g, "\n      - ")}`;
                }
                outputMd += `\n`;
              }
            }
          }
        }
        return outputMd;
      }
    };
    /**
     * @name DevToolkit.CommandLine
     * @type class
     * @description Clase con utilidades para la interfaz de línea de comandos de DevToolkit
     */
    static CommandLine = class CommandLine {
      /**
       * @name DevToolkit.CommandLine.Colors
       * @type class
       * @description Clase con utilidades para pintar colores por consola, tablas, cajas, y cosas así. Esta clase se saca de `require(__dirname + "/refrescador.api.dist.js").colors`. Por lo cual, se sobreentiende que `dev-toolkit.dist.js` tiene que estar acompañado de este fichero.
       */
      static Colors = require(__dirname + "/refrescador.api.dist.js").colors;
      /**
       * @name DevToolkit.CommandLine.printError
       * @parameter error:Error - Instancia de la clase Error que se quiere imprimir.
       * @description Imprime un error pero bonitamente, con colores.
       */
      static printError(error) {
        console.log(DevToolkit.CommandLine.Colors.style("redBright,bold").text(DevToolkit.CommandLine.Colors.box(`${error.name}: ${error.message}`)), "\n", error);
      };
      /**
       * @name DevToolkit.CommandLine.constructor
       * @type class constructor
       * @parameter toolkit:DevToolkit - Instancia de DevToolkit para esta clase.
       * @sets this.toolkit a partir del parámetro proporcionado.
       * @description Construye la instancia de DevToolkit.CommandLine
       */
      constructor(toolkit) {
        this.toolkit = toolkit;
      };
      /**
       * @name DevToolkit.CommandLine.baseProject
       * @type Object
       * @description Este objeto contiene el esqueleto de un proyecto nuevo que utilizará `DevToolkit` y `ModulerV5`. Tiene la estructura de carpetas y ficheros con su contenido necesarios para ello.
       */
      static baseProject = {
        ".gitignore": "node_modules",
        "TODO.md": "🟢🟡⛔️\n\n🟡 Todos los comandos iniciales de la API de CommandLine con tests en v4:\n  🟡 build js\n    🟡 con tree propagation: espera que sea o busca arriba un .entry.js\n    🟡 fabrica el dist si es .entry.js\n    🟡 fabrica el test/unit si es .entry.js\n    🟡 llama al onTouch.js si lo hay\n      🟡 devuelve un objeto, no un callback solamente\n    🟡 y aquí vuelve a empezar\n  🟡 build css\n    🟡 con tree propagation: busca arriba un .entry.css\n    🟡 con match en onTouch.js\n  🟡 build ts ya lo haremos, ahora no\n  🟡 build doc próximamente\n  🟡 test js\n    🟡 carga el fichero y llama a la función\n  🟡 loop\n    🟡 empieza el desarrollo\n  🟡 export\n    🟡 customizable, no hace nada en principio",
        "dev": {
          "cli": {
            "api.js": "const Toolkit = require(__dirname + \"/../../src/lib/dev-toolkit/dev-toolkit.dist.js\");\nconst toolkit = new Toolkit(__dirname + \"/../..\");\n\nconst dev = {\n  Toolkit: Toolkit,\n  toolkit: toolkit,\n  cli: toolkit.cli,\n  // Add other dev tools you wanna use globally in cli commands\n};\n\nmodule.exports = global.dev = dev;",
            "bin.js": "#!/usr/bin/env node\n\nconsole.log(process.argv);\nmodule.exports = require(__dirname + \"/api.js\").cli.tool(process.argv);",
            "dispatcher.js": "#!/usr/bin/env node\n\nmodule.exports = function (...args) {\n  return require(__dirname + \"/api.js\").cli.tool(args);\n};",
            "tool": {
              "build": {
                "css": {
                  "build.css.js": ""
                },
                "doc": {
                  "build.doc.js": ""
                },
                "js": {
                  "build.js.js": ""
                },
                "ts": {
                  "build.ts.js": ""
                }
              },
              "export": {
                "export-as-callback.js": "module.exports = async function (file) {\n  const fs = require(\"fs\");\n  console.log(file);\n  const path = require(\"path\");\n  const rootDir = path.resolve(`${__dirname}/../../../..`);\n  const outputDir = path.resolve(`${__dirname}/../../../../../moduler-v5-and-dev-toolkit/src/DevToolkit/CommandLine/blank-project`);\n  const contents = await fs.promises.readdir(outputDir);\n  const isDir = () => fs.promises.lstat(outputDir).then(lstat => lstat.isDirectory()).catch(error => false);\n  const assert = (condition, message) => { if (!condition) throw new Error(message); };\n  assert(await isDir(outputDir), `Could not find output directory: ${outputDir}`);\n  assert(await isDir(rootDir), `Could not find root directory: ${rootDir}`);\n  const fromDirectoryToObject = async function (dir, options = {}) {\n    const entries = await fs.promises.readdir(dir, {\n      withFileTypes: true\n    });\n    const result = {};\n    Iterating_entries:\n    for (const entry of entries) {\n      const fullPath = path.join(dir, entry.name);\n      if (typeof options.filter === \"function\") {\n        if (!options.filter(fullPath, entry)) {\n          continue Iterating_entries;\n        }\n      }\n      if (entry.isDirectory()) {\n        result[entry.name] = await fromDirectoryToObject(fullPath, options);\n      } else {\n        result[entry.name] = await fs.promises.readFile(fullPath, \"utf8\");\n      }\n    }\n    return result;\n  };\n  const summary = await fromDirectoryToObject(rootDir, {\n    filter(file, lstat) {\n      return !file.includes(\"node_modules\") && !file.includes(\"dev-toolkit.dist.js\") && !file.includes(\"package-lock.json\");\n    }\n  });\n  console.log(summary);\n  // summary[\"src\"][\"lib\"][\"dev-toolkit\"][\"dev-toolkit.dist.js\"] = await fs.promises.readFile(`${rootDir}/src/lib/dev-toolkit/dev-toolkit.dist.js`, \"utf8\");\n  await fs.promises.writeFile(path.resolve(outputDir, \"blank-project.json\"), JSON.stringify(summary, null, 2), \"utf8\");\n  \n};",
                "export.js": ""
              },
              "loop": {
                "help.txt": "",
                "loop.js": ""
              },
              "test": {},
              "touch": {
                "help.txt": "",
                "touch.js": "module.exports = async function() {\n  await require(\"timers/promises\").setTimeout(100);\n  return 300;\n}"
              }
            }
          },
          "loop.js": "const dev = require(__dirname + \"/cli/api.js\");\n\nprocess.chdir(__dirname + \"/..\");\n\ndev.Toolkit.FileWatcher.Refrescador.run({\n  port: 3008,\n  message: \"OKKKK\",\n  watch: [__dirname + \"/..\"],\n  ignore: [],\n  extensions: [\n    \"js\",\n    \"css\",\n    \"html\",\n    \"sh\",\n    \"json\",\n    \"md\",\n  ],\n  executeCallback: [\n    \"dev/cli/api.js\", // Cargamos el «dev» global\n    // Aquí compilaríamos con el touch\n    \"!test/driven/current.js\", // Ejecutamos el test actual\n    \"!dev/cli/tool/export/export-as-callback.js\", // Exportamos\n  ]\n});",
          "settings": {
            "builder.js": "",
            "environment.js": ""
          }
        },
        "dist": {},
        "guides": {},
        "package.json": "{\n  \"name\": \"moduler-v5-and-dev-toolkit-starter\",\n  \"version\": \"1.0.0\",\n  \"main\": \"index.js\",\n  \"directories\": {\n    \"test\": \"test\"\n  },\n  \"scripts\": {\n    \"dev\": \"node dev/loop.js\",\n    \"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"\n  },\n  \"keywords\": [],\n  \"author\": \"allnulled\",\n  \"license\": \"WTFPL\",\n  \"description\": \"\",\n  \"devDependencies\": {\n    \"chokidar\": \"^5.0.0\",\n    \"ejs\": \"^6.0.1\",\n    \"express\": \"^5.2.1\",\n    \"js-beautify\": \"^1.15.4\",\n    \"picomatch\": \"^4.0.4\",\n    \"socket.io\": \"^4.8.3\"\n  }\n}\n",
        "src": {
          "lib": {
            "dev-toolkit": {
              "dev.bin.js": "",
              "index.ejs.html": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Test de refrescador</title>\n</head>\n<body>\n    <script src=\"http://127.0.0.1:3003<%-config.urlPrefix ? config.urlPrefix : \"\"%>/socket.io-client.js\"></script>\n    <script src=\"http://127.0.0.1:3003<%-config.urlPrefix ? config.urlPrefix : \"\"%>/client.js\"></script>\n    <div>Si has iniciado este fichero con <b>npm test</b> entonces...</div>\n    <div>Si escribes y guardas en un fichero del proyecto, esta pantalla debería refrescarse automáticamente.</div>\n    <div>Va rápido!</div>\n</body>\n</html>",
              "refrescador.api.dist.js": "var __create = Object.create;\nvar __defProp = Object.defineProperty;\nvar __getOwnPropDesc = Object.getOwnPropertyDescriptor;\nvar __getOwnPropNames = Object.getOwnPropertyNames;\nvar __getProtoOf = Object.getPrototypeOf;\nvar __hasOwnProp = Object.prototype.hasOwnProperty;\nvar __commonJS = (cb, mod) => function __require() {\n  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;\n};\nvar __copyProps = (to, from, except, desc) => {\n  if (from && typeof from === \"object\" || typeof from === \"function\") {\n    for (let key of __getOwnPropNames(from))\n      if (!__hasOwnProp.call(to, key) && key !== except)\n        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });\n  }\n  return to;\n};\nvar __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(\n  // If the importer is in node compatibility mode or this is not an ESM\n  // file that has been converted to a CommonJS file using a Babel-\n  // compatible transform (i.e. \"__esModule\" has not been set), then set\n  // \"default\" to the CommonJS \"module.exports\" for node compatibility.\n  isNodeMode || !mod || !mod.__esModule ? __defProp(target, \"default\", { value: mod, enumerable: true }) : target,\n  mod\n));\n\n// lib/colors.js\nvar require_colors = __commonJS({\n  \"lib/colors.js\"(exports2, module2) {\n    module2.exports = Object.assign({\n      available: {\n        // estilos\n        bold: [1, 22],\n        italic: [3, 23],\n        underline: [4, 24],\n        blink: [5, 25],\n        inverse: [7, 27],\n        strike: [9, 29],\n        // colores\n        black: [30, 39],\n        red: [31, 39],\n        green: [32, 39],\n        yellow: [33, 39],\n        blue: [34, 39],\n        magenta: [35, 39],\n        cyan: [36, 39],\n        white: [37, 39],\n        // fondo\n        bgBlack: [40, 49],\n        bgRed: [41, 49],\n        bgGreen: [42, 49],\n        bgYellow: [43, 49],\n        bgBlue: [44, 49],\n        bgMagenta: [45, 49],\n        bgCyan: [46, 49],\n        bgWhite: [47, 49],\n        // brillantes\n        blackBright: [90, 39],\n        redBright: [91, 39],\n        greenBright: [92, 39],\n        yellowBright: [93, 39],\n        blueBright: [94, 39],\n        magentaBright: [95, 39],\n        cyanBright: [96, 39],\n        whiteBright: [97, 39],\n        bgBlackBright: [100, 49],\n        bgRedBright: [101, 49],\n        bgGreenBright: [102, 49],\n        bgYellowBright: [103, 49],\n        bgBlueBright: [104, 49],\n        bgMagentaBright: [105, 49],\n        bgCyanBright: [106, 49],\n        bgWhiteBright: [107, 49]\n      },\n      endToken: \"\\x1B[0m\",\n      squad: {\n        tl: \"\\u250C\",\n        tr: \"\\u2510\",\n        bl: \"\\u2514\",\n        br: \"\\u2518\"\n      },\n      line: {\n        h: \"\\u2500\",\n        v: \"\\u2502\"\n      },\n      style: function(config = \"red,bold,underline\") {\n        const styles = config.split(\",\");\n        return {\n          text: (text) => {\n            const begin = styles.reduce((out, it) => {\n              if (!(it in this.available)) {\n                return out;\n              }\n              const code = this.available[it];\n              out += `\\x1B[${code[0]}m`;\n              return out;\n            }, \"\");\n            const end = this.endToken;\n            return `${begin}${text}${end}`;\n          },\n          print(text) {\n            console.log(this.text(text));\n          }\n        };\n      },\n      stripAnsi: function(str) {\n        return str.replace(/\\x1b\\[[0-9;]*m/g, \"\");\n      },\n      wrapAnsi: function(str, maxWidth) {\n        return require(\"wrap-ansi\").default(str, maxWidth, {\n          hard: true\n        });\n      },\n      box: function(text, maxWidth = 110) {\n        const lines = this.wrapAnsi(text, maxWidth).split(\"\\n\");\n        const cleanLines = lines.map((l) => this.stripAnsi(l));\n        const width = Math.max(...cleanLines.map((l) => l.length));\n        const top = \"\\u250C\" + \"\\u2500\".repeat(width + 2) + \"\\u2510\";\n        const bottom = \"\\u2514\" + \"\\u2500\".repeat(width + 2) + \"\\u2518\";\n        const body = lines.map((line) => {\n          const clean = this.stripAnsi(line);\n          const pad = width - clean.length;\n          return \"\\u2502 \" + line + \" \".repeat(pad) + \" \\u2502\";\n        }).join(\"\\n\");\n        return `${top}\n${body}\n${bottom}`;\n      }\n    }, {\n      table: function table(listOfColumns, options = {}) {\n        const Table = require(\"cli-table3\");\n        const table2 = new Table(options);\n        table2.push(...listOfColumns);\n        return table2.toString();\n      },\n      borderlessTable: function borderlessTable(listOfColumns, optionsObject = {}) {\n        return this.alignTable(listOfColumns, 2, optionsObject);\n      },\n      visibleLength(str) {\n        return require(\"strip-ansi\").default(str).length;\n      },\n      alignTable(rows, gap = 2, max = {}) {\n        for (let indexRow = 0; indexRow < rows.length; indexRow++) {\n          const row = rows[indexRow];\n          for (let indexCol = 0; indexCol < row.length; indexCol++) {\n            const cell = row[indexCol];\n            const cellLen = this.visibleLength(cell);\n            if (!(indexCol in max)) {\n              max[indexCol] = 5;\n            }\n            if (max[indexCol] < cellLen) {\n              max[indexCol] = cellLen;\n            }\n          }\n        }\n        let out = \"\";\n        for (let indexRow = 0; indexRow < rows.length; indexRow++) {\n          const row = rows[indexRow];\n          for (let indexCol = 0; indexCol < row.length; indexCol++) {\n            const cell = row[indexCol];\n            const currCellLen = this.visibleLength(cell);\n            const cellLen = max[indexCol];\n            const col = cell + \" \".repeat(cellLen - currCellLen);\n            if (indexCol !== 0) {\n              out += \" \\u2502 \";\n            }\n            out += col;\n          }\n          out += \"\\n\";\n        }\n        return out.trimEnd();\n      },\n      padLinesToMax: function padLinesToMax(text) {\n        const lines = text.split(\"\\n\");\n        let out = \"\";\n        let max = 0;\n        for (let index = 0; index < lines.length; index++) {\n          const line = lines[index];\n          if (max < line.length) {\n            max = line.length;\n          }\n        }\n        for (let index = 0; index < lines.length; index++) {\n          const line = lines[index];\n          const padded = line.padEnd(max, \" \");\n          if (index !== 0) out += \"\\n\";\n          out += padded;\n        }\n        return out;\n      }\n    });\n  }\n});\n\n// lib/from-condition-to-error.js\nvar require_from_condition_to_error = __commonJS({\n  \"lib/from-condition-to-error.js\"(exports2, module2) {\n    module2.exports = function(condition, message) {\n      if (!condition) throw new Error(message);\n    };\n  }\n});\n\n// lib/trace.js\nvar require_trace = __commonJS({\n  \"lib/trace.js\"(exports2, module2) {\n    var trace = true;\n    module2.exports = function(name, args = false) {\n      if (trace) {\n        console.log(\"[trace][refrescador][\" + name + \"]\", !args ? \"-\" : Array.from(args).reduce((out, arg, index) => {\n          return Object.assign(out, { [index]: arg });\n        }, {}));\n      }\n    };\n  }\n});\n\n// lib/from-kebab-case-to-camel-case.js\nvar require_from_kebab_case_to_camel_case = __commonJS({\n  \"lib/from-kebab-case-to-camel-case.js\"(exports2, module2) {\n    module2.exports = function(text) {\n      return text.replace(/\\-./g, (match) => match.substr(1).toUpperCase());\n    };\n  }\n});\n\n// lib/from-cli-args-to-map.js\nvar require_from_cli_args_to_map = __commonJS({\n  \"lib/from-cli-args-to-map.js\"(exports2, module2) {\n    var typeFormatters = {\n      [Number]: function(val) {\n        return !Array.isArray(val) ? val : Number(val[val.length - 1]);\n      },\n      [String]: function(val) {\n        return !Array.isArray(val) ? val : val[val.length - 1];\n      },\n      [Array]: function(val) {\n        return val;\n      },\n      [Boolean]: function(val) {\n        if (Array.isArray(val)) {\n          val = val[val.length - 1];\n        }\n        return val !== false && val !== \"false\";\n      }\n    };\n    var trace = require_trace();\n    var assertion = require_from_condition_to_error();\n    var fromKebabCaseToCamelCase = require_from_kebab_case_to_camel_case();\n    module2.exports = function(configurations = {}, args = process.argv.slice(2)) {\n      const output = {};\n      let current = \"_\";\n      const aliases = {};\n      const arePositionalsForbidden = \"_\" in configurations && configurations._ === false;\n      delete configurations._;\n      assertion(Array.isArray(args), \"Parameter \\xABargs\\xBB must be array on \\xABfrom-cli-args-to-map\\xBB\");\n      for (const settingId in configurations) {\n        const setting = configurations[settingId];\n        const aliasOriginal = setting.alias || [];\n        const alias = Array.isArray(aliasOriginal) ? aliasOriginal : [aliasOriginal];\n        for (let indexAlias = 0; indexAlias < alias.length; indexAlias++) {\n          const possibleAlias = alias[indexAlias];\n          aliases[possibleAlias] = settingId;\n        }\n      }\n      let counter = 0;\n      for (const arg of args) {\n        counter++;\n        if (arg.startsWith(\"--\")) {\n          const id = fromKebabCaseToCamelCase(arg.substring(2));\n          if (!output[id]) {\n            output[id] = [];\n          }\n          current = id;\n        } else if (arg.startsWith(\"-\")) {\n          const alias = fromKebabCaseToCamelCase(arg.substring(1));\n          if (!(alias in aliases)) {\n            throw new Error(`Argument \\xAB${arg}\\xBB at position \\xAB${counter}\\xBB refers to a non-existing alias, valid alias are only \\xAB${Object.keys(aliases).map((alias2) => alias2 + \"=\" + aliases[alias2]).join(\"\\xBB, \\xAB\")}\\xBB`);\n          }\n          const id = aliases[alias];\n          if (!output[id]) {\n            output[id] = [];\n          }\n          current = id;\n        } else {\n          if (!output[current]) {\n            output[current] = [];\n          }\n          output[current].push(arg);\n        }\n      }\n      for (const settingId in configurations) {\n        const setting = configurations[settingId];\n        if (!(settingId in output)) {\n          if (\"default\" in setting) {\n            output[settingId] = setting.default;\n          }\n        }\n        if (\"type\" in setting) {\n          if (!(setting.type in typeFormatters)) {\n            throw new Error(`Property \\xABtype\\xBB can only be class \\xABString\\xBB, \\xABNumber\\xBB, \\xABBoolean\\xBB or \\xABArray\\xBB but type of \\xAB${typeof setting.type}\\xBB was found instead`);\n          }\n          const result = typeFormatters[setting.type](output[settingId]);\n          output[settingId] = result;\n        }\n        if (\"format\" in setting) {\n          const result = setting.format(output[settingId]);\n          output[settingId] = result;\n        }\n      }\n      if (arePositionalsForbidden) {\n        if (output._ && output._.length) {\n          throw new Error(`Positional parameters are forbidden but \\xAB${output._.length}\\xBB positional arguments(s) were found instead with \\xAB${output._.join(\"\\xBB, \\xAB\")}\\xBB`);\n        }\n        delete output._;\n      }\n      return output;\n    };\n  }\n});\n\n// lib/from-schema-to-type-assertions.js\nvar require_from_schema_to_type_assertions = __commonJS({\n  \"lib/from-schema-to-type-assertions.js\"(exports2, module2) {\n    module2.exports = function(data, schema) {\n      if (typeof data !== \"object\") {\n        throw new Error(\"Parameter \\xABdata\\xBB must be object on \\xABfrom-schema-to-type-assertion\\xBB\");\n      }\n      if (typeof schema !== \"object\") {\n        throw new Error(\"Parameter \\xABschema\\xBB must be object on \\xABfrom-schema-to-type-assertion\\xBB\");\n      }\n      const dataKeys = Object.keys(data);\n      const schemaKeys = Object.keys(schema);\n      for (let index = 0; index < dataKeys.length; index++) {\n        const dataKey = dataKeys[index];\n        if (schemaKeys.indexOf(dataKey) === -1) {\n          throw new Error(`Property \\xAB${dataKey}\\xBB is not accepted and it can only be one out of \\xAB${schemaKeys.join(\"|\")}\\xBB on \\xABfrom-schema-to-type-assertions\\xBB`);\n        }\n      }\n      for (let index = 0; index < schemaKeys.length; index++) {\n        const schemaKey = schemaKeys[index];\n        const schemaValue = schema[schemaKey];\n        const schemaType = schemaValue.type;\n        const hasDefault = \"default\" in schemaValue;\n        const hasKey = schemaKey in data;\n        if (!hasDefault && !hasKey) {\n          throw new Error(`Property \\xAB${schemaKey}\\xBB must be explicitly set or provided with \\xABdefault\\xBB on \\xABfrom-schema-to-type-assertions\\xBB`);\n        }\n        const dataValue = hasKey ? data[schemaKey] : typeof schemaValue.default === \"function\" && schemaType !== Function ? schemaValue.default(data) : schemaValue.default;\n        if (schemaType === Array) {\n          if (!Array.isArray(dataValue)) {\n            throw new Error(`Property \\xAB${schemaKey}\\xBB must be array but \\xAB${typeof dataValue}\\xBB was found instead on \\xABfrom-schema-to-type-assertions\\xBB`);\n          }\n        } else if (schemaType === String) {\n          if (typeof dataValue !== \"string\") {\n            throw new Error(`Property \\xAB${schemaKey}\\xBB must be string but \\xAB${typeof dataValue}\\xBB was found instead on \\xABfrom-schema-to-type-assertions\\xBB`);\n          }\n        } else if (schemaType === Boolean) {\n          if (typeof dataValue !== \"boolean\") {\n            throw new Error(`Property \\xAB${schemaKey}\\xBB must be boolean but \\xAB${typeof dataValue}\\xBB was found instead on \\xABfrom-schema-to-type-assertions\\xBB`);\n          }\n        } else if (schemaType === Object) {\n          if (typeof dataValue !== \"object\") {\n            throw new Error(`Property \\xAB${schemaKey}\\xBB must be object but \\xAB${typeof dataValue}\\xBB was found instead on \\xABfrom-schema-to-type-assertions\\xBB`);\n          }\n        } else if (schemaType === Number) {\n          if (typeof dataValue !== \"number\") {\n            throw new Error(`Property \\xAB${schemaKey}\\xBB must be number but \\xAB${typeof dataValue}\\xBB was found instead on \\xABfrom-schema-to-type-assertions\\xBB`);\n          }\n        } else if (typeof schemaType === \"function\") {\n          if (dataValue instanceof schemaType) {\n            throw new Error(`Property \\xAB${schemaKey}\\xBB must be instance of \\xAB${schemaType.name}\\xBB but \\xAB${typeof dataValue}\\xBB was found instead on \\xABfrom-schema-to-type-assertions\\xBB`);\n          }\n        } else if (schemaType === Function) {\n          if (typeof dataValue !== \"function\") {\n            throw new Error(`Property \\xAB${schemaKey}\\xBB must be function but \\xAB${typeof dataValue}\\xBB was found instead on \\xABfrom-schema-to-type-assertions\\xBB`);\n          }\n        }\n      }\n    };\n  }\n});\n\n// lib/from-glob-watcher-to-socketio-emit.js\nvar require_from_glob_watcher_to_socketio_emit = __commonJS({\n  \"lib/from-glob-watcher-to-socketio-emit.js\"(exports2, module2) {\n    var defaultConfig = {\n      port: 3e3,\n      extensions: [\"html\", \"css\", \"js\", \"json\"],\n      watch: [\"src/**/*.html\", \"src/**/*.js\"],\n      // globs\n      ignore: [\"node_modules/**\", \".git/**\"],\n      // ignore patterns\n      ignoreCallback: \"\",\n      // js file exporting ignore callback\n      debounce: 50,\n      // ms para agrupar eventos\n      message: \"\",\n      urlPrefix: \"\",\n      execute: [],\n      payloadFile: \"\",\n      payload: \"\"\n    };\n    module2.exports = function(userConfig = {}) {\n      const fs = require(\"fs\");\n      const path = require(\"path\");\n      const express = require(\"express\");\n      const http = require(\"http\");\n      const chokidar = require(\"chokidar\");\n      const ejs = require(\"ejs\");\n      const child_process = require(\"child_process\");\n      const colors = require_colors();\n      const util = require(\"util\");\n      const execAsync = util.promisify(child_process.exec);\n      const { Server } = require(\"socket.io\");\n      const color1 = (text) => console.log(colors.style(\"magenta,bold\").text(text));\n      const color2 = (text) => console.log(colors.style(\"green,bold\").text(text));\n      const color3 = (text) => console.log(colors.style(\"cyan,bold\").text(text));\n      const colorSuccess = (text) => console.log(colors.style(\"green,bold\").text(text));\n      const colorError = (text) => console.log(colors.style(\"red,bold\").text(text));\n      const colorWarn = (text) => console.log(colors.style(\"yellow,bold\").text(text));\n      const colorInform = (text) => console.log(colors.style(\"cyan,bold\").text(text));\n      const config = Object.assign({}, defaultConfig, userConfig);\n      const listSeparator = \"\\n       - \";\n      const staticDir = path.resolve(config.serve || process.cwd());\n      const printConfigurations = function() {\n        color1(`\\u{1F527} Configuraciones del refrescador:`);\n        color1(`   - port:            ${colors.endToken}${listSeparator}${config.port}`);\n        color1(`   - watch:           ${colors.endToken}${listSeparator}${!config.watch.length ? \"(none)\" : config.watch.map((f) => path.resolve(f)).join(listSeparator)}`);\n        color1(`   - debounce:        ${colors.endToken}${listSeparator}${config.debounce}`);\n        color1(`   - extensions:      ${colors.endToken}${listSeparator}${!config.extensions.length ? \"(none)\" : config.extensions.join(listSeparator)}`);\n        color1(`   - ignore:          ${colors.endToken}${listSeparator}${!config.ignore.length ? \"(none)\" : config.ignore.map((f) => path.resolve(f)).join(listSeparator)}`);\n        color1(`   - ignoreCallback:  ${colors.endToken}${listSeparator}${!config.ignoreCallback.length ? \"(none)\" : config.ignoreCallback}`);\n        color1(`   - serve:           ${colors.endToken}${listSeparator}${staticDir}`);\n        color1(`   - urlPrefix:       ${colors.endToken}${listSeparator}${!config.urlPrefix ? \"(none)\" : config.urlPrefix}`);\n        color1(`   - payload:         ${colors.endToken}${listSeparator}${config.payload.length} characters`);\n        color1(`   - payloadFile:     ${colors.endToken}${listSeparator}${config.payloadFile ? config.payloadFile : \"(none)\"}`);\n        color1(`   - bulletproof:     ${colors.endToken}${listSeparator}${config.bulletproof ? \"yes\" : \"no\"}`);\n        color1(`   - message:         ${colors.endToken}${listSeparator}${config.message}`);\n        color1(`   - messageFile:     ${colors.endToken}${listSeparator}${config.messageFile}`);\n        color1(`   - basedir:         ${colors.endToken}${listSeparator}${config.basedir}`);\n        color1(`   - execute:         ${colors.endToken}${listSeparator}${!config.execute.length ? \"(none)\" : config.execute.join(listSeparator)}`);\n        color1(`   - executeCallback: ${colors.endToken}${listSeparator}${!config.executeCallback.length ? \"(none)\" : config.executeCallback.join(listSeparator)}`);\n      };\n      config.urlPrefix = config.urlPrefix ? \"/\" + config.urlPrefix.replace(/^\\//g, \"\") : config.urlPrefix;\n      const shortenPath = (subpath) => {\n        let s1 = require(\"path\").resolve(config.basedir, subpath);\n        if (s1.length > 1 && s1.startsWith(config.basedir)) {\n          s1 = \".\" + s1.replace(config.basedir, \"\");\n        }\n        return s1;\n      };\n      const pkgPath = require.resolve(\"socket.io/package.json\");\n      const socketioDir = path.dirname(pkgPath);\n      const socketIoClientPath = path.join(socketioDir, \"client-dist/socket.io.js\");\n      const socketIoClientCode = fs.readFileSync(socketIoClientPath);\n      const refrescadorClientPath = path.resolve(__dirname + \"/template-for-socket.io-client-reloader.ejs\");\n      const refrescadorClientTemplate = fs.readFileSync(refrescadorClientPath).toString();\n      const refrescadorClientCode = ejs.render(refrescadorClientTemplate, { require, config }, {});\n      const indexHtmlPath = path.resolve(__dirname + \"/index.ejs.html\");\n      const indexHtmlTemplate = fs.readFileSync(indexHtmlPath).toString();\n      const indexHtmlCode = ejs.render(indexHtmlTemplate, { require, config }, {});\n      if (refrescadorClientPath.endsWith(\".ejs\")) {\n        const refrescadorFinalClientPath = refrescadorClientPath.replace(/\\.ejs$/g, \".js\");\n        fs.writeFileSync(refrescadorFinalClientPath, `/* This file is only for debugging purposes. The served source is cached by the server */\n` + refrescadorClientCode, \"utf8\");\n      }\n      if (!fs.lstatSync(staticDir).isDirectory()) {\n        throw new Error(`Parameter \\xAB--serve\\xBB must point to a valid directory and not \\xAB${staticDir}\\xBB`);\n      }\n      const app = express();\n      const router = express.Router();\n      router.get(\"/index.html\", async (req, res, next) => {\n        try {\n          const hypoIndexPath = path.resolve(config.serve, \"index.ejs.html\");\n          const indexContent = await fs.promises.readFile(hypoIndexPath, \"utf8\");\n          const indexSource = ejs.render(indexContent, { require, config }, {});\n          res.type(\"text/html\");\n          res.send(indexSource);\n        } catch (error) {\n          next();\n        }\n      });\n      router.use(express.static(staticDir));\n      router.get(\"/socket.io-client.js\", (req, res) => {\n        res.type(\"application/javascript\");\n        res.send(socketIoClientCode);\n      });\n      router.get(\"/client.js\", (req, res) => {\n        res.type(\"application/javascript\");\n        res.send(refrescadorClientCode);\n      });\n      router.get(\"/index.html\", (req, res) => {\n        res.type(\"text/html\");\n        res.send(indexHtmlCode);\n      });\n      if (config.urlPrefix) {\n        app.use(config.urlPrefix, router);\n      } else {\n        app.use(router);\n      }\n      const server = http.createServer(app);\n      const io = new Server(server, {\n        cors: { origin: \"*\" }\n      });\n      io.on(\"connection\", (socket) => {\n        console.log(\"\\u{1F7E2} Cliente conectado:\", socket.id);\n        socket.on(\"disconnect\", () => {\n          console.log(\"\\u{1F534} Cliente desconectado:\", socket.id);\n        });\n      });\n      let timeout = null;\n      let running = false;\n      const triggerReload = function(path2) {\n        console.log(`[refrescador] [triggered] ${path2}`);\n        return new Promise((resolve, reject) => {\n          if (running) return;\n          if (timeout) clearTimeout(timeout);\n          initEvent = /* @__PURE__ */ new Date();\n          timeout = setTimeout(async () => {\n            const timings = [];\n            try {\n              console.clear();\n              printUrls();\n              colorWarn(`\\u267B\\uFE0F  Changes detected on: \\u{1F4C4}=${shortenPath(path2)}`);\n              if (config.executeCallback.length) {\n                Iterating_execution_callbacks:\n                  for (let index = 0; index < config.executeCallback.length; index++) {\n                    const init = /* @__PURE__ */ new Date();\n                    const fileInput = config.executeCallback[index];\n                    const callbackFileBrute = require(\"path\").resolve(process.cwd(), fileInput.replace(/^\\!/g, \"\"));\n                    const isFresh = /^\\!/g.test(fileInput);\n                    const callbackFile = callbackFileBrute;\n                    if (isFresh) {\n                      delete require.cache[callbackFile];\n                    }\n                    colorWarn(`\\u{1F7E8} \\u26A1\\uFE0F Started callback [\\u{1F4DE}=${shortenPath(callbackFile)}] [${index + 1}/${config.executeCallback.length}]`);\n                    let result = void 0;\n                    Running_callback_file:\n                      try {\n                        const callback = require(callbackFile);\n                        if (typeof callback !== \"function\") {\n                          if (!isFresh) {\n                            colorInform(`  \\u26A0\\uFE0F  Callback file not exporting a callback: ${shortenPath(callbackFile)}`);\n                          }\n                          break Running_callback_file;\n                        }\n                        result = await callback(callbackFileBrute);\n                        diff = /* @__PURE__ */ new Date() - init;\n                        colorSuccess(`\\u{1F7E9} \\u{1F38A} Done [\\u23F3=${diff / 1e3}s] [\\u{1F4BB}=${shortenPath(callbackFile)}] [${index + 1}/${config.execute.length}]`);\n                      } catch (error) {\n                        colorError(`\\u{1F7E5} \\u2757\\uFE0F Error executing callback \\xAB${shortenPath(callbackFile)}\\xBB:`, error);\n                        throw error;\n                      }\n                    if (result instanceof AbortController) {\n                      colorError(`\\u{1F7E5} \\u2757\\uFE0F Aborting filewatcher event by execution callback \\u26A0\\uFE0F`);\n                      return result;\n                    }\n                  }\n              }\n              if (config.execute.length) {\n                Iterating_executions:\n                  for (let index = 0; index < config.execute.length; index++) {\n                    const command = config.execute[index].replace(\"@{refrescador.file}\", JSON.stringify(path2));\n                    colorWarn(`\\u{1F7E8} \\u26A1\\uFE0F Started [\\u{1F4BB}=${command}] [${index + 1}/${config.execute.length}]`);\n                    const init = /* @__PURE__ */ new Date();\n                    try {\n                      await new Promise((resolve2, reject2) => {\n                        const child = child_process.spawn(command, {\n                          stdio: \"inherit\",\n                          shell: true\n                        });\n                        child.on(\"close\", (code) => {\n                          if (code === 0) {\n                            resolve2(code);\n                          } else {\n                            reject2(new Error(`Exit code: ${code}`));\n                          }\n                        });\n                        child.on(\"error\", reject2);\n                      });\n                      const diff2 = /* @__PURE__ */ new Date() - init;\n                      timings.push({ command, diff: diff2 });\n                      colorSuccess(`\\u{1F7E9} \\u{1F38A} Done [\\u23F3=${diff2 / 1e3}s] [\\u{1F4BB}=${command}] [${index + 1}/${config.execute.length}]`);\n                    } catch (error) {\n                      colorError(`\\u{1F7E5}\\u{1F7E5}\\u{1F7E5}\\u{1F7E5}\\u{1F7E5}\\u{1F7E5}\\u{1F7E5}\\u{1F7E5}\\u{1F7E5}\\u{1F7E5}\\u{1F7E5}\\u{1F7E5}\\u{1F7E5}\\u{1F7E5}\\u{1F7E5}\\u{1F7E5}\\u{1F7E5}\\u{1F7E5}\\u{1F7E5}`);\n                      colorError(`\\u2502 \\u2757\\uFE0F Executed with errors ${index + 1}/${config.execute.length}! \\u26A0\\uFE0F`);\n                      colorError(`\\u2502      - ${command}`);\n                      const diff2 = /* @__PURE__ */ new Date() - init;\n                      timings.push({ command, diff: diff2 });\n                      colorError(`\\u2502 \\u23F3 ${diff2 / 1e3}s for the execution with errors \\u26A0\\uFE0F`);\n                      colorError(error);\n                      if (!userConfig.bulletproof) {\n                        break Iterating_executions;\n                      }\n                    }\n                  }\n              }\n              io.emit(\"refresh-window\");\n              return resolve();\n            } catch (error) {\n              return reject(error);\n            } finally {\n              running = false;\n              const diffEvent = /* @__PURE__ */ new Date() - initEvent;\n              colorInform(\" \\u{1F4CA} Timings:\");\n              if (timings.length) {\n                let atomicSummatory = 0;\n                for (let index = 0; index < timings.length; index++) {\n                  const timing = timings[index];\n                  colorInform(`  \\u231B\\uFE0F \\u2795 ${timing.diff / 1e3}s [\\u{1F4BB}=${timing.command.replace(/\\n/g, \" \")}]`);\n                  atomicSummatory += timing.diff;\n                }\n                colorInform(`  \\u231B\\uFE0F \\u{1F7F0} ${atomicSummatory / 1e3}s in summatory`);\n              }\n              colorInform(`  \\u{1F30F} \\u23F3 ${(diffEvent - config.debounce) / 1e3}s | ${diffEvent / 1e3}s with debounce of ${config.debounce} milliseconds for the whole event`);\n              if (config.message) console.log(`\\u{1F7E6} ${config.message}`);\n              if (config.messageFile) {\n                const text = await fs.promises.readFile(config.messageFile, \"utf8\");\n                console.log(ejs.render(text, { config }));\n              }\n            }\n          }, config.debounce);\n        });\n      };\n      const matchesIgnoreCallback = function(filepath) {\n        if (!config.ignoreCallback) {\n          return false;\n        }\n        try {\n          return require(config.ignoreCallback)(filepath);\n        } catch (error) {\n          console.error(`Error loading ignore callback file \\xAB${filepath}\\xBB:`, error);\n        }\n      };\n      const matchesIgnore = function(filepath) {\n        for (let index = 0; index < config.ignore.length; index++) {\n          const ignoreExpression = config.ignore[index];\n          const ignoreExpressionPath = path.resolve(ignoreExpression);\n          const ignoreSelector = ignoreExpression === ignoreExpressionPath ? ignoreExpression : [ignoreExpression, ignoreExpressionPath];\n          const isMatch = require(\"picomatch\")(ignoreSelector)(filepath);\n          if (isMatch) return true;\n        }\n        return false;\n      };\n      const matchesExtension = function(filepath) {\n        const exts = config.extensions;\n        for (let index = 0; index < exts.length; index++) {\n          const extid = exts[index];\n          if (filepath.endsWith(extid)) return true;\n        }\n        return false;\n      };\n      const watcher = chokidar.watch(config.watch, {\n        // Esto es una mierda, porque solo te pilla el fichero, no acepta patrones:\n        // ignored: config.ignore,\n        ignoreInitial: true,\n        persistent: true\n      });\n      let initEvent = false;\n      watcher.on(\"add\", async (path2) => {\n        if (matchesIgnore(path2)) return;\n        if (!matchesExtension(path2)) return;\n        if (matchesIgnoreCallback(path2)) return;\n        console.log(\"\\n\\u2795  Add event from:\" + listSeparator + path2);\n        await triggerReload(path2);\n      }).on(\"change\", async (path2) => {\n        if (matchesIgnore(path2)) return;\n        if (!matchesExtension(path2)) return;\n        if (matchesIgnoreCallback(path2)) return;\n        console.log(\"\\n\\u270F\\uFE0F  Change event from:\" + listSeparator + path2);\n        await triggerReload(path2);\n      }).on(\"unlink\", async (path2) => {\n        if (matchesIgnore(path2)) return;\n        if (!matchesExtension(path2)) return;\n        if (matchesIgnoreCallback(path2)) return;\n        console.log(\"\\n\\u274C  Unlink event from:\" + listSeparator + path2);\n        await triggerReload(path2);\n      }).on(\"error\", (err) => {\n        console.error(\"Watcher error:\", err);\n      });\n      console.clear();\n      const printUrls = function() {\n        color2(`\\u{1F7E2} Puntos disponibles: \\u{1F4C2}=${config.basedir}`);\n        color2(` \\u{1F539} http://localhost:${config.port}${config.urlPrefix}/index.html           \\u2502 (la entrada inicial de tu aplicaci\\xF3n)`);\n        color2(` \\u{1F539} http://localhost:${config.port}${config.urlPrefix ? \" \".repeat(config.urlPrefix.length) : \"\"}                      \\u2502 (socket.io-server de refrescador)`);\n        color2(` \\u{1F539} http://localhost:${config.port}${config.urlPrefix}/socket.io-client.js  \\u2502 (socket.io-client)`);\n        color2(` \\u{1F539} http://localhost:${config.port}${config.urlPrefix}/client.js            \\u2502 (cliente de refrescador)`);\n      };\n      server.listen(config.port, () => {\n        printUrls();\n        printConfigurations();\n        console.log(\"\");\n        color3(`\\u{1F680} Servidor refrescador activo`);\n        color3(`\\u{1F4DF} Iniciado a ${(/* @__PURE__ */ new Date()).toLocaleDateString(\"es-es\", {\n          weekday: \"long\",\n          year: \"numeric\",\n          month: \"long\",\n          day: \"numeric\",\n          hour: \"numeric\",\n          minute: \"numeric\",\n          second: \"numeric\"\n        })}`);\n      });\n      return { server, watcher, config, io };\n    };\n  }\n});\n\n// lib/from-object-to-window-reloader-server.js\nvar require_from_object_to_window_reloader_server = __commonJS({\n  \"lib/from-object-to-window-reloader-server.js\"(exports2, module2) {\n    module2.exports = function(argv = process.argv.splice(2)) {\n      const assertion = require_from_condition_to_error();\n      const trace = require_trace();\n      const getParameters = require_from_cli_args_to_map();\n      const validateParameters = require_from_schema_to_type_assertions();\n      const startServer = require_from_glob_watcher_to_socketio_emit();\n      assertion(typeof argv === \"object\", \"Parameter \\xABargv\\xBB must be object on \\xABfrom-object-to-window-reloader-server.js\\xBB\");\n      const formalDefinition = {\n        _: false,\n        // deshabilitar los parámetros posicionales\n        debounce: {\n          alias: \"d\",\n          default: 50,\n          type: Number\n        },\n        port: {\n          alias: \"p\",\n          default: 3003,\n          type: Number\n        },\n        watch: {\n          alias: \"w\",\n          default: [process.cwd()],\n          type: Array\n        },\n        extensions: {\n          alias: \"e\",\n          default: [\"html\", \"css\", \"js\"],\n          type: Array\n        },\n        ignore: {\n          alias: \"i\",\n          default: [\"**/node_modules/**\", \"**/dist/**\", \"**/*.dist.*\", \"**/dist.*\"],\n          type: Array\n        },\n        ignoreCallback: {\n          alias: \"ic\",\n          default: \"\",\n          type: String\n        },\n        message: {\n          alias: \"m\",\n          default: \"\\u{1F4E2} Hora de refrescar!\",\n          type: String\n        },\n        messageFile: {\n          alias: \"mf\",\n          default: \"\",\n          type: String\n        },\n        execute: {\n          alias: \"x\",\n          default: [],\n          type: Array\n        },\n        executeCallback: {\n          alias: \"xc\",\n          default: [],\n          type: Array\n        },\n        bulletproof: {\n          alias: \"bp\",\n          default: false,\n          type: Boolean\n        },\n        help: {\n          alias: \"h\",\n          default: false,\n          type: Boolean\n        },\n        payloadFile: {\n          alias: \"pf\",\n          default: \"\",\n          type: String\n        },\n        payload: {\n          alias: \"pl\",\n          default: 'console.log(\"\\u{1F4DF} Iniciada conexi\\xF3n con refrescador\");',\n          type: String\n        },\n        serve: {\n          alias: \"s\",\n          default: process.cwd(),\n          type: String\n        },\n        urlPrefix: {\n          alias: \"up\",\n          default: \"\",\n          type: String\n        },\n        basedir: {\n          alias: \"b\",\n          default: process.cwd(),\n          type: String\n        },\n        version: {\n          alias: \"v\",\n          default: false,\n          type: Boolean\n        }\n      };\n      let input = !Array.isArray(argv) ? function(settings) {\n        return Object.keys(formalDefinition).reduce((out, key) => {\n          if (key === \"_\") return out;\n          if (key in settings) {\n            out[key] = settings[key];\n          } else {\n            out[key] = \"default\" in formalDefinition[key] ? formalDefinition[key].default : function(t) {\n              if (t === String) {\n                return \"\";\n              }\n              if (t === Number) {\n                return 0;\n              }\n              if (t === Array) {\n                return [];\n              }\n              if (t === Boolean) {\n                return false;\n              }\n              return null;\n            }(formalDefinition[key].type);\n          }\n          return out;\n        }, {});\n      }(argv) : getParameters(formalDefinition, argv);\n      trace(\"from-object-to-window-reloader-server:step-2(input)\", input);\n      validateParameters(input, {\n        watch: { type: Array },\n        ignore: { type: Array },\n        ignoreCallback: { type: String },\n        extensions: { type: Array },\n        debounce: { type: Number },\n        port: { type: Number },\n        serve: { type: String },\n        urlPrefix: { type: String },\n        bulletproof: { type: Boolean },\n        help: { type: Boolean },\n        message: { type: String },\n        messageFile: { type: String },\n        payload: { type: String },\n        payloadFile: { type: String },\n        execute: { type: Array },\n        executeCallback: { type: Array },\n        basedir: { type: String },\n        version: { type: Boolean }\n      });\n      return {\n        settings: input,\n        server: startServer(input)\n      };\n    };\n  }\n});\n\n// refrescador.api.js\nmodule.exports = {\n  colors: require_colors(),\n  run: require_from_object_to_window_reloader_server()\n};\n",
              "refrescador.cli.dist.js": "#!/usr/bin/env node\n\n// refrescador.cli.js\nrequire(__dirname + \"/refrescador.api.dist.js\").run();\n",
              "template-for-socket.io-client-reloader.ejs": "io(\"http://localhost:<%-config.port%>\").on(\"refresh-window\", async function() {\n    console.log(\"[refrescador] La app ha sido llamada a refrescarse por el servidor\");\n    <%-!config.payloadFile ? \"\" : require(\"fs\").readFileSync(config.payloadFile).toString()%>\n    <%-config.payload%>\n    location.reload();\n});",
              "template-for-socket.io-client-reloader.js": "/* This file is only for debugging purposes. The served source is cached by the server */\nio(\"http://localhost:3003\").on(\"refresh-window\", async function() {\n    console.log(\"[refrescador] La app ha sido llamada a refrescarse por el servidor\");\n    \n    console.log(\"📟 Iniciada conexión con refrescador\");\n    location.reload();\n});",
              "tjs.js": "class TjsRender {\n  static AsyncFunction = (async function () { }).constructor;\n  static beautifyJs(code, options = { indent_size: 1 }) {\n    return require(\"js-beautify/js\").js(code, options === true ? { indent_size: 1 } : options);\n  }\n  static render(template, injection = {}, options = {}) {\n    const args = { ...injection, Tjs };\n    const renderer = this.createRenderer(template, options, Object.keys(args))\n    if(options.async) {\n      return renderer(...Object.values(args)).then(newSource => {\n        if (options.beautify) {\n          newSource = TjsRender.beautifyJs(newSource, options.beautify);\n        }\n        return newSource;\n      });\n    } else {\n      let newSource = renderer(...Object.values(args));\n      if (options.beautify) {\n        newSource = TjsRender.beautifyJs(newSource, options.beautify);\n      }\n      return newSource;\n    }\n  }\n  static createRendererSource(template, options = {}) {\n    const {\n      delimiter = \"$\",\n      // name = false,\n      // async: isAsync = false,\n      beautifyRender = false,\n    } = options;\n    const openBlock = `<${delimiter}`;\n    const openBlockComment = `/*${openBlock}`;\n    const openValue = `<${delimiter}=`;\n    const openValueComment = `/*${openValue}`;\n    const close = `${delimiter}>`;\n    const closeComment = `${close}*/`;\n    let code = 'let $templatedJs=\"\";\\n';\n    let pos = 0;\n    Iterating_characters:\n    do {\n      if (template.startsWith(openBlockComment, pos)) {\n        const isValue = template.startsWith(openValueComment, pos);\n        const offset = isValue ? openValueComment.length : openBlockComment.length;\n        pos += offset;\n        const startedAt = pos;\n        Injecting_comment:\n        while (pos < template.length) {\n          if (template.startsWith(closeComment, pos)) {\n            const endedAt = pos;\n            const interjection = template.substring(startedAt, endedAt);\n            const subcode = isValue ? `$templatedJs += (${interjection.trim()});\\n` : `${interjection.trim()}\\n`;\n            code += subcode;\n            pos += closeComment.length;\n            Eliminar_apendices_polifilers: {\n              if (template.startsWith(\"(){}\", pos)) {\n                pos += 4;\n              } else if (template.startsWith(\"0\", pos)) {\n                pos += 1;\n              } else if (template.startsWith('\"template\"', pos)) {\n                pos += '\"template\"'.length;\n              }\n            }\n            continue Iterating_characters;\n          }\n          pos++;\n        }\n        throw new Error(`unclosed injected commented ${isValue ? \"value\" : \"expression\"}: [pos=${startedAt}] ${template.substr(startedAt, 20)}`);\n      } else if (template.startsWith(openBlock, pos)) {\n        const isValue = template.startsWith(openValue, pos);\n        const offset = isValue ? openValue.length : openBlock.length;\n        pos += offset;\n        const startedAt = pos;\n        Injecting_expression:\n        while (pos < template.length) {\n          if (template.startsWith(close, pos)) {\n            const endedAt = pos;\n            const interjection = template.substring(startedAt, endedAt);\n            const subcode = isValue ? `$templatedJs += (${interjection.trim()});\\n` : `${interjection.trim()}\\n`;\n            code += subcode;\n            pos += close.length;\n            continue Iterating_characters;\n          }\n          pos++;\n        }\n        throw new Error(`unclosed injected ${isValue ? \"value\" : \"expression\"}: [pos=${startedAt}] ${template.substr(startedAt, 20)}`);\n      } else {\n        const startedAt = pos;\n        Injecting_string: {\n          while (pos < template.length) {\n            if (template.startsWith(openBlockComment, pos) || template.startsWith(openBlock, pos)) {\n              const endedAt = pos;\n              const interjection = template.substring(startedAt, endedAt);\n              const subcode = `$templatedJs += ${JSON.stringify(interjection)};\\n`;\n              code += subcode;\n              pos += 0;\n              continue Iterating_characters;\n            }\n            pos++;\n          }\n          const interjection = template.substring(startedAt, pos);\n          const subcode = `$templatedJs += ${JSON.stringify(interjection)};\\n`;\n          code += subcode;\n        }\n      }\n    } while (pos < template.length);\n    code += \"return $templatedJs;\\n\";\n    if (beautifyRender) {\n      code = TjsRender.beautifyJs(code, beautifyRender);\n    }\n    return code;\n  }\n  static createRenderer(template, options, argKeys = [\"data\"]) {\n    const renderedSource = this.createRendererSource(template, options, argKeys);\n    return options.async ? new TjsRender.AsyncFunction(...argKeys, renderedSource) : new Function(...argKeys, renderedSource);\n  }\n}\nclass TjsReader {\n  static default = this;\n  static readFile(file) {\n    return require(\"fs\").promises.readFile(file, \"utf8\");\n  }\n  static readFileAsString(file) {\n    return require(\"fs\").promises.readFile(file, \"utf8\").then(source => JSON.stringify(source));\n  }\n  static readFileSync(file) {\n    return require(\"fs\").readFileSync(file, \"utf8\");\n  }\n  static readFileSyncAsString(file) {\n    return JSON.stringify(require(\"fs\").readFileSync(file, \"utf8\"));\n  }\n  static readUrl(url) {\n    return fetch(url, { method: \"GET\" }).then(response => response.text());\n  }\n  static renderFile(file, args, options) {\n    return TjsReader.readFile(file).then(source => TjsRender.render(source, args, options));\n  }\n  static renderFileSync(file, args, options) {\n    const source = TjsReader.readFileSync(file, \"utf8\");\n    return TjsRender.render(source, args, options);\n  }\n  static renderUrl(url, args, options) {\n    return TjsReader.readUrl(url).then(source => TjsRender.render(source, args, options));\n  }\n}\nclass Tjs {\n  static assert(condition, message) { if (!condition) throw new Error(\"assertion error (by Tjs): \" + message); }\n  static assertThrows(callback, message) {\n    let failed = false;\n    try {\n      callback();\n    } catch (error) {\n      failed = error;\n    }\n    if (failed === false) {\n      throw new Error(\"assertionThrows did not throw error (by Tjs): \" + message);\n    }\n  }\n  static Render = TjsRender;\n  static Reader = TjsReader;\n  static {\n    this.render = TjsRender.render;\n    this.renderUrl = TjsReader.renderUrl;\n    this.renderFile = TjsReader.renderFile;\n    this.renderFileSync = TjsReader.renderFileSync;\n    this.readFile = TjsReader.readFile;\n    this.readFileAsString = TjsReader.readFileAsString;\n    this.readFileSync = TjsReader.readFileSync;\n    this.readFileSyncAsString = TjsReader.readFileSyncAsString;\n    this.createRenderer = TjsRender.createRenderer;\n    this.createRendererSource = TjsRender.createRendererSource;\n  }\n  static create(...args) {\n    return new this(...args);\n  }\n  static defaultSettings = {\n    createFileIfNotExists: false,\n    defaultFileContent: \"\",\n  };\n  constructor(basedir, settings = {}) {\n    this.basedir = basedir;\n    this.settings = Object.assign({}, this.constructor.defaultSettings, settings);\n  }\n  fullpathOf(file, relativeDir = false) {\n    this.constructor.assert(typeof file === \"string\", \"required file as string on Tjs.prototype.fullpathOf\");\n    if(file.startsWith(\"./\")) {\n      return require(\"path\").resolve(relativeDir, file);\n    }\n    return require(\"path\").resolve(this.basedir, file);\n  }\n  directoryOf(file) {\n    return require(\"path\").dirname(this.fullpathOf(file));\n  }\n  renderFileSync(file, args, options = {}) {\n    return this.constructor.renderFileSync(this.fullpathOf(file), this.generateParameters(args, file, options), options);\n  }\n  renderFile(file, args, options = {}) {\n    return this.constructor.renderFile(this.fullpathOf(file), this.generateParameters(args, file, options), { ...options, async: true });\n  }\n  readFileSync(file) {\n    return this.constructor.readFileSync(this.fullpathOf(file));\n  }\n  readFile(file) {\n    return this.constructor.readFile(this.fullpathOf(file));\n  }\n  readFileAsString(file) {\n    return this.constructor.readFileAsString(this.fullpathOf(file));\n  }\n  readFileSyncAsString(file) {\n    return this.constructor.readFileSyncAsString(this.fullpathOf(file));\n  }\n  readFileAsString(file) {\n    return this.constructor.readFileAsString(this.fullpathOf(file));\n  }\n  generateParameters(args, file, options) {\n    const fullfilepath = this.fullpathOf(file);\n    const fulldirpath = require(\"path\").dirname(fullfilepath);\n    return {\n        ...args,\n        tjs: this,\n        require,\n        process,\n        __dirname: fulldirpath,\n        __filename: fullfilepath,\n        stringifyFile: (targetFile) => {\n          return this.readFileAsString(this.fullpathOf(targetFile, fulldirpath));\n        },\n        stringifyFileSync: (targetFile) => {\n          return this.readFileSyncAsString(this.fullpathOf(targetFile, fulldirpath));\n        },\n        pasteFile: (targetFile) => {\n          return this.readFile(this.fullpathOf(targetFile, fulldirpath));\n        },\n        pasteFileSync: (targetFile) => {\n          return this.readFileSync(this.fullpathOf(targetFile, fulldirpath));\n        },\n        includeSync: (targetFile, ...others) => {\n          const fullpathFile = this.fullpathOf(targetFile, fulldirpath);\n          if(this.settings.createFileIfNotExists) {\n            try {\n              return this.renderFileSync(fullpathFile, ...others);\n            } catch (error) {\n              if(error.code === \"ENOENT\" && error.message.includes(fullpathFile + \"'\")) {\n                require(\"fs\").writeFileSync(fullpathFile, this.settings.defaultFileContent, \"utf-8\");\n                return this.renderFileSync(fullpathFile, ...others);\n              }\n              throw error;\n            }\n          } else {\n            return this.renderFileSync(fullpathFile, ...others);\n          }\n        },\n        include: (targetFile, ...others) => {\n          const fullpathFile = this.fullpathOf(targetFile, fulldirpath);\n          return this.renderFile(fullpathFile, ...others).catch(error => {\n            if(this.settings.createFileIfNotExists) {\n              console.log(\"targetFile:\", fullpathFile);\n              console.log(\"Message:\", error.message);\n              console.log(\"error:\", error);\n              console.log(\"code:\", error.code);\n              console.log(\"props:\", Object.keys(error));\n              if(error.code === \"ENOENT\" && error.message.includes(fullpathFile + \"'\")) {\n                return require(\"fs\").promises.writeFile(fullpathFile, this.settings.defaultFileContent, \"utf-8\").then(() => {\n                  return this.renderFile(fullpathFile, ...others);\n                });\n              }\n            }\n            throw error;\n          });\n        },\n    };\n  }\n}\nmodule.exports = Tjs;"
            },
            "moduler-v5": {
              "moduler-v5.dist.js": "(function(mod) {\n  if (typeof window !== 'undefined') window['ModulerV5'] = mod;\n  if (typeof global !== 'undefined') global['ModulerV5'] = mod;\n  if (typeof module !== 'undefined') module.exports = mod;\n})(function() {\n\n  const ModulerV5 = class {\n    static CssModuler = class CssModuler {\n      static create(...args) {\n        return new this(...args);\n      }\n      static fakeCssStyleSheet() {\n        return new class FakeCssStyleSheet {\n          isFake = true;\n          replace(...args) {\n            // console.log(\"in node.js this does nothing\", args)\n          }\n        }();\n      }\n      static symbols = {\n        REQUIRES_REGEX: /(\\/\\*\\@requires\\:((?!\\*\\/).)+\\*\\/)+(\\r|\\t|\\n| )?/g\n      };\n      constructor(moduler) {\n        this.moduler = moduler;\n        this.sheets = {};\n        this.entry = typeof CSSStyleSheet === \"function\" ? new CSSStyleSheet() : this.constructor.fakeCssStyleSheet();\n        if (!this.entry.isFake) {\n          document.adoptedStyleSheets.push(this.entry);\n        }\n      }\n      assert(condition, message) {\n        if (!condition) throw new Error(\"AssertionError in CssModuler: \" + message);\n      }\n      async add(input1 = null, eventToAdd = {\n        newSheets: {},\n        oldSheets: {},\n        count: 0\n      }) {\n        this.assert(typeof input1 === \"string\", \"on CssModuler.prototype.add: arguments[0] must be string\");\n        const id = this.moduler.fullpathOf(input1);\n        if (id in this.sheets) {\n          if (!(id in eventToAdd.oldSheets)) {\n            eventToAdd.oldSheets = [];\n          }\n          eventToAdd.oldSheets[id].push(eventToAdd.count++);\n        } else {\n          const source = await this.moduler.readPath(id);\n          const allRequires = source.match(this.constructor.symbols.REQUIRES_REGEX);\n          const submoduler = this.moduler.cloneForFile(id);\n          const requires = !allRequires ? [] : allRequires.map(match => {\n            const subpath = match.substr(\"/*@requires:\".length).trim().slice(0, -2).trim();\n            return submoduler.fullpathOf(subpath);\n          });\n          const moduloCss = {\n            id,\n            source,\n            requires\n          };\n          this.sheets[id] = moduloCss;\n          eventToAdd.newSheets[id] = eventToAdd.count++;\n          for (let index = 0; index < requires.length; index++) {\n            const subid = requires[index];\n            await this.add(subid, eventToAdd);\n          }\n        }\n        return eventToAdd;\n      }\n      _sortSheets(eventToSync) {\n        const dependencies = [];\n        const visited = new Set();\n        const visit = (sheetId) => {\n          if (visited.has(sheetId)) {\n            return;\n          }\n          visited.add(sheetId);\n          const sheet = this.sheets[sheetId];\n          if (!sheet) {\n            return;\n          }\n          for (const dependencyId of sheet.requires) {\n            visit(dependencyId);\n          }\n          dependencies.push(sheet);\n        };\n        for (const sheetId in this.sheets) {\n          visit(sheetId);\n        }\n        eventToSync.dependencies = dependencies;\n        eventToSync.counter = dependencies.length;\n      }\n      _generateSource(eventToSync) {\n        let css = \"\";\n        for (let index = 0; index < eventToSync.dependencies.length; index++) {\n          const dependency = eventToSync.dependencies[index];\n          css += `/*!original:${this.moduler.relpathOf(dependency.id)}*/\\n`;\n          css += `/*!order:${index+1}*/\\n`;\n          css += `${dependency.source.replace(this.constructor.symbols.REQUIRES_REGEX, match => \"/*!\" + match.substr(3))}\\n\\n`;\n        }\n        eventToSync.source = css;\n      }\n      async _synchronizeSource(eventToSync) {\n        // @BROWSER pero polifileado:\n        await this.entry.replace(eventToSync.source);\n      }\n      async _exportSource(eventToSync, options) {\n        if (options.outFile) {\n          await require(\"fs\").promises.writeFile(this.moduler.fullpathOf(outFile), eventToSync.source, \"utf8\");\n        }\n      }\n      remove(input1) {\n        const id = this.moduler.fullpathOf(input1);\n        this.assert(id in this.sheets, \"cannot remove sheet because it is not added: \" + id);\n        delete this.sheets[id];\n        return this;\n      }\n      async synchronize(options = {\n        outFile: false\n      }) {\n        const eventToSync = {\n          counter: 0,\n          dependencies: [],\n        };\n        await this._sortSheets(eventToSync, options);\n        await this._generateSource(eventToSync, options);\n        await this._synchronizeSource(eventToSync, options);\n        await this._exportSource(eventToSync, options);\n        return eventToSync;\n      }\n    };\n    static create(...args) {\n      return new this(...args);\n    }\n    constructor(...args) {\n      this.isBrowser = typeof window !== \"undefined\";\n      let input1 = null;\n      let input2 = null;\n      Step_1_Receive_arguments: {\n        if (args.length === 0) {\n          input1 = null;\n          input2 = null;\n        } else if (args.length === 1) {\n          input1 = args[0] || null;\n          input2 = null;\n        } else if (args.length === 2) {\n          input1 = args[0] || null;\n          input2 = args[1];\n        } else {\n          throw new Error(\"on «ModulerV5.constructor»: parameter «arguments.length» must be between 0-2\");\n        }\n      }\n      let rootdir = null;\n      let basedir = null;\n      let definitions = null;\n      let cloneRoot = null;\n      Step_2_Fulfill_parameters: {\n        if (input1 === null) {\n          basedir = null;\n          definitions = {};\n        } else if (typeof input1 === \"string\") {\n          basedir = input1;\n          definitions = {};\n        } else if (typeof input1 === \"object\" && input1 instanceof ModulerV5) {\n          cloneRoot = input1;\n          rootdir = input1.rootdir;\n          basedir = input1.basedir;\n          definitions = input1.definitions;\n        } else {\n          throw new Error(\"on «ModulerV5.constructor»: parameter «arguments[0]» must be undefined, string, null or instance of ModulerV5\");\n        }\n        if (input2 === null) {\n          // @OK: no extra file\n        } else if (typeof input2 === \"string\") {\n          this.assert(typeof input1 === \"object\" && input1 instanceof ModulerV5, \"on «ModulerV5.constructor»: parameter «arguments[1]» can only be used when «arguments[0]» is instance of ModulerV5\");\n          basedir = input1.fullpathOf(input2);\n        } else {\n          throw new Error(\"on «ModulerV5.constructor»: parameter «arguments[1]» must be string, null or instance of ModulerV5\");\n        }\n      }\n      Step_3_Fix_default_values: {\n        if (basedir === null) {\n          if (this.isBrowser) {\n            basedir = window.location.origin + window.location.pathname;\n          } else {\n            basedir = process.cwd();\n          }\n        }\n      }\n      Step_4_Validate_final_format: {\n        this.assert(typeof basedir === \"string\", \"on «ModulerV5.constructor»: variable «basedir» was not well formatted\");\n        this.assert(typeof definitions === \"object\", \"on «ModulerV5.constructor»: variable «definitions» was not well formatted\");\n      }\n      Step_5_Stablish_values: {\n        this.rootdir = rootdir ?? basedir;\n        this.basedir = basedir;\n        this.definitions = definitions;\n        this.css = cloneRoot ? cloneRoot.css : this.constructor.CssModuler.create(this);\n      }\n    }\n    static inspectToString(args, debugLevel) {\n      if (debugLevel === 0) return `${[...args].length} args`;\n      if (debugLevel === 1) return `${[...args].map((it, i) => i + \":\" + typeof it).join(\",\")} args`;\n      if (debugLevel === 2) return `${[...args].map((it, i) => i + \":\" + typeof it + this.stringify(it)).join(\",\")} args`;\n    }\n    static stringify(it) {\n      try {\n        return JSON.stringify(it);\n      } catch (error) {\n        return it;\n      }\n    }\n    isTracing = false;\n    trace(method, args = [], debugLevel = 0) {\n      if (!this.isTracing) return;\n      console.log(`[${method}] ${this.constructor.inspectToString(args, debugLevel)}`)\n    }\n    assert(condition, message) {\n\n      if (!condition) throw new Error(\"AssertionError in ModulerV5: \" + message);\n    }\n    normalizationOf = function(subpath, debug = false) {\n      const parts = (() => {\n        if (subpath.match(/^[A-Za-z0-9\\_\\-]+\\:\\/\\//g)) {\n          return subpath;\n        } else if (subpath.startsWith(\"./\")) {\n          return [this.basedir.replace(/(?!\\:\\/)\\/$/g, \"\"), subpath.substr(2)].join(\"/\");\n        } else if (subpath.startsWith(\"../\")) {\n          return [this.basedir.replace(/(?!\\:\\/)\\/$/g, \"\") + \"/..\", subpath.substr(3)].join(\"/\");\n        } else if (subpath.startsWith(\"@/\")) {\n          return [this.rootdir.replace(/(?!\\/)\\/$/g, \"\"), subpath.substr(2)].join(\"/\");\n        } else if (subpath.startsWith(\"/\")) {\n          return subpath;\n        } else {\n          return [this.basedir.replace(/(?!\\/)\\/$/g, \"\"), subpath].join(\"/\");\n        }\n      })().split(/(\\/+)/g).filter(p => p !== \"\");\n      //console.log(parts);\n      const stack = [];\n      Iterating_parts:\n        for (const part of parts) {\n          if (part === \".\") {\n            // @OK\n          } else if (part === \"..\") {\n            if (stack.length && stack[stack.length - 1] === \"/\") {\n              stack.pop();\n              stack.pop();\n            } else if (stack.length && stack[stack.length - 1] === \"//\") {\n              // @OK\n            } else if (stack.length) {\n              stack.pop();\n            } else {\n              // @OK\n            }\n          } else if (part === \"/\") {\n            if (stack.length && stack[stack.length - 1] === \"/\") {\n              // @OK\n            } else if (stack.length && stack[stack.length - 1] === \"//\") {\n              // @OK\n            } else {\n              stack.push(part);\n            }\n          } else {\n            stack.push(part);\n          }\n        }\n      let finalUrl = stack.join(\"\");\n      if (finalUrl.length !== 1) {\n        finalUrl = finalUrl.replace(/\\/$/g, \"\");\n      }\n      if (debug) {\n        console.log(finalUrl);\n      }\n      return finalUrl;\n    };\n    fullpathOf(subpath) {\n\n      return this.normalizationOf(subpath);\n      return require(\"path\").normalize(base);\n      // return require(\"path\").resolve(this.basedir, subpath);\n    }\n    relpathOf(subpath) {\n\n      if (this.isBrowser) {\n        throw new Error(\"Must polyfill method «fullpathOf» to support browser environment\");\n      }\n      return \"@/\" + this.fullpathOf(subpath).replace(this.rootdir, \"\").replace(/^\\//g, \"\");\n    }\n    importModule(subpath, injection = {}) {\n\n      return this.readPath(subpath).then(source => {\n        const asyncFunction = new(async function() {}).constructor(`[${Object.keys(injection).join(\",\")}]`, \"module\", \"exports\", \"LocalDictionary\", \"__filename\", \"__dirname\", source);\n        // console.log(asyncFunction.toString())\n\n        return this.callModuleFactory(Object.values(injection), asyncFunction, this.cloneForFile(subpath), subpath, this.normalizationOf(subpath + \"/..\"));\n      });\n    }\n    readPath(file) {\n\n      return this.isBrowser ? this.readUrl(file) : this.readFile(file);\n    }\n    readUrl(file) {\n\n      return fetch(this.fullpathOf(file)).then(response => response.text());\n    }\n    readFile(file) {\n\n      return require(\"fs\").promises.readFile(this.fullpathOf(file), \"utf8\");\n    }\n    knows(id) {\n\n      // Comprueba si un id está en definitions\n      Validate_parameters: {\n        this.assert(typeof id === \"string\", \"required «arguments[0]=id» as string to use «knows»\");\n      }\n      Search_as_definition: {\n        if (!(id in this.definitions)) {\n          return false;\n        }\n        return true;\n      }\n    }\n    define(...args) {\n\n      let dependencies = [];\n      let factory = undefined;\n      Validate_parameters: {\n        if (args.length === 1) {\n          this.assert(typeof args[0] === \"function\", `using define: if args.length is 1 then args[0] must be factory function but «${typeof args[0]}» was found instead on «ModulerV5.prototype.define»`);\n          factory = args[0];\n        } else if (args.length === 2) {\n          this.assert(Array.isArray(args[0]), `using define: if args.length is 2 then args[0] must be array of dependencies but «${typeof args[0]}» was found instead on «ModulerV5.prototype.define»`);\n          this.assert(typeof args[1] === \"function\", `using define: if args.length is 2 then args[1] must be factory function but «${typeof args[1]}» was found instead on «ModulerV5.prototype.define»`);\n          dependencies = args[0];\n          factory = args[1];\n        } else {\n          throw new Error(`current arguments.length «${args.length}» is not supported`);\n        }\n      }\n      let dependencyPromises = undefined;\n      Resolve_dependencies: {\n        dependencyPromises = dependencies.map(dependency => this.mean(dependency));\n      }\n      Resolve_module: {\n        return this.callModuleFactory(dependencyPromises, factory);\n      }\n    }\n    mean(...args) {\n\n      let id = undefined;\n      let dependencies = [];\n      let callback = undefined;\n      Validate_and_format_parameters: {\n        if (args.length === 1) {\n          if (typeof args[0] === \"function\") {\n            callback = args[0];\n          } else if (Array.isArray(args[0])) {\n            return Promise.all(args[0].map(dependency => this.mean(dependency)));\n          } else {\n            this.assert(typeof args[0] === \"string\", `using mean: if args.length is 1 then args[0] must be id string or factory function but «${typeof args[0]}» was found instead on «ModulerV5.prototype.mean»`);\n            id = args[0];\n          }\n        } else if (args.length === 2) {\n          this.assert(Array.isArray(args[0]), `using mean: if args.length is 2 then args[0] must be dependencies array but «${typeof args[0]}» was found instead on «ModulerV5.prototype.mean»`);\n          this.assert(typeof args[1] === \"function\", `using mean: if args.length is 2 then args[1] must be factory function but «${typeof args[1]}» was found instead on «ModulerV5.prototype.mean»`);\n          dependencies = args[0];\n          callback = args[1];\n        } else {\n          throw new Error(`using mean: args.length must be between 1 and 2 but «${args.length}» was found instead on «ModulerV5.prototype.mean»`);\n        }\n      }\n      if (typeof callback === \"function\") {\n        Resolve_as_callback: {\n          const dependencyPromises = dependencies.map(dependency => this.mean(dependency));\n          return this.callModuleFactory(dependencyPromises, callback);\n        }\n      }\n      else if (typeof id === \"string\") {\n        Resolve_as_id: {\n          id = this.fullpathOf(id);\n          if (id in this.definitions) {\n            return this.definitions[id];\n          }\n          return this.importModule(id);\n        }\n      }\n      throw new Error(\"No, aquí no debería entrar, esta condición ya ha sido filtrada antes\");\n    }\n    cloneForFile(file) {\n      return ModulerV5.create(this, file + \"/..\");\n    }\n    cloneForDirectory(directory) {\n      return ModulerV5.create(this, directory);\n    }\n    callModuleFactory(dependencyPromises, factory, submoduler = null, filename = null, dirname = null) {\n      if (typeof filename === \"string\" && filename.endsWith(\".css\")) {\n        return this.css.add(filename);\n      }\n      const initialState = {};\n      const modulo = {\n        exports: initialState\n      };\n      return Promise.all(dependencyPromises).then(async resolvedDependencies => {\n        const output = await factory(resolvedDependencies, modulo, modulo.exports, submoduler ?? this, filename, dirname);\n        const returnsUndefined = typeof output === \"undefined\";\n        const isNotInitialState = modulo.exports !== initialState;\n        const hasNewProperties = 0 !== Object.keys(modulo.exports).length;\n        return modulo.exports = (returnsUndefined && (isNotInitialState || hasNewProperties) ? modulo.exports : output);\n      });\n    }\n  };\n\n  ModulerV5.Dictionary = new ModulerV5();\n\n  Promise.fromObject = function(obj) {\n    const allKeys = Object.keys(obj);\n    return Promise.all(Object.values(Object.values(obj))).then(output => {\n      let toObject = {};\n      for (let index = 0; index < output.length; index++) {\n        const item = output[index];\n        toObject[allKeys[index]] = item;\n      }\n      return toObject;\n    })\n  };\n\n  return ModulerV5;\n\n}.call());"
            }
          },
          "std": {}
        },
        "test": {
          "driven": {
            "current.js": "module.exports = async function() {\n  console.log(dev);\n  console.log(await dev.cli.tool([\"touch\"]));\n};"
          },
          "feature": {},
          "unit": {},
          "user": {}
        }
      };
      /**
       * @name DevToolkit.CommandLine.prototype.tool
       * @type class method
       * @parameter args:`Array<String>`- Indica la herramienta. Permite niveles. Cada nivel es concatenado con el caracter `/`, que luego es normalizado por `DevToolkit.prototype.fullpathOf`. Este parámetro pueden ser los `process.argv` que buscará donde terminan los argumentos posicionales y los tomará desde ahí automáticamente.
       * @returns any - Lo que devuelva la herramienta llamada.
       * @description Llama a la herramienta que esté guardada dentro de la raíz del proyecto, en `dev/cli/tool/{args.join("/")}
       */
      async tool(args = process.argv) {
        const _ = [];
        let pos = 0;
        Picking_positional:
          for (let index = 0; index < args.length; index++) {
            const arg = args[index];
            if (arg.startsWith("-") && !arg.includes(" ")) {
              pos = index;
              break Picking_positional;
            } else {
              _.push(arg);
            }
          }
        let filepath = null;
        // console.log(_);
        Determine_filepath: {
          filepath = this.toolkit.fullpathOf(`dev/cli/tool/${_.join("/")}/${_[_.length-1]}.js`);
        }
        try {
          const callback = require(filepath);
          return await callback.call(this.toolkit, {
            _,
            args
          });
        } catch (error) {
          console.error(error);
          throw error;
        }
      };
      /**
       * @name DevToolkit.CommandLine.prototype.createProject
       * @type class method
       * @returns true - Si todo ha ido bien.
       * @description Construye un proyecto que utiliza DevToolkit y ModulerV5 para modular js y css. Requiere que el directorio esté vacío. Este método obliga que el fichero `dev-toolkit.dist.js` esté con todo el contenido de la clase.
       */
      async createProject(targetDirectory) {
        const fs = require("fs");
        const targetFullpath = this.toolkit.fullpathOf(targetDirectory);
        const contents = await fs.promises.readdir(targetFullpath);
        this.toolkit.assert(contents.length === 0, `required directory «${targetFullpath}» to be empty to create project «DevToolkit.CommandLine.prototype.createProject»`);
        const output = JSON.parse(JSON.stringify(this.constructor.baseProject));
        output["src"]["lib"]["dev-toolkit"]["dev-toolkit.dist.js"] = await fs.promises.readFile(__filename, "utf8");
        await this.toolkit.constructor.FileSystem.fromObjectToDirectory(output, targetFullpath);
        return true;
      };
      /**
       * @name DevToolkit.CommandLine.prototype.buildJs
       * @not-finished
       */
      buildJs() {

      };
      /**
       * @name DevToolkit.CommandLine.prototype.buildCss
       * @not-finished
       */
      buildCss() {

      };
      /**
       * @name DevToolkit.CommandLine.prototype.buildTs
       * @not-finished
       */
      buildTs() {

      };
      /**
       * @name DevToolkit.CommandLine.prototype.testJs
       * @not-finished
       */
      testJs() {

      };
      /**
       * @name DevToolkit.CommandLine.prototype.loop
       * @not-finished
       */
      loop() {

      };
      /**
       * @name DevToolkit.CommandLine.prototype.up
       * @not-finished
       */
      up() {

      };
    };
    /**
     * @name DevToolkit.Testing
     * @type class
     * @description Clase con utilidades para testeo de DevToolkit.
     */
    static Testing = class Testing {
      /**
       * @name DevToolkit.Testing.Asserter
       * @type class
       * @description Clase con utilidades para aserciones.
       */
      static Asserter = class Asserter {
        /**
         * @name DevToolkit.Testing.Asserter.AssertionError
         * @type class
         * @extends Error
         * @description Subclase de `Error` que representa un fallo en aserción. 
         */
        static AssertionError = class AssertionError extends Error {
          constructor(...args) {
            super(...args);
            this.name = "AssertionError";
          }
        };
        static defaultOnSuccess() {}
        static defaultOnError(message) {
          throw new this.AssertionError(message);
        }
        static isDeepEqual(a, b) {
          // @BY-CHATGPT
          // @NOT-TESTED
          if (a === b) return true;
          if (a === null || b === null) return false;
          if (typeof a !== typeof b) return false;
          if (typeof a !== "object") return false;
          const aIsArray = Array.isArray(a);
          const bIsArray = Array.isArray(b);
          if (aIsArray !== bIsArray) return false;
          if (aIsArray) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
              if (!this.isDeepEqual(a[i], b[i])) return false;
            }
            return true;
          }
          const aKeys = Object.keys(a);
          const bKeys = Object.keys(b);
          if (aKeys.length !== bKeys.length) return false;
          for (const key of aKeys) {
            if (!Object.hasOwn(b, key)) return false;
            if (!this.isDeepEqual(a[key], b[key])) return false;
          }
          return true;
        }
        static createAssert(onSuccess = this.defaultOnSuccess, onError = this.defaultOnError, specificOutputs = {}) {
          const assert = function(condition, message = "no assertion message provided") {
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
            assertFileExists: function(file, message) {
              return DevToolkit.FileSystem.readFile(file, {
                inTry: true
              }).then(out => assert(typeof out === "string", message));
            },
            assertDirectoryExists: function(dir, message) {
              return DevToolkit.FileSystem.readDirectory(dir, {
                inTry: true
              }).then(out => assert(typeof out === "object", message));
            },
            assertFileContents: function(file, contents, message) {
              return DevToolkit.FileSystem.readFile(file, {
                inTry: true
              }).then(out => assert(out === contents, message));
            },
            assertFileMissing: function(file, message) {
              return DevToolkit.FileSystem.readFile(file, {
                inTry: true
              }).then(out => assert(typeof out !== "string", message));
            },
            assertDirectoryMissing: function(dir, message) {
              return DevToolkit.FileSystem.readDirectory(dir, {
                inTry: true
              }).then(out => assert(typeof out !== "object", message));
            },
            // Aserciones especiales:
            assertDeepEqual: (a, b, message) => {
              return assert(this.isDeepEqual(a, b), message);
            },
          };
        }
        static createLoggerAssert(options = {}) {
          const startTime = options.startTime || new Date();
          return this.createAssert(message => {
            console.log(DevToolkit.CommandLine.Colors.style("greenBright").text(`${options.prefix || ""} |  OK | ${(((new Date()) - startTime) + "").padStart(6)} | ${message}`));
          }, message => {
            console.log(DevToolkit.CommandLine.Colors.style("redBright,underline,bold").text(`${options.prefix || ""} | ERR | ${(((new Date()) - startTime) + "").padStart(6)} | ${message}`));
            if (options.bulletproof !== true) {
              throw new this.AssertionError(message);
            }
          }, {
            "1"(message) {
              console.log(DevToolkit.CommandLine.Colors.style("cyan,underline").text(`${options.prefix || ""} |  #  | ${(((new Date()) - startTime) + "").padStart(6)} | ${message}`));
            }
          });
        }
      }
      constructor(toolkit) {
        this.toolkit = toolkit;
      }
    };
    /**
     * @name DevToolkit.Events
     * @type class
     * @descrition Gestión de eventos de escucha de ficheros en tiempo de desarrollo de DevToolkit. Esta clase se encarga de los eventos que se tienen que encender cuando un fichero es guardado. Los eventos incluyen:
     * - compilar JavaScript o CSS
     * - pasar los tests
     * - generar distribuibles.
     */
    static Events = class Events {
      /**
       * @name DevToolkit.Events.constructor
       * @type class constructor
       * @parameter toolkit:DevToolkit - Instancia de DevToolkit. 
       * @sets this.toolkit - Con el parámetro proporcionado.
       * @description Construye una instancia.
       */
      constructor(toolkit) {
        this.toolkit = toolkit;
      }
      /**
       * @name DevToolkit.Events.prototype.touch
       * @parameter file:String - Fichero que se quiere hacer el touch.
       * @returns `Promise<void>` - No devuelve nada actualmente
       * @description Primero bloquea el semáforo, luego propaga el touch, el test, el distribute, y luego desbloquea el semáforo.
       */
      async touch(file) {
        Acquire_semaphore: {
          await this.toolkit.semaphore.acquire();
        }
        Make_propagations: {
          try {
            await this.propagateOnTouch(file);
            await this.propagateOnTest(file);
            await this.propagateOnDistribute(file);
          } catch (error) {
            DevToolkit.CommandLine.printError(error);
          }
        }
        Release_semaphore: {
          await this.toolkit.semaphore.release();
        }
      }
      /**
       * @name DevToolkit.Events.prototype.propagateOnTouch
       * @parameter file:String - Fichero del cual se quiere propagar el touch.
       * @returns `Promise<void>` - No devuelve nada actualmente.
       * @description Realiza la propagación de tipo Touch para un fichero dado.
       */
      async propagateOnTouch(file) {
        Propagate_on_touch: {
          const path = require("path");
          const subpath = this.toolkit.subpathOf(file);
          const parts = subpath.split("/").filter(part => part !== "");
          // Iteramos los directorios superiores del fichero touched hasta la raíz del toolkit:
          Iterating_directories: for (let index = parts.length - 1; index > -1; index--) {
            const subparts = parts.toSpliced(index);
            const touchedPath = this.toolkit.fullpathOf(subparts.join("/"));
            Trigger_by_entry: {
              const files = await DevToolkit.FileSystem.readDirectory(touchedPath, {
                inTry: true
              });
              for (let index = 0; index < files.length; index++) {
                const file = files[index];
                if (file.endsWith(".entry.js")) {
                  const entryPath = path.resolve(touchedPath, file);
                  DevToolkit.CommandLine.Colors.style("yellow").print("Found «*.entry.js» at: " + this.toolkit.subpathOf(entryPath));
                  const entryOutput = await this.toolkit.templating.tjs.renderFile(entryPath);
                  const distPath = path.resolve(entryPath.replace(/\.entry\.js$/g, ".dist.js"));
                  DevToolkit.CommandLine.Colors.style("yellow").print("Making «*.dist.js» at: " + this.toolkit.subpathOf(distPath));
                  await DevToolkit.FileSystem.writeFile(distPath, entryOutput, "utf8");
                }
              }
            }
            const triggableByOnTouch = path.resolve(`${touchedPath}/on-touch.js`);
            Trigger_by_onTouch:
              if (await DevToolkit.FileSystem.existsFile(triggableByOnTouch)) {
                DevToolkit.CommandLine.Colors.style("yellow").print("Found «on-touch.js» at: " + this.toolkit.subpathOf(triggableByOnTouch));
                const callback = require(triggableByOnTouch);
                if (typeof callback === "function") {
                  await callback.call(this.toolkit, file);
                }
              }
            const triggableByOnTest = path.resolve(`${touchedPath}/on-test.js`);
            Trigger_by_onTest:
              if (await DevToolkit.FileSystem.existsFile(triggableByOnTest)) {
                DevToolkit.CommandLine.Colors.style("yellow").print("Found «on-test.js» at: " + this.toolkit.subpathOf(triggableByOnTest));
                const callback = require(triggableByOnTest);
                if (typeof callback === "function") {
                  await callback.call(this.toolkit, file);
                }
              }
          }
        }
      }
      async propagateOnTest(file) {

      }
      async propagateOnDistribute(file) {

      }
    };
    /**
     * @name DevToolkit.Semaphore
     * @type class
     * @description Clase con utilidades para la gestión de semáforos de DevToolkit
     */
    static Semaphore = class Semaphore {
      /**
       * @name DevToolkit.Semaphore.constructor
       * @parameter toolkit:DevToolkit - Instancia de DevToolkit.
       * @parameter filename:String - Fichero usado como semáforo. Por defecto será `"semaphore.main.txt"`.
       * @sets this.toolkit:DevToolkit - Con el parámetro proporcionado. 
       * @sets this.filename:String - Con el parámetro proporcionado. Se refiere al fichero usado como semáforo por esta instancia.
       * @description Construye una instancia.
       */
      constructor(toolkit, filename = "semaphore.main.txt") {
        this.toolkit = toolkit;
        this.filename = filename;
      }
      /**
       * @name DevToolkit.Semaphore.prototype.setFilename
       * @parameter filename:String - Nuevo nombre (o subruta) de fichero.
       * @sets this.filename:String - Según el parámetro.
       * @returns void - No devuelve nada, es síncrono.
       * @description Solo cambia el nombre del fichero.
       */
      setFilename(filename) {
        this.filename = filename;
      }
      /**
       * @name DevToolkit.Semaphore.prototype.getFilepath
       * @type class method
       * @returns String - Ruta completa del fichero semáforo.
       * @description Devuelve la ruta completa del fichero usado como semáforo.
       */
      getFilepath() {
        return this.toolkit.fullpathOf(this.filename);
      }
      /**
       * @name DevToolkit.Semaphore.prototype.acquire
       * @type class method
       * @returns `Promise<void>` - No devuelve nada.
       * @description Bloquea el semáforo, o lanza un error si no está liberado. Si el error es que no existe el fichero, lo ignora y lo crea. El semáforo está desbloqueado si su contenido es `released`.
       */
      async acquire() {
        const fs = require("fs");
        const target = this.getFilepath();
        Reading_state: {
          try {
            const contents = await fs.promises.readFile(target, "utf8");
            if (contents !== "released") throw new Error(`cannot acquire semaphore because it is not released right now it is «${contents}»`);
          } catch (error) {
            if (error.code === "ENOENT") break Reading_state;
            throw error;
          }
        }
        await fs.promises.writeFile(target, "acquired", "utf8");
      }
      /**
       * @name DevToolkit.Semaphore.prototype.release
       * @returns `Promise<void>` - No devuelve nada, solo que usa fs.promises.writeFile y devuelve lo que este.
       * @description Escribe `"released"` en el fichero semáforo.
       */
      release() {
        return require("fs").promises.writeFile(this.getFilepath(), "released", "utf8");
      }
      /**
       * @name DevToolkit.Semaphore.prototype.destroy
       * @type class method
       * @throws Error - Lanza el error que se produzca por unlink, a no ser que fuera que el fichero no existía, en cuyo caso devuelve false solamente.
       * @returns `Promise<Boolean>` - Devuelve true si existía, false si no existía.
       * @description Elimina el fichero de semáforo.
       */
      async destroy() {
        const fs = require("fs");
        const target = this.getFilepath();
        try {
          await fs.promises.unlink(target);
          return true;
        } catch (error) {
          if (error.code === "ENOENT") return false;
          throw error;
        }
      }
    };
    /**
     * @name DevToolkit.FileWatcher
     * @type class
     * @description Clase con utilidades para la escucha de cambios en ficheros de DevToolkit
     */
    static FileWatcher = class FileWatcher {
      /**
       * @name DevToolkit.FileWatcher.Refrescador
       * @type class
       * @description Devuelve la instancia de refrescador. Presupone el fichero `__dirname + "/refrescador.api.dist.js"`. Esta API está documentada en [https://github.com/allnulled/refrescador](https://github.com/allnulled/refrescador).
       */
      static Refrescador = require(__dirname + "/refrescador.api.dist.js");
      /**
       * @name DevToolkit.FileWatcher.start
       * @type static method
       * @parameter options:Object - Opciones que se le pasarán al refrescador.
       * @description Llama al `run` del refrescador.
       */
      static start(options) {
        return this.Refrescador.run(options);
      }
    };
    /**
     * @name DevToolkit.FileSystem
     * @type class
     * @description Clase con utilidades para gestión del sistema de ficheros y carpetas.
     */
    static FileSystem = class FileSystem {
      /**
       * @name DevToolkit.FileSystem.exists
       * @type static method
       * @parameter dir:String - Fichero o directorio absoluto
       * @returns `Promise<Object|false>` - Lo mismo que fs.promises.lstat. Si falla, silencia el error y devuelve false.
       * @description Comprueba si un fichero o directorio vive en la ruta proporcionada.
       */
      static exists(file) {
        return require("fs").promises.lstat(file).catch(error => false);
      }
      /**
       * @name DevToolkit.FileSystem.existsDirectory
       * @type static method
       * @parameter file:String - Ficero absoluto
       * @returns `Promise<Boolean>` - Devuelve true si es un fichero, false en cualquier otro caso.
       * @description Comprueba si un fichero vive en la ruta proporcionada.
       */
      static existsFile(file) {
        return require("fs").promises.lstat(file).then(lstat => {
          return lstat.isFile();
        }).catch(error => false);
      }
      /**
       * @name DevToolkit.FileSystem.readFile
       * @type static method
       * @parameter dir:String - Fichero absoluto
       * @parameter options:Object - Opciones. Ahora mismo solo permite `inTry:Boolean=false`, que en `true` silenciará el error, y devolverá `false`.
       * @returns `Promise<String>` - El contenido de un fichero en utf8.
       * @description Devuelve el contenido de un fichero.
       */
      static readFile(file, inTry = false) {
        if (inTry) {
          return require("fs").promises.readFile(file, "utf8").catch(error => false);
        }
        return require("fs").promises.readFile(file, "utf8");
      }
      /**
       * @name DevToolkit.FileSystem.writeFile
       * @type static method
       * @parameter file:String - Fichero absoluto
       * @parameter contents:String - Contenido con el que sobreescribir
       * @parameter options:Object - Opciones pasadas. Ahora mismo no admite nada.
       * @returns `Promise<void>` - Devuelve lo mismo que fs.promises.writeFile
       * @description Sobreescribe un fichero con el contenido especificado.
       */
      static writeFile(file, contents, options = {
        recursive: false
      }) {
        if (options.recursive) throw new Error("operation not supported yet: writeFile + recursive=true");
        return require("fs").promises.writeFile(file, contents);
      }
      /**
       * @name DevToolkit.FileSystem.deleteFile
       * @type static method
       * @parameter dir:String - Fichero absoluto
       * @parameter options:Object - Opciones. Ahora mismo solo acepta `inTry:Boolean=false`, que en `true` falla silenciosamente.
       * @returns `Promise<void>` - Lo mismo que fs.promises.unlink
       * @description Elimina un directorio, recursivamente.
       */
      static deleteFile(file, options = {
        inTry: false
      }) {
        if (options.inTry) {
          require("fs").promises.unlink(file).catch(error => false);
        }
        return require("fs").promises.unlink(file);
      }
      /**
       * @name DevToolkit.FileSystem.existsDirectory
       * @type static method
       * @parameter dir:String - Directorio absoluto
       * @returns `Promise<Boolean>` - Devuelve true si es un directorio, false en cualquier otro caso.
       * @description Comprueba si un directorio vive en la ruta proporcionada.
       */
      static existsDirectory(dir) {
        return require("fs").promises.lstat(dir).then(lstat => {
          return lstat.isDirectory();
        }).catch(error => false);
      }
      /**
       * @name DevToolkit.FileSystem.readDirectory
       * @type static method
       * @parameter dir:String - Directorio absoluto
       * @parameter options:Object - Opciones. Ahora mismo solo permite `inTry:Boolean=false`, que en `true` silenciará el error, y devolverá `false`.
       * @returns `Promise<Array<String>>` - Los ficheros y directorios contenidos dentro.
       * @description Devuelve los contenidos de un directorio.
       */
      static readDirectory(dir, options = {
        inTry: false
      }) {
        if (options.inTry) {
          return require("fs").promises.readdir(dir).catch(error => false);
        }
        return require("fs").promises.readdir(dir);
      }
      /**
       * @name DevToolkit.FileSystem.writeDirectory
       * @type static method
       * @parameter dir:String - Directorio absoluto
       * @returns `Promise<void>` - Devuelve lo mismo que fs.promises.mkdir
       * @description Construye un directorio
       */
      static writeDirectory(dir, options = {
        recursive: false
      }) {
        return require("fs").promises.mkdir(dir, options);
      }
      /**
       * @name DevToolkit.FileSystem.deleteDirectory
       * @type static method
       * @parameter dir:String - Directorio absoluto
       * @parameter options:Object - Opciones. Ahora mismo solo acepta `inTry:Boolean=false`, que en `true` falla silenciosamente.
       * @returns `Promise<void>` - Lo mismo que fs.promises.rm
       * @description Elimina un directorio, recursivamente.
       */
      static deleteDirectory(dir, options = {
        inTry: false
      }) {
        if (options.inTry) {
          return require("fs").promises.rm(dir, {
            recursive: true
          }).catch(error => false);
        }
        return require("fs").promises.rm(dir, {
          recursive: true
        });
      }
      /**
       * @name DevToolkit.FileSystem.emptyDirectory
       * @type static method
       * @parameter dir:String - Directorio absoluto
       * @parameter options:Object - Opciones. Ahora mismo solo acepta `inTry:Boolean=false`, que en `true` falla silenciosamente.
       * @returns `Promise<void>` - Lo mismo que fs.promises.mkdir
       * @description Elimina un directorio recursivamente, y luego lo crea, lo cual al final es como haberlo vaciado.
       */
      static async emptyDirectory(dir) {
        return await require("fs").promises.rm(dir, {
          recursive: true,
          force: true,
        }).then(() => {
          return require("fs").promises.mkdir(dir, {
            recursive: false
          });
        });
      }
      /**
       * @name DevToolkit.FileSystem.fromDirectoryToObject
       * @type class method
       * @parameter dir:String - Directorio absoluto.
       * @parameter options:Object - Opciones. Admite un `filter:Function<fsnode:String>:Boolean` para usar como filtro y discriminar qué partes del directorio no quieres incluir en la representación. Esto puede ser útil si quieres que 1 fichero contenga la representación final de la estructura del directorio, y así evitas que la representación objetual se haga incremental.
       * @returns `Promise<Object>` - Representación objetual del directorio proporcionado.
       * @description Construye la representación objetual de un directorio.
       */
      static async fromDirectoryToObject(dir, options = {}) {
        const entries = await fs.promises.readdir(dir, {
          withFileTypes: true
        });
        const result = {};
        Iterating_entries:
          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (typeof options.filter === "function") {
              if (!options.filter(fullPath, entry)) {
                continue Iterating_entries;
              }
            }
            if (entry.isDirectory()) {
              result[entry.name] = await fromDirectoryToObject(fullPath, options);
            } else {
              result[entry.name] = await fs.promises.readFile(fullPath, "utf8");
            }
          }
        return result;
      }
      /**
       * @name DevToolkit.FileSystem.prototype.fromObjectToDirectory
       * @type class method
       * @parameter obj:Object - Representación objetual de un directorio.
       * @parameter dir:String - Directorio raíz donde se quiere reconstruir la representación objetual
       * @returns `Promise<void>`
       * @description Reconstruye un directorio a partir de una representación objetual de directorio, y el directorio raíz.
       * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
       */
      static async fromObjectToDirectory(obj, dir) {
        const fs = require("fs/promises");
        const path = require("path");
        const tasks = [];
        for (const [name, value] of Object.entries(obj)) {
          const fullPath = path.join(dir, name);
          if (typeof value === "string") {
            tasks.push(fs.writeFile(fullPath, value));
          } else {
            tasks.push(
              (async () => {
                await fs.mkdir(fullPath, {
                  recursive: true
                });
                await this.fromObjectToDirectory(value, fullPath);
              })()
            );
          }
        }
        await Promise.all(tasks);
      }
      /**
       * @name DevToolkit.FileSystem.sizeOf
       * @type static method
       * @parameter dir:String - Fichero absoluto
       * @returns `Promise<Integer>` - El tamaño de un fichero o directorio
       * @description Devuelve el tamaño de un fichero o directorio
       */
      static sizeOf(file) {
        return require("fs").promises.lstat(file).then(lstat => lstat.size);
      }
      /**
       * @name DevToolkit.FileSystem.constructor
       * @type class constructor
       * @sets toolkit:DevToolkit
       * @description Construye una instancia.
       */
      constructor(toolkit) {
        this.toolkit = toolkit;
      }
      /**
       * @name DevToolkit.FileSystem.prototype.exists
       * @type class method
       * @parameter file:String - Fichero o directorio, puede ser relativo.
       * @returns `Promise<Boolean>`
       * @description Dice si existe un fichero o directorio en la ruta proporcionada
       * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
       */
      exists(file, ...args) {
        return this.constructor.exists(this.toolkit.fullpathOf(file), ...args);
      }
      /**
       * @name DevToolkit.FileSystem.prototype.existsFile
       * @type class method
       * @parameter file:String - Fichero, puede ser relativo.
       * @returns `Promise<Boolean>`
       * @description Dice si existe un fichero (no directorio) en la ruta proporcionada
       * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
       */
      existsFile(file, ...args) {
        return this.constructor.existsFile(this.toolkit.fullpathOf(file), ...args);
      }
      /**
       * @name DevToolkit.FileSystem.prototype.readDirectory
       * @type class method
       * @parameter file:String - Fichero, puede ser relativo.
       * @returns `Promise<Array<String>>`
       * @description Lee un fichero y devuelve su contenido en utf8
       * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
       */
      readFile(file, ...args) {
        return this.constructor.readFile(this.toolkit.fullpathOf(file), ...args);
      }
      /**
       * @name DevToolkit.FileSystem.prototype.writeFile
       * @type class method
       * @parameter file:String - Fichero, puede ser relativo.
       * @parameter contents:String - Contenido del fichero
       * @returns `Promise<void>`
       * @description Sobreescribe un fichero con fs.promises.writeFile
       * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
       */
      writeFile(file, ...args) {
        return this.constructor.writeFile(this.toolkit.fullpathOf(file), ...args);
      }
      /**
       * @name DevToolkit.FileSystem.prototype.deleteFile
       * @type class method
       * @parameter file:String - Fichero
       * @parameter options:Object - Opciones pasadas a su homólogo estático.
       * @returns `Promise<void>`
       * @description Elimina un fichero.
       * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
       */
      deleteFile(file, ...args) {
        return this.constructor.deleteFile(this.toolkit.fullpathOf(file), ...args);
      }
      /**
       * @name DevToolkit.FileSystem.prototype.existsDirectory
       * @type class method
       * @parameter dir:String - Directorio, puede ser relativo.
       * @returns `Promise<Boolean>`
       * @description Dice si existe un directorio en la ruta proporcionada
       * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
       */
      existsDirectory(dir, ...args) {
        return this.constructor.existsDirectory(this.toolkit.fullpathOf(dir), ...args);
      }
      /**
       * @name DevToolkit.FileSystem.prototype.readDirectory
       * @type class method
       * @parameter dir:String - Directorio, puede ser relativo.
       * @returns `Promise<Array<String>>`
       * @description Lee un directorio y devuelve sus rutas
       * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
       */
      readDirectory(dir, ...args) {
        return this.constructor.readDirectory(this.toolkit.fullpathOf(dir), ...args);
      }
      /**
       * @name DevToolkit.FileSystem.prototype.writeDirectory
       * @type class method
       * @parameter file:String - Directorio, puede ser relativo.
       * @returns `Promise<void>`
       * @description Crea un directorio con fs.promises.mkdir
       * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
       */
      writeDirectory(file, ...args) {
        return this.constructor.writeDirectory(this.toolkit.fullpathOf(file), ...args);
      }
      /**
       * @name DevToolkit.FileSystem.prototype.deleteDirectory
       * @type class method
       * @parameter dir:String - Directorio
       * @parameter options:Object - Opciones pasadas a su homólogo estático.
       * @returns `Promise<void>`
       * @description Elimina un directorio.
       * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
       */
      deleteDirectory(file, ...args) {
        return this.constructor.deleteDirectory(this.toolkit.fullpathOf(file), ...args);
      }
      /**
       * @name DevToolkit.FileSystem.prototype.emptyDirectory
       * @type class method
       * @returns `Promise<void>`
       * @description Vacía un directorio pero no lo elimina.
       * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
       */
      emptyDirectory(file, ...args) {
        return this.constructor.emptyDirectory(this.toolkit.fullpathOf(file), ...args);
      }
      /**
       * @name DevToolkit.FileSystem.prototype.fromDirectoryToObject
       * @type class method
       * @parameter file:String - Directorio, puede ser relativo.
       * @returns `Promise<Object>`
       * @description Construye la representación objetual de un directorio.
       * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
       */
      fromDirectoryToObject(file, ...args) {
        return this.constructor.fromDirectoryToObject(this.toolkit.fullpathOf(file), ...args);
      }
      /**
       * @name DevToolkit.FileSystem.prototype.fromObjectToDirectory
       * @type class method
       * @parameter obj:Object - Representación objetual de un directorio.
       * @parameter dir:String - Directorio raíz donde se quiere reconstruir la representación objetual
       * @returns `Promise<void>`
       * @description Reconstruye un directorio a partir de una representación objetual de directorio, y el directorio raíz.
       * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
       */
      fromObjectToDirectory(obj, dir) {
        return this.constructor.fromObjectToDirectory(obj, this.toolkit.fullpathOf(dir));
      }
      /**
       * @name DevToolkit.FileSystem.prototype.sizeOf
       * @type class method
       * @parameter file:String - fichero, puede ser relativo.
       * @returns `Promise<Integer>` - El size que devuelve el lstat de node.js
       * @description Lee el lstat del fichero y devuelve el resultado.
       * @differences Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.
       */
      sizeOf(file, ...args) {
        return this.constructor.sizeOf(this.toolkit.fullpathOf(file), ...args);
      }
    };
    /**
     * @name DevToolkit.Templating
     * @type class
     * @description Utilidades para plantillas de texto de DevToolkit
     */
    static Templating = class Templating {
      /**
       * @name DevToolkit.Templating.Tjs
       * @type static class
       * @description Es la clase que gestiona las plantillas de "templated-js". Está documentada aquí: [https://github.com/allnulled/templated-js](https://github.com/allnulled/templated-js). Puede tener ligeras variaciones, como el hack en `include` e `includeSync` que fabrica el fichero si no lo encuentra.
       */
      static Tjs = require("./tjs.js");
      /**
       * @name DevToolkit.Templating.constructor
       * @type class constructor
       * @parameter toolkit:DevToolkit - Instancia de DevToolkit.
       * @sets this.toolkit:DevToolkit - Con el parámetro proporcionado.
       * @sets this.tjs:Tjs - Instancia de [Tjs](https://github.com/allnulled/templated-js) que ya conoce el `this.toolkit.basedir` y permite rutas relativas
       * @description Construye un gestor de plantillas para DevToolkit. Utiliza [Tjs](https://github.com/allnulled/templated-js)
       */
      constructor(toolkit) {
        this.toolkit = toolkit;
        this.tjs = this.constructor.Tjs.create(this.toolkit.basedir);
      }
    };
    /**
     * @name DevToolkit.Time
     * @type class
     * @description Clase con utilidades para tiempo.
     * 
     */
    static Time = class Time {
      static timeout(ms) {
        return require("timers/promises").setTimeout(ms);
      }
    };
    /**
     * @name DevToolkit.constructor
     * @type class constructor
     * @parameter basedir:String - Ruta raíz de proyecto para la instancia. Por defecto, se utiliza el `process.cwd()`.
     * @sets this.basedir:String - Ruta raíz. Se construye con `path.resolve` y el parámetro `basedir`
     * @sets this.fileSystem:DevToolkit.FileSystem - Utilidades para sistema de ficheros
     * @sets this.cli:DevToolkit.CommandLine - Utilidades para línea de comandos
     * @sets this.documentator:DevToolkit.Documentator - Utilidades para documentación
     * @sets this.testing:DevToolkit.Testing - Utilidades para testeo
     * @sets this.templating:DevToolkit.Templating - Utilidades para plantillas
     * @sets this.events:DevToolkit.Events - Utilidades para eventos de la escucha a cambios en ficheros
     * @sets this.semaphore:DevToolkit.Semaphore - Utilidades para semáforos. Presupone el fichero `semaphore.dev-toolkit.txt` para la gestión del semáforo.
     * @sets this.assert:DevToolkit.Assert - Utilidades para aserciones
     * @description En la construcción de DevToolkit se establecen las propiedades. En general, lo que consigues creando estas instancias es facilitar que los métodos de ellas conozcan la ruta raíz del proyecto, y así no tener que estar combinándolas con `DevToolkit.prototype.fullpathOf` manualmente en cada caso.
     */
    constructor(basedir = process.cwd()) {
      this.basedir = require("path").resolve(basedir);
      this.fileSystem = new this.constructor.FileSystem(this);
      this.cli = new this.constructor.CommandLine(this);
      this.documentator = new this.constructor.Documentator(this);
      this.testing = new this.constructor.Testing(this);
      this.templating = new this.constructor.Templating(this);
      this.events = new this.constructor.Events(this);
      this.semaphore = new this.constructor.Semaphore(this, "semaphore.dev-toolkit.txt");
      this.assert = this.constructor.Testing.Asserter.createAssert().assert;
    }
    /**
     * @name DevToolkit.prototype.fullpathOf
     * @type class method
     * @parameter subpath:String - ruta relativa al `DevToolkit.prototype.basedir`
     * @returns String - ruta completa resultante. 
     * @description Reconstruye la ruta completa a partir de una ruta relativa. Utiliza `path.resolve` con el `this.basedir`.
     */
    fullpathOf(subpath) {
      return require("path").resolve(this.basedir, subpath);
    }
    /**
     * @name DevToolkit.prototype.subpathOf
     * @type class
     * @parameter absolutePath:String - ruta relativa al `DevToolkit.prototype.basedir`
     * @returns String - ruta relativa resultante. 
     * @throws Error - Si la proporcionada no es una ruta relativa al `this.basedir`, lanza un error con `Provided file is not a subpath of...`.
     * @description Se asegura que la ruta absoluta proporcionada es relativa al `this.basedir`, y devuelve la ruta relativa resultante.
     */
    subpathOf(absolutePath) {
      if (!absolutePath.startsWith(this.basedir + "/")) throw new Error(`Provided file is not a subpath of «${this.toolkit.basedir}»`);
      return absolutePath.replace(this.basedir + "/", "");
    }
  };
}.call());