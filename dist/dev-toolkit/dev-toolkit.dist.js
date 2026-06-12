(function(mod) {
 if (typeof window !== 'undefined') window['DevToolkit'] = mod;
 if (typeof global !== 'undefined') global['DevToolkit'] = mod;
 if (typeof module !== 'undefined') module.exports = mod;
})(function() {
 const Tracer = class Tracer {
  static createTracer(prefix, firstMessage = false, isTracing = true) {
   let callback = undefined;
   callback = function(method, args = [], debugLevel = 0) {
    if (callback.isTracing === true) {
     console.log(DevToolkit.CommandLine.Colors.style("cyan").text(`[Trace:${prefix}.${method}]`) + ` ${Tracer.inspectToString(args, debugLevel)}`);
    }
    return callback;
   };
   callback.isTracing = isTracing;
   if (firstMessage) callback(firstMessage);
   return callback;
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
 };
 return class DevToolkit {
  static Tracer = Tracer;
  static Utils = class Utils {
   static die(...args) {
    console.log(...args);
    process.exit(1);
   }
  };
  static Debug = class Debug {
   static die(...args) {
    console.log(...args);
    process.exit(0);
   }
  };
  static Documentator = class Documentator {
   constructor(toolkit) {
    this.trace = Tracer.createTracer("DevToolkit.Events", "constructor");
    this.toolkit = toolkit;
   }
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
   async extractJavadocCommentsFromDirectory(dir = this.toolkit.basedir) {
    this.trace("extractJavadocCommentsFromDirectory", arguments);
    const inputFiles = await this._findFiles(require("path").resolve(dir, "**/*.js"));
    const allJavadocComments = {};
    for (let index = 0; index < inputFiles.length; index++) {
     const file = inputFiles[index];
     const content = await require("fs").promises.readFile(file, "utf8");
     const comments = this.extractJavadocCommentsFromString(content);
     if (comments.length) {
      allJavadocComments[file] = comments;
     }
    }
    return allJavadocComments;
   }
   extractJavadocCommentsFromString(text) {
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
  };
  static CommandLine = class CommandLine {
   static Colors = require(__dirname + "/refrescador.api.dist.js").colors;
   static printError(error) {
    console.log(DevToolkit.CommandLine.Colors.style("redBright,bold").text(DevToolkit.CommandLine.Colors.box(`${error.name}: ${error.message}`)), "\n", error);
   };
   constructor(toolkit) {
    this.trace = Tracer.createTracer("DevToolkit.Events", "constructor");
    this.toolkit = toolkit;
   };
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
        "export-as-callback.js": "module.exports = async function (file) {\n  const fs = require(\"fs\");\n  console.log(file);\n  const path = require(\"path\");\n  const rootDir = path.resolve(`${__dirname}/../../../..`);\n  const outputDir = path.resolve(`${__dirname}/../../../../../moduler-v4/src/DevToolkit/CommandLine/blank-project`);\n  const contents = await fs.promises.readdir(outputDir);\n  const isDir = () => fs.promises.lstat(outputDir).then(lstat => lstat.isDirectory()).catch(error => false);\n  const assert = (condition, message) => { if (!condition) throw new Error(message); };\n  assert(await isDir(outputDir), `Could not find output directory: ${outputDir}`);\n  assert(await isDir(rootDir), `Could not find root directory: ${rootDir}`);\n  const fromDirectoryToObject = async function (dir, options = {}) {\n    const entries = await fs.promises.readdir(dir, {\n      withFileTypes: true\n    });\n    const result = {};\n    Iterating_entries:\n    for (const entry of entries) {\n      const fullPath = path.join(dir, entry.name);\n      if (typeof options.filter === \"function\") {\n        if (!options.filter(fullPath, entry)) {\n          continue Iterating_entries;\n        }\n      }\n      if (entry.isDirectory()) {\n        result[entry.name] = await fromDirectoryToObject(fullPath, options);\n      } else {\n        result[entry.name] = await fs.promises.readFile(fullPath, \"utf8\");\n      }\n    }\n    return result;\n  };\n  const summary = await fromDirectoryToObject(rootDir, {\n    filter(file, lstat) {\n      return !file.includes(\"node_modules\") && !file.includes(\"dev-toolkit.dist.js\") && !file.includes(\"package-lock.json\");\n    }\n  });\n  console.log(summary);\n  // summary[\"src\"][\"lib\"][\"dev-toolkit\"][\"dev-toolkit.dist.js\"] = await fs.promises.readFile(`${rootDir}/src/lib/dev-toolkit/dev-toolkit.dist.js`, \"utf8\");\n  await fs.promises.writeFile(path.resolve(outputDir, \"blank-project.json\"), JSON.stringify(summary, null, 2), \"utf8\");\n  \n};",
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
       "moduler-v5.dist.js": "(function(mod) {\n if (typeof window !== 'undefined') window['ModulerV5'] = mod;\n if (typeof global !== 'undefined') global['ModulerV5'] = mod;\n if (typeof module !== 'undefined') module.exports = mod;\n})(function() {\n\n const ModulerV5 = class {\n  static CssModuler = class CssModuler {\n   static create(...args) {\n    return new this(...args);\n   }\n   static fakeCssStyleSheet() {\n    return new class FakeCssStyleSheet {\n     isFake = true;\n     replace(...args) {\n      // console.log(\"in node.js this does nothing\", args)\n     }\n    }();\n   }\n   static symbols = {\n    REQUIRES_REGEX: /(\\/\\*\\@requires\\:((?!\\*\\/).)+\\*\\/)+(\\r|\\t|\\n| )?/g\n   };\n   constructor(moduler) {\n    this.moduler = moduler;\n    this.sheets = {};\n    this.entry = typeof CSSStyleSheet === \"function\" ? new CSSStyleSheet() : this.constructor.fakeCssStyleSheet();\n    if (!this.entry.isFake) {\n     document.adoptedStyleSheets.push(this.entry);\n    }\n   }\n   assert(condition, message) {\n    if (!condition) throw new Error(\"AssertionError in CssModuler: \" + message);\n   }\n   async add(input1 = null, eventToAdd = {\n    newSheets: {},\n    oldSheets: {},\n    count: 0\n   }) {\n    this.assert(typeof input1 === \"string\", \"on CssModuler.prototype.add: arguments[0] must be string\");\n    const id = this.moduler.fullpathOf(input1);\n    if (id in this.sheets) {\n     if (!(id in eventToAdd.oldSheets)) {\n      eventToAdd.oldSheets = [];\n     }\n     eventToAdd.oldSheets[id].push(eventToAdd.count++);\n    } else {\n     const source = await this.moduler.readPath(id);\n     const allRequires = source.match(this.constructor.symbols.REQUIRES_REGEX);\n     const submoduler = this.moduler.cloneForFile(id);\n     const requires = !allRequires ? [] : allRequires.map(match => {\n      const subpath = match.substr(\"/*@requires:\".length).trim().slice(0, -2).trim();\n      return submoduler.fullpathOf(subpath);\n     });\n     const moduloCss = {\n      id,\n      source,\n      requires\n     };\n     this.sheets[id] = moduloCss;\n     eventToAdd.newSheets[id] = eventToAdd.count++;\n     for (let index = 0; index < requires.length; index++) {\n      const subid = requires[index];\n      await this.add(subid, eventToAdd);\n     }\n    }\n    return eventToAdd;\n   }\n   _sortSheets(eventToSync) {\n    const dependencies = [];\n    const visited = new Set();\n    const visit = (sheetId) => {\n     if (visited.has(sheetId)) {\n      return;\n     }\n     visited.add(sheetId);\n     const sheet = this.sheets[sheetId];\n     if (!sheet) {\n      return;\n     }\n     for (const dependencyId of sheet.requires) {\n      visit(dependencyId);\n     }\n     dependencies.push(sheet);\n    };\n    for (const sheetId in this.sheets) {\n     visit(sheetId);\n    }\n    eventToSync.dependencies = dependencies;\n    eventToSync.counter = dependencies.length;\n   }\n   _generateSource(eventToSync) {\n    let css = \"\";\n    for (let index = 0; index < eventToSync.dependencies.length; index++) {\n     const dependency = eventToSync.dependencies[index];\n     css += `/*!original:${this.moduler.relpathOf(dependency.id)}*/\\n`;\n     css += `/*!order:${index+1}*/\\n`;\n     css += `${dependency.source.replace(this.constructor.symbols.REQUIRES_REGEX, match => \"/*!\" + match.substr(3))}\\n\\n`;\n    }\n    eventToSync.source = css;\n   }\n   async _synchronizeSource(eventToSync) {\n    // @BROWSER pero polifileado:\n    await this.entry.replace(eventToSync.source);\n   }\n   async _exportSource(eventToSync, options) {\n    if (options.outFile) {\n     await require(\"fs\").promises.writeFile(this.moduler.fullpathOf(outFile), eventToSync.source, \"utf8\");\n    }\n   }\n   remove(input1) {\n    const id = this.moduler.fullpathOf(input1);\n    this.assert(id in this.sheets, \"cannot remove sheet because it is not added: \" + id);\n    delete this.sheets[id];\n    return this;\n   }\n   async synchronize(options = {\n    outFile: false\n   }) {\n    const eventToSync = {\n     counter: 0,\n     dependencies: [],\n    };\n    await this._sortSheets(eventToSync, options);\n    await this._generateSource(eventToSync, options);\n    await this._synchronizeSource(eventToSync, options);\n    await this._exportSource(eventToSync, options);\n    return eventToSync;\n   }\n  };\n  static InjectionParser = class InjectionParser {\n   static TOKENS = [\n    \"/* @inject.source(\",\n    \"/* @inject.source.string(\",\n    \"/* @inject.template(\",\n    \"/* @inject.template.string(\",\n    \"/* @inject.module(\",\n    \"// @inject.source(\",\n    \"// @inject.source.string(\",\n    \"// @inject.template(\",\n    \"// @inject.template.string(\",\n    \"// @inject.module(\",\n    \"inject.source(\",\n    \"inject.source.string(\",\n    \"inject.template(\",\n    \"inject.template.string(\",\n    \"inject.module(\",\n   ];\n   static create(code) {\n    return new this(code);\n   }\n   constructor(code) {\n    this.code = code;\n    this.i = 0;\n   }\n   parse() {\n    const results = [];\n    this.i = 0;\n    while (!this.eof()) {\n     const tokenInfo = this.findNextToken();\n     if (!tokenInfo) {\n      break;\n     }\n     const {\n      token,\n      start\n     } = tokenInfo;\n     this.i = start + token.length;\n     const tokenStart = start;\n     this.skipSpaces();\n     const path = this.parseString();\n     this.skipSpaces();\n     let options = null;\n     if (this.peek() === \",\") {\n      this.next();\n      this.skipSpaces();\n      options = this.parseBalanced();\n     }\n     this.skipSpaces();\n     if (this.peek() === \")\") {\n      this.next();\n     }\n     // cerrar comentario multilinea\n     this.skipSpaces();\n     if (\n      token.startsWith(\"/*\") &&\n      this.code.slice(this.i, this.i + 2) === \"*/\"\n     ) {\n      this.i += 2;\n      Linter_bypassers: {\n       if (this.code.slice(this.i, this.i + 1) === \"0\") {\n        this.i += 1;\n       }\n       if (this.code.slice(this.i, this.i + 1) === \"nulo\") {\n        this.i += 4;\n       }\n      }\n     }\n     const tokenEnd = this.i;\n     const raw = this.code.slice(tokenStart, tokenEnd);\n     const cleanStart = raw.replace(/^((\\/\\/)|(\\/\\*))( )*(\\@)?/g, \"\");\n     results.push({\n      path,\n      options,\n      method: cleanStart.substr(0, cleanStart.indexOf(\"(\")),\n      start: tokenStart,\n      end: tokenEnd,\n      raw: raw,\n     });\n    }\n    return results;\n   }\n   // =====================================================\n   // TOKEN SEARCH\n   // =====================================================\n   findNextToken() {\n    let bestIndex = Infinity;\n    let bestToken = null;\n    for (const token of this.constructor.TOKENS) {\n     const idx = this.code.indexOf(token, this.i);\n     if (idx !== -1 && idx < bestIndex) {\n      bestIndex = idx;\n      bestToken = token;\n     }\n    }\n    if (bestToken === null) {\n     return null;\n    }\n    return {\n     token: bestToken,\n     start: bestIndex\n    };\n   }\n   // =====================================================\n   // CORE\n   // =====================================================\n   eof() {\n    return this.i >= this.code.length;\n   }\n   peek(offset = 0) {\n    return this.code[this.i + offset];\n   }\n   next() {\n    return this.code[this.i++];\n   }\n   skipSpaces() {\n    while (\n     !this.eof() &&\n     /\\s/.test(this.peek())\n    ) {\n     this.i++;\n    }\n   }\n   // =====================================================\n   // STRING\n   // =====================================================\n   parseString() {\n    const quote = this.peek();\n    if (\n     quote !== '\"' &&\n     quote !== \"'\" &&\n     quote !== \"`\"\n    ) {\n     throw new Error(`Expected string at ${this.i}`);\n    }\n    this.next();\n    let result = \"\";\n    while (!this.eof()) {\n     const c = this.next();\n     // escape\n     if (c === \"\\\\\") {\n      result += c;\n      if (!this.eof()) {\n       result += this.next();\n      }\n      continue;\n     }\n     // close\n     if (c === quote) {\n      return result;\n     }\n     result += c;\n    }\n    throw new Error(\"Unexpected EOF while parsing string\");\n   }\n   // =====================================================\n   // BALANCED\n   // =====================================================\n   parseBalanced() {\n    const start = this.peek();\n    if (!\"([{\".includes(start)) {\n     throw new Error(`Expected balanced structure at ${this.i}`);\n    }\n    const stack = [start];\n    let result = this.next();\n    while (!this.eof()) {\n     const c = this.next();\n     result += c;\n     // ==========================================\n     // STRING MODE\n     // ==========================================\n     if (\n      c === '\"' ||\n      c === \"'\" ||\n      c === \"`\"\n     ) {\n      result += this.consumeString(c);\n      continue;\n     }\n     // ==========================================\n     // OPEN\n     // ==========================================\n     if (\n      c === \"(\" ||\n      c === \"[\" ||\n      c === \"{\"\n     ) {\n      stack.push(c);\n      continue;\n     }\n     // ==========================================\n     // CLOSE\n     // ==========================================\n     if (\n      c === \")\" ||\n      c === \"]\" ||\n      c === \"}\"\n     ) {\n      const last =\n       stack[stack.length - 1];\n      if (!this.matches(last, c)) {\n       throw new Error(`Unexpected closing token \"${c}\" at ${this.i}`);\n      }\n      stack.pop();\n      if (stack.length === 0) {\n       return result;\n      }\n     }\n    }\n    throw new Error(\"Unexpected EOF while parsing balanced structure\");\n   }\n   consumeString(quote) {\n    let result = \"\";\n    while (!this.eof()) {\n     const c = this.next();\n     result += c;\n     if (c === \"\\\\\") {\n      if (!this.eof()) {\n       result += this.next();\n      }\n      continue;\n     }\n     if (c === quote) {\n      return result;\n     }\n    }\n    throw new Error(\"Unexpected EOF inside string\");\n   }\n   matches(open, close) {\n    return (\n     (open === \"(\" && close === \")\") ||\n     (open === \"[\" && close === \"]\") || (open === \"{\" && close === \"}\"));\n   }\n  };\n  static create(...args) {\n   return new this(...args);\n  }\n  constructor(...args) {\n   this.isBrowser = typeof window !== \"undefined\";\n   let input1 = null;\n   let input2 = null;\n   Step_1_Receive_arguments: {\n    if (args.length === 0) {\n     input1 = null;\n     input2 = null;\n    } else if (args.length === 1) {\n     input1 = args[0] || null;\n     input2 = null;\n    } else if (args.length === 2) {\n     input1 = args[0] || null;\n     input2 = args[1];\n    } else {\n     throw new Error(\"on «ModulerV5.constructor»: parameter «arguments.length» must be between 0-2\");\n    }\n   }\n   let rootdir = null;\n   let basedir = null;\n   let definitions = null;\n   let cloneRoot = null;\n   Step_2_Fulfill_parameters: {\n    if (input1 === null) {\n     basedir = null;\n     definitions = {};\n    } else if (typeof input1 === \"string\") {\n     basedir = input1;\n     definitions = {};\n    } else if (typeof input1 === \"object\" && input1 instanceof ModulerV5) {\n     cloneRoot = input1;\n     rootdir = input1.rootdir;\n     basedir = input1.basedir;\n     definitions = input1.definitions;\n    } else {\n     throw new Error(\"on «ModulerV5.constructor»: parameter «arguments[0]» must be undefined, string, null or instance of ModulerV5\");\n    }\n    if (input2 === null) {\n     // @OK: no extra file\n    } else if (typeof input2 === \"string\") {\n     this.assert(typeof input1 === \"object\" && input1 instanceof ModulerV5, \"on «ModulerV5.constructor»: parameter «arguments[1]» can only be used when «arguments[0]» is instance of ModulerV5\");\n     basedir = input1.fullpathOf(input2);\n    } else {\n     throw new Error(\"on «ModulerV5.constructor»: parameter «arguments[1]» must be string, null or instance of ModulerV5\");\n    }\n   }\n   Step_3_Fix_default_values: {\n    if (basedir === null) {\n     if (this.isBrowser) {\n      basedir = window.location.origin + window.location.pathname;\n     } else {\n      basedir = process.cwd();\n     }\n    }\n   }\n   Step_4_Validate_final_format: {\n    this.assert(typeof basedir === \"string\", \"on «ModulerV5.constructor»: variable «basedir» was not well formatted\");\n    this.assert(typeof definitions === \"object\", \"on «ModulerV5.constructor»: variable «definitions» was not well formatted\");\n   }\n   Step_5_Stablish_values: {\n    this.rootdir = rootdir ?? basedir;\n    this.basedir = basedir;\n    this.definitions = definitions;\n    this.css = cloneRoot ? cloneRoot.css : this.constructor.CssModuler.create(this);\n   }\n  }\n  static inspectToString(args, debugLevel) {\n   if (debugLevel === 0) return `${[...args].length} args`;\n   if (debugLevel === 1) return `${[...args].map((it, i) => i + \":\" + typeof it).join(\",\")} args`;\n   if (debugLevel === 2) return `${[...args].map((it, i) => i + \":\" + typeof it + this.stringify(it)).join(\",\")} args`;\n  }\n  static stringify(it) {\n   try {\n    return JSON.stringify(it);\n   } catch (error) {\n    return it;\n   }\n  }\n  isTracing = false;\n  trace(method, args = [], debugLevel = 0) {\n   if (!this.isTracing) return;\n   console.log(`[${method}] ${this.constructor.inspectToString(args, debugLevel)}`)\n  }\n  assert(condition, message) {\n   this.trace(\"assert\", arguments);\n   if (!condition) throw new Error(\"AssertionError in ModulerV5: \" + message);\n  }\n  normalizationOf = function(subpath, debug = false) {\n   const parts = (() => {\n    if (subpath.match(/^[A-Za-z0-9\\_\\-]+\\:\\/\\//g)) {\n     return subpath;\n    } else if (subpath.startsWith(\"./\")) {\n     return [this.basedir.replace(/(?!\\:\\/)\\/$/g, \"\"), subpath.substr(2)].join(\"/\");\n    } else if (subpath.startsWith(\"../\")) {\n     return [this.basedir.replace(/(?!\\:\\/)\\/$/g, \"\") + \"/..\", subpath.substr(3)].join(\"/\");\n    } else if (subpath.startsWith(\"@/\")) {\n     return [this.rootdir.replace(/(?!\\/)\\/$/g, \"\"), subpath.substr(2)].join(\"/\");\n    } else if (subpath.startsWith(\"/\")) {\n     return subpath;\n    } else {\n     return [this.basedir.replace(/(?!\\/)\\/$/g, \"\"), subpath].join(\"/\");\n    }\n   })().split(/(\\/+)/g).filter(p => p !== \"\");\n   //console.log(parts);\n   const stack = [];\n   Iterating_parts:\n    for (const part of parts) {\n     if (part === \".\") {\n      // @OK\n     } else if (part === \"..\") {\n      if (stack.length && stack[stack.length - 1] === \"/\") {\n       stack.pop();\n       stack.pop();\n      } else if (stack.length && stack[stack.length - 1] === \"//\") {\n       // @OK\n      } else if (stack.length) {\n       stack.pop();\n      } else {\n       // @OK\n      }\n     } else if (part === \"/\") {\n      if (stack.length && stack[stack.length - 1] === \"/\") {\n       // @OK\n      } else if (stack.length && stack[stack.length - 1] === \"//\") {\n       // @OK\n      } else {\n       stack.push(part);\n      }\n     } else {\n      stack.push(part);\n     }\n    }\n   let finalUrl = stack.join(\"\");\n   if (finalUrl.length !== 1) {\n    finalUrl = finalUrl.replace(/\\/$/g, \"\");\n   }\n   if (debug) {\n    console.log(finalUrl);\n   }\n   return finalUrl;\n  };\n  fullpathOf(subpath) {\n   this.trace(\"fullpathOf\", arguments);\n   return this.normalizationOf(subpath);\n   return require(\"path\").normalize(base);\n   // return require(\"path\").resolve(this.basedir, subpath);\n  }\n  relpathOf(subpath) {\n   this.trace(\"relpathOf\", arguments);\n   if (this.isBrowser) {\n    throw new Error(\"Must polyfill method «fullpathOf» to support browser environment\");\n   }\n   return \"@/\" + this.fullpathOf(subpath).replace(this.rootdir, \"\").replace(/^\\//g, \"\");\n  }\n  importModule(subpath, injection = {}) {\n   this.trace(\"importModule\", arguments);\n   return this.readPath(subpath).then(source => {\n    const asyncFunction = new(async function() {}).constructor(...Object.keys(injection), \"module\", \"exports\", \"$dictionary\", \"__filename\", \"__dirname\", source);\n    this.trace(\"importModule::evaluating JS\", [], 2);\n    return this.callModuleFactory(Object.values(injection), asyncFunction, this.cloneForFile(subpath), subpath, this.normalizationOf(subpath + \"/..\"));\n   });\n  }\n  readPath(file) {\n   this.trace(\"readPath\", arguments, 0);\n   return this.isBrowser ? this.readUrl(file) : this.readFile(file);\n  }\n  readUrl(file) {\n   this.trace(\"readUrl\", arguments);\n   return fetch(this.fullpathOf(file)).then(response => response.text());\n  }\n  readFile(file) {\n   this.trace(\"readFile\", arguments);\n   return require(\"fs\").promises.readFile(this.fullpathOf(file), \"utf8\");\n  }\n  knows(id) {\n   this.trace(\"knows\", arguments);\n   // Comprueba si un id está en definitions\n   Validate_parameters: {\n    this.assert(typeof id === \"string\", \"required «arguments[0]=id» as string to use «knows»\");\n   }\n   Search_as_definition: {\n    if (!(id in this.definitions)) {\n     return false;\n    }\n    return true;\n   }\n  }\n  define(...args) {\n   this.trace(\"define\", arguments);\n   let dependencies = [];\n   let factory = undefined;\n   Validate_parameters: {\n    if (args.length === 1) {\n     this.assert(typeof args[0] === \"function\", `using define: if args.length is 1 then args[0] must be factory function but «${typeof args[0]}» was found instead on «ModulerV5.prototype.define»`);\n     factory = args[0];\n    } else if (args.length === 2) {\n     this.assert(Array.isArray(args[0]), `using define: if args.length is 2 then args[0] must be array of dependencies but «${typeof args[0]}» was found instead on «ModulerV5.prototype.define»`);\n     this.assert(typeof args[1] === \"function\", `using define: if args.length is 2 then args[1] must be factory function but «${typeof args[1]}» was found instead on «ModulerV5.prototype.define»`);\n     dependencies = args[0];\n     factory = args[1];\n    } else {\n     throw new Error(`current arguments.length «${args.length}» is not supported`);\n    }\n   }\n   let dependencyPromises = undefined;\n   Resolve_dependencies: {\n    dependencyPromises = dependencies.map(dependency => this.mean(dependency));\n   }\n   Resolve_module: {\n    return this.callModuleFactory(dependencyPromises, factory);\n   }\n  }\n  mean(...args) {\n   this.trace(\"mean\", arguments);\n   let id = undefined;\n   let dependencies = [];\n   let callback = undefined;\n   Validate_and_format_parameters: {\n    if (args.length === 1) {\n     if (typeof args[0] === \"function\") {\n      callback = args[0];\n     } else if (Array.isArray(args[0])) {\n      return Promise.all(args[0].map(dependency => this.mean(dependency)));\n     } else {\n      this.assert(typeof args[0] === \"string\", `using mean: if args.length is 1 then args[0] must be id string or factory function but «${typeof args[0]}» was found instead on «ModulerV5.prototype.mean»`);\n      id = args[0];\n     }\n    } else if (args.length === 2) {\n     this.assert(Array.isArray(args[0]), `using mean: if args.length is 2 then args[0] must be dependencies array but «${typeof args[0]}» was found instead on «ModulerV5.prototype.mean»`);\n     this.assert(typeof args[1] === \"function\", `using mean: if args.length is 2 then args[1] must be factory function but «${typeof args[1]}» was found instead on «ModulerV5.prototype.mean»`);\n     dependencies = args[0];\n     callback = args[1];\n    } else {\n     throw new Error(`using mean: args.length must be between 1 and 2 but «${args.length}» was found instead on «ModulerV5.prototype.mean»`);\n    }\n   }\n   if (typeof callback === \"function\") {\n    Resolve_as_callback: {\n     const dependencyPromises = dependencies.map(dependency => this.mean(dependency));\n     return this.callModuleFactory(dependencyPromises, callback);\n    }\n   }\n   else if (typeof id === \"string\") {\n    Resolve_as_id: {\n     id = this.fullpathOf(id);\n     if (id in this.definitions) {\n      return this.definitions[id];\n     }\n     return this.importModule(id);\n    }\n   }\n   throw new Error(\"No, aquí no debería entrar, esta condición ya ha sido filtrada antes\");\n  }\n  cloneForFile(file) {\n   return ModulerV5.create(this, file + \"/..\");\n  }\n  cloneForDirectory(directory) {\n   return ModulerV5.create(this, directory);\n  }\n  callModuleFactory(dependencyPromises, factory, submoduler = null, filename = null, dirname = null) {\n   if (typeof filename === \"string\" && filename.endsWith(\".css\")) {\n    return this.css.add(filename);\n   }\n   const initialState = {};\n   const modulo = {\n    exports: initialState\n   };\n   return Promise.all(dependencyPromises).then(async resolvedDependencies => {\n    const output = await factory(...resolvedDependencies, modulo, modulo.exports, submoduler ?? this, filename, dirname);\n    const returnsUndefined = typeof output === \"undefined\";\n    const isNotInitialState = modulo.exports !== initialState;\n    const hasNewProperties = 0 !== Object.keys(modulo.exports).length;\n    return modulo.exports = (returnsUndefined && (isNotInitialState || hasNewProperties) ? modulo.exports : output);\n   });\n  }\n };\n\n ModulerV5.Dictionary = new ModulerV5();\n\n Promise.fromObject = function(obj) {\n  const allKeys = Object.keys(obj);\n  return Promise.all(Object.values(Object.values(obj))).then(output => {\n   let toObject = {};\n   for (let index = 0; index < output.length; index++) {\n    const item = output[index];\n    toObject[allKeys[index]] = item;\n   }\n   return toObject;\n  })\n };\n\n return ModulerV5;\n\n}.call());"
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
    console.log(_);
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
   buildJs() {

   };
   buildCss() {

   };
   buildTs() {

   };
   testJs() {

   };
   loop() {

   };
   up() {

   };
  };
  static Testing = class Testing {
   static Asserter = class Asserter {
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
    static createAssert(onSuccess = this.defaultOnSuccess, onError = this.defaultOnError, specificOutputs = {}) {
     const assert = function(condition, message) {
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
    this.trace = Tracer.createTracer("DevToolkit.Testing", "constructor");
    this.toolkit = toolkit;
   }
  };
  static Events = class Events {
   constructor(toolkit) {
    this.trace = Tracer.createTracer("DevToolkit.Events", "constructor");
    this.toolkit = toolkit;
   }
   async touch(file) {
    this.trace("prototype.touch", arguments, 0);
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
   async propagateOnTouch(file) {
    this.trace("prototype.propagateOnTouch", arguments);
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
    this.trace("prototype.propagateOnTest", arguments);
   }
   async propagateOnDistribute(file) {
    this.trace("prototype.propagateOnDistribute", arguments);
   }
  };
  static Semaphore = class Semaphore {
   constructor(toolkit, filename = "semaphore.main.txt") {
    this.trace = Tracer.createTracer("DevToolkit.Semaphore", "constructor");
    this.toolkit = toolkit;
    this.filename = filename;
   }
   setFilename(filename) {
    this.filename = filename;
   }
   getFilepath() {
    return this.toolkit.fullpathOf(this.filename);
   }
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
   release() {
    return require("fs").promises.writeFile(this.getFilepath(), "released", "utf8");
   }
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
  static FileWatcher = class FileWatcher {
   static Refrescador = require(__dirname + "/refrescador.api.dist.js");
   static start(options) {
    return this.Refrescador.run(options);
   }
  };
  static FileSystem = class FileSystem {
   static exists(file) {
    return require("fs").promises.lstat(file).catch(error => false);
   }
   static existsFile(file) {
    return require("fs").promises.lstat(file).then(lstat => {
     return lstat.isFile();
    }).catch(error => false);
   }
   static readFile(file, inTry = false) {
    if (inTry) {
     return require("fs").promises.readFile(file, "utf8").catch(error => false);
    }
    return require("fs").promises.readFile(file, "utf8");
   }
   static writeFile(file, contents, options = {
    recursive: false
   }) {
    if (options.recursive) throw new Error("operation not supported yet: writeFile + recursive=true");
    return require("fs").promises.writeFile(file, contents);
   }
   static deleteFile(file, options = {
    inTry: false
   }) {
    if (options.inTry) {
     require("fs").promises.unlink(file).catch(error => false);
    }
    return require("fs").promises.unlink(file);
   }
   static existsDirectory(file) {
    return require("fs").promises.lstat(file).then(lstat => {
     return lstat.isDirectory();
    }).catch(error => false);
   }
   static readDirectory(file, options = {
    inTry: false
   }) {
    if (options.inTry) {
     return require("fs").promises.readdir(file).catch(error => false);
    }
    return require("fs").promises.readdir(file);
   }
   static writeDirectory(file, options = {
    recursive: false
   }) {
    return require("fs").promises.mkdir(file, options);
   }
   static deleteDirectory(file, options = {
    inTry: false
   }) {
    if (options.inTry) {
     return require("fs").promises.rm(file, {
      recursive: true
     }).catch(error => false);
    }
    return require("fs").promises.rm(file, {
     recursive: true
    });
   }
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
   static sizeOf(file) {
    return require("fs").promises.lstat(file).then(lstat => lstat.size);
   }
   constructor(toolkit) {
    this.toolkit = toolkit;
   }
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
  };
  static Templating = class Templating {
   static Tjs = require("./tjs.js");
   constructor(toolkit) {
    this.toolkit = toolkit;
    this.tjs = this.constructor.Tjs.create(this.toolkit.basedir);
   }
  };
  static Time = class Time {
   static timeout(ms) {
    return require("timers/promises").setTimeout(ms);
   }
  };
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
  fullpathOf(subpath) {
   return require("path").resolve(this.basedir, subpath);
  }
  subpathOf(subpath) {
   if (!subpath.startsWith(this.basedir + "/")) throw new Error(`provided file is not a subpath of «${this.toolkit.basedir}»`);
   return subpath.replace(this.basedir + "/", "");
  }
 };
}.call());