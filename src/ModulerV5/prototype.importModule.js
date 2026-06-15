/**
 * @name ModulerV5.prototype.importModule
 * @type class method
 * @parameter subpath:String - Subruta a importar.
 * @parameter injection:Object = {} - Variables inyectadas en el script que se importa.
 * @returns `Promise<any>` - Lo devuelto por la llamada a la factoría del módulo especificado. Esto implica a `this.readPath` y a `this._callModuleFactory`. Por el camino se usan `this.cloneForFile` y `this.normalizationOf` con el `subpath`.
 * @description Este método es un wrapper de _callModuleFactory que usa this.readPath y el constructor de AsyncFunction.
 * @explanation Primero hace un this.readPath del subpath para extraer el código.
 * @explanation Segundo crea una función con el código extraído, usando el constructor AsyncFunction.
 * @explanation En este punto, entiende estas variables en los parámetros: `\`[${Object.keys(injection).join(",")}]\`, "module", "exports", "LocalDictionary", "__filename", "__dirname"`
 * @explanation Tercero, llama al this._callModuleFactory y retorna lo que esta devuelva.
 * @explanation En este punto, al this._callModuleFactory le pasa estas variables: `Object.values(injection), asyncFunction, this.cloneForFile(subpath), subpath, this.normalizationOf(subpath + "/..")`
 */
importModule(subpath, injection = {}) {
  return this.readPath(subpath).then(source => {
    const asyncFunction = new (async function () { }).constructor(`[${Object.keys(injection).join(",")}]`, "module", "exports", "LocalDictionary", "__filename", "__dirname", source);
    // console.log(asyncFunction.toString())
    return this._callModuleFactory(Object.values(injection), asyncFunction, this.cloneForFile(subpath), subpath, this.normalizationOf(subpath + "/.."));
  });
}