/**
 * @name DevToolkit.prototype.fileSystem
 * @type class property + DevToolkit.FileSystem
 * @not-prototype
 * @in-constructor
 * @description Instancia de DevToolkit.FileSystem para esta instancia de DevToolkit.
 * @description Contiene utilidades propias de la interacción con el sistema de ficheros.
 * @description A diferencia de los métodos estáticos de DevToolkit.FileSystem, este objeto sí conoce la ruta base de la instancia de DevToolkit, lo cual puede ser útil para especificar rutas sobreentendiendo la raíz de estas.
 * @description Para saber más, puedes ir a la clase DevToolkit.FileSystem.
 */
this.fileSystem = new this.constructor.FileSystem(this);