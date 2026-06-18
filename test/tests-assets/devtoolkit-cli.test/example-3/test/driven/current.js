module.exports = async function() {
  console.log(dev);
  console.log(await dev.cli.tool(["touch"]));
};