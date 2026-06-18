/**
 * @name DevToolkit.prototype.moduler
 * @type class property + DevToolkit.ModulerV5
 * @not-prototype
 * @in-constructor
 * @description Instancia de ModulerV5 para esta instancia de DevToolkit.
 * @description Esta instancia se introduce en el framework por la necesidad de compilar el CSS en development-time / compilation-time.
 * @description Principalmente, para reaprovechar la lógica del CssModuler.
 * @description Y concretamente, para habilitar la gestión de rutas relativas desde los `@requires:` de los fichero css.
 * @description Igual más adelante tiene más razones/dependencia lógica, pero en su origen, la razón es esta.
 * @description Aunque parezca excesivo arrastrar toda la API de ModulerV5 por esta razón, hay que tener en cuenta que:
 * @description 1. DevToolkit se utiliza en development-time, no en run-time, por lo cual la performance es un poco menos crítica.
 * @description 2. Es la forma más razonable de reaprovechar el código ya escrito en ModulerV5 que interesa en el development-time
 * @description 3. Lo único que no es óptimo aquí es arrastrar la lógica de modulación en run-time del JavaScript. Pero tampoco está de más, y puede serte útil también tener modulación en development-time, simplemente que el framework de DevToolkit no la explota directamente porque ya centraliza todas las utilidades base.
 * @description 4. Al ir avanzando en el desarrollo, será cuestión de tiempo querer arrastrar el framework de ModulerV5 también en el development-time: la compactación del CSS ha sido la primera necesidad, pero con el tiempo no sería la única.
 * @description Para saber más, puedes ir a la clase DevToolkit.ModulerV5.
 */
this.moduler = this.constructor.Moduler.create(this.basedir);