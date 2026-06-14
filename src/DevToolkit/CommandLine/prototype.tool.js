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
  // console.log(_);
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