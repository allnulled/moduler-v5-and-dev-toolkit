/**
 * @name DevToolkit.FileSystem.writeFile
 * @type static method
 * @parameter file:String - Fichero absoluto
 * @parameter contents:String - Contenido con el que sobreescribir
 * @parameter options:Object - Opciones pasadas. Ahora mismo no admite nada.
 * @returns Promise<void> - Devuelve lo mismo que fs.promises.writeFile
 * @description Sobreescribe un fichero con el contenido especificado.
 */
static writeFile(file, contents, options = { recursive: false }) {
  if(options.recursive) throw new Error("operation not supported yet: writeFile + recursive=true");
  return require("fs").promises.writeFile(file, contents);
}