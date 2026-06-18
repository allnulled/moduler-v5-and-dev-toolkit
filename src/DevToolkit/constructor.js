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
  this.basedir = require("path").resolve(basedir);
  this.fileSystem = new this.constructor.FileSystem(this);
  this.cli = new this.constructor.CommandLine(this);
  this.documentator = new this.constructor.Documentator(this);
  this.testing = new this.constructor.Testing(this);
  this.templating = new this.constructor.Templating(this);
  this.events = new this.constructor.Events(this);
  this.semaphore = new this.constructor.Semaphore(this, "semaphore.dev-toolkit.txt");
  this.assert = this.constructor.Testing.Asserter.createAssert().assert;
  this.moduler = this.constructor.Moduler.create(this.basedir);
}