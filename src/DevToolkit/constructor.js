/**
 * @name DevToolkit.constructor
 * @type class constructor
 * @parameter basedir:String - Ruta raíz de proyecto para la instancia. Por defecto, se utiliza el `process.cwd()`.
 * @sets this.basedir:String - Ruta raíz. Se construye con `path.resolve` y el parámetro `basedir`
 * @sets this.fileSystem:DevToolkit.FileSystem - Utilidades para sistema de ficheros
 * @sets this.cli:DevToolkit.CommandLine - Utilidades para línea de comandos
 * @sets this.documentator:DevToolkit.Documentator - Utilidades para documentación
 * @sets this.testing:DevToolkit.Testing - Utilidades para testeo
 * @sets this.templating:DevToolkit.Templating - Utilidades para plantillas
 * @sets this.events:DevToolkit.Events - Utilidades para eventos de la escucha a cambios en ficheros
 * @sets this.semaphore:DevToolkit.Semaphore - Utilidades para semáforos. Presupone el fichero `semaphore.dev-toolkit.txt` para la gestión del semáforo.
 * @sets this.assert:DevToolkit.Assert - Utilidades para aserciones
 * @sets this.moduler:ModulerV5 - Una instancia de ModulerV5. Se utiliza para poder compilar el CSS. La API de modulación de JavaScript queda sin usarse dentro de DevToolkit, pero se importa porque la modulación CSS exige esa API igualmente.
 * @description En la construcción de DevToolkit se establecen las propiedades. En general, lo que consigues creando estas instancias es facilitar que los métodos de ellas conozcan la ruta raíz del proyecto, y así no tener que estar combinándolas con `DevToolkit.prototype.fullpathOf` manualmente en cada caso.
 */
constructor(basedir = process.cwd()) {
  /*<$=await include("./prototype.basedir.js")$>*/
  /*<$=await include("./prototype.fileSystem.js")$>*/
  /*<$=await include("./prototype.cli.js")$>*/
  /*<$=await include("./prototype.documentator.js")$>*/
  /*<$=await include("./prototype.testing.js")$>*/
  /*<$=await include("./prototype.templating.js")$>*/
  /*<$=await include("./prototype.events.js")$>*/
  /*<$=await include("./prototype.semaphore.js")$>*/
  /*<$=await include("./prototype.assert.js")$>*/
  /*<$=await include("./prototype.moduler.js")$>*/
}