/**
 * @name ModulerV5.prototype.rootdir
 * @type class property + String
 * @in-constructor
 * @not-prototype
 * @description Propiedad del ModulerV5 que indica el this.basedir del ModulerV5 más alto en la cadena de clonación. Por clonación se entienden las instancias creadas por los métodos cloneForFile y cloneForDirectory, o cualquier instancia que se haya creado pasándole otra instancia de ModulerV5 en los parámetros del constructor.
 */
this.rootdir = rootdir ?? basedir;