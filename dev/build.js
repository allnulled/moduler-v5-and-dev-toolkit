const Tjs = require(`${__dirname}/../dist/dev-toolkit/tjs.js`);
const fs = require("fs");
require("js-beautify/js");

const main = async function() {
  El_building: {
    const tjs = Tjs.create(`${__dirname}/..`, {
      createFileIfNotExists: true,
    });
    const targets = [
      ["src/ModulerV5/ModulerV5.entry.js", "dist/moduler-v5/moduler-v5.dist.js"],
      ["src/DevToolkit/DevToolkit.entry.js", "dist/dev-toolkit/dev-toolkit.dist.js"],
    ];
    for(let index=0; index<targets.length; index++) {
      const [src, dst] = targets[index];
      const moduleSource = await tjs.renderFile(src, {}, {
        beautify:{
          indent_size: 2
        }
      });
      await fs.promises.writeFile(tjs.fullpathOf(dst), moduleSource, "utf8");
    }
  }
  El_testing: {
    await require(__dirname + "/../test/test.js");
  }
  El_documenter: {
    const DevToolkit = require(__dirname + "/../dist/dev-toolkit/dev-toolkit.dist.js");
    const devToolkit = DevToolkit.create(__dirname + "/../src");
    const documentationInText = await devToolkit.documentator.extractJavadocTextFromDirectory();
    require("fs").promises.writeFile(`${__dirname}/../API.md`, documentationInText, "utf8");
    require("fs").promises.readFile(`${__dirname}/../README.tpl.md`, "utf8").then(readmeTplContent => {
      const readmeContent = readmeTplContent.replace("{{ API aquí }}", documentationInText);
      require("fs").promises.writeFile(`${__dirname}/../README.md`, readmeContent, "utf8");
    });
  }
  El_exporting: {
    require("fs").promises.cp(__dirname + "/../dist/dev-toolkit", __dirname + "/../../moduler-v5-and-dev-toolkit-starter/src/lib/dev-toolkit", { recursive: true });
    require("fs").promises.cp(__dirname + "/../dist/moduler-v5", __dirname + "/../../moduler-v5-and-dev-toolkit-starter/src/lib/moduler-v5", { recursive: true });
  }
};

module.exports = main();
