/**
 * @name DevToolkit.prototype.templating
 * @type class property + DevToolkit.Templating
 * @not-prototype
 * @in-constructor
 * @description Instancia de DevToolkit.Templating para esta instancia de DevToolkit.
 * @description Se utiliza para la compilación de JavaScript, que corre a cargo de la librería [Tjs](https://github.com/allnulled/templated-js) (Templated-JavaScript) que se incluye en las instancias de DevToolkit.Templating.
 * @description Aunque la clase ya está dotada de métodos para la compilación, la instancia se inicializa con el this.basedir de la instancia DevToolkit, lo cual permite resolver rutas relativas.
 * @description Para saber más, puedes ir a la clase DevToolkit.Templating
 */
this.templating = new this.constructor.Templating(this);