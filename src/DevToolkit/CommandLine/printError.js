static printError(error) {
  console.log(DevToolkit.CommandLine.Colors.style("redBright,bold").text(DevToolkit.CommandLine.Colors.box(`${error.name}: ${error.message}`)), "\n", error);
}