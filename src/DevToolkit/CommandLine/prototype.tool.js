async tool(args = process.argv) {
  const _ = [];
  let pos = 0;
  Picking_positional:
  for(let index=0; index<args.length; index++) {
    const arg = args[index];
    if(arg.startsWith("-") && !arg.includes(" ")) {
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
    return await callback.call(this.toolkit, {_,args});
  } catch (error) {
    console.error(error);
    throw error;
  }
}