/**
 * @name DevToolkit.FileSystem.emptyDirectory
 * @type static method
 * @parameter dir:String - Directorio absoluto
 * @parameter options:Object - Opciones. Ahora mismo solo acepta `inTry:Boolean=false`, que en `true` falla silenciosamente.
 * @returns Promise<void> - Lo mismo que fs.promises.mkdir
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