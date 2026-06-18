const fs = require("fs");
const path = require("path");
const tests = [];

const all = 1;
//////////////////////////////////////////////////////////////////
if(0 || all) tests.push(`${__dirname}/moduler-v5.signatures.test.js`);
if(0 || all) tests.push(`${__dirname}/moduler-v5.paths.test.js`);
if(0 || all) tests.push(`${__dirname}/moduler-v5.css-output.test.js`);
if(0 || all) tests.push(`${__dirname}/moduler-v5.css-dependency.test.js`);
//////////////////////////////////////////////////////////////////
if(0 || all) tests.push(`${__dirname}/dev-toolkit.testing.test.js`);
if(0 || all) tests.push(`${__dirname}/dev-toolkit.templating.test.js`);
if(0 || all) tests.push(`${__dirname}/dev-toolkit.documentator.test.js`);
if(0 || all) tests.push(`${__dirname}/dev-toolkit.tracer.test.js`);
if(0 || all) tests.push(`${__dirname}/dev-toolkit.semaphores.test.js`);
if(0 || all) tests.push(`${__dirname}/dev-toolkit.events.test.js`);
if(0 || all) tests.push(`${__dirname}/dev-toolkit.file-watcher.test.js`);
if(1 || all) tests.push(`${__dirname}/dev-toolkit.cli-tools.test.js`);
if(1 || all) tests.push(`${__dirname}/dev-toolkit.cli-api.test.js`);
//////////////////////////////////////////////////////////////////


const main = async function () {
  const DevToolkit = require(`${__dirname}/../dist/dev-toolkit/dev-toolkit.dist.js`);
  const devToolkit = new DevToolkit(`${__dirname}/tests-assets`);
  const ModulerV5 = require(`${__dirname}/../dist/moduler-v5/moduler-v5.dist.js`);
  const hasColors = (() => {try {DevToolkit.CommandLine.Colors.style;return true;} catch(error) {return false;}})();
  const results = { output: [] };
  const startTime = new Date();
  Test_de_dev_toolkit: 
  for(let index=0; index<tests.length; index++) {
    const file = tests[index];
    try {
      const output = await require(file)({ DevToolkit, devToolkit, ModulerV5, startTime, titleColumns: 20 });
      results.output.push({ index, file, success: true , output });
    } catch (error) {
      results.output.push({ index, file, success: false, error });      
      DevToolkit.CommandLine.printError(error);
    }
  }
  console.log("\n 🟨 [🔬] Tests report:");
  let fails = [];
  results.output.forEach(result => {
    const relativeFile = result.file.replace(path.resolve(__dirname+"/..") + "/", "#/");
    if(result.success) {
      const message = ` [*] [${result.index+1}] ${relativeFile}`;
      if(!hasColors) console.log(message)
      else console.log(DevToolkit.CommandLine.Colors.style("greenBright").text(message));
    } else {
      fails.push(relativeFile);
      if(!hasColors) console.log(` [!] [${result.index+1}] ${relativeFile}:\n${result.error.name}: ${result.error.message}\n${result.error.stack}`, result.error);
      else console.log(
        DevToolkit.CommandLine.Colors.style("red,bold,underline").text(` [!] [${result.index+1}] [FAILING] ${relativeFile}:`.toUpperCase())
        + "\n"
        + DevToolkit.CommandLine.Colors.style("yellow").text(
            DevToolkit.CommandLine.Colors.box(`${result.error.name}: ${result.error.message}\n${result.error.stack}`)
          )
      );
    }
  });
  if(fails.length) {
    DevToolkit.CommandLine.Colors.style("red,bold,underline").print(`⚠️ Fails in ${fails.length} tests:`);
    console.log("  - " + fails.join("\n  - "), "\n");
  } else {
    DevToolkit.CommandLine.Colors.style("greenBright,bold,underline").print(`🎊 Successfully passed all tests!\n`);
  }
}.call();