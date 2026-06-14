/**
 * @name DevToolkit.FileSystem.fromDirectoryToObject
 * @type class method
 * @parameter dir:String - Directorio absoluto.
 * @parameter options:Object - Opciones. Admite un `filter:Function<fsnode:String>:Boolean` para usar como filtro y discriminar qué partes del directorio no quieres incluir en la representación. Esto puede ser útil si quieres que 1 fichero contenga la representación final de la estructura del directorio, y así evitas que la representación objetual se haga incremental.
 * @returns `Promise<Object>` - Representación objetual del directorio proporcionado.
 * @description Construye la representación objetual de un directorio.
 */
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