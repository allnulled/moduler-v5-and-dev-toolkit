/**
 * @name DevToolkit.prototype.semaphore
 * @type class property + DevToolkit.Semaphore
 * @not-prototype
 * @in-constructor
 * @description Instancia de Semaphore para esta instancia de DevToolkit.
 * @description Su razón de ser es que los eventos del development-time, si se inician por manipulación de ficheros, se van a acumular.
 * @description Esta acumulación requiere de discriminar el evento original, triggeado por el desarrollador al guardar un fichero, y los eventos subsiguientes, encargados de hacer compilaciones o cambios de cualquier otro tipo.
 * @description Esta instancia sirve principalmente para gestionar esa diferencia en el origen del evento que lanza la observación de los ficheros.
 * @description Para saber más, puedes ir a la clase DevToolkit.Semaphore
 */
this.semaphore = new this.constructor.Semaphore(this, "semaphore.dev-toolkit.txt");