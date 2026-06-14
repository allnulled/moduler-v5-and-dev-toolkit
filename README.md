# moduler-v5-and-dev-toolkit

ModulerV5 es un modulador en runtime de JS y DevToolkit es un kit de herramientas de desarrollo para JS.

## Índice

- [moduler-v5-and-dev-toolkit](#moduler-v5-and-dev-toolkit)
  - [Índice](#índice)
  - [Estado](#estado)
  - [Composición](#composición)
  - [Especificaciones](#especificaciones)
    - [Partes más críticas](#partes-más-críticas)
  - [Dominios de ModulerV5 y DevToolkit](#dominios-de-modulerv5-y-devtoolkit)
  - [Motivación](#motivación)
  - [API](#api)
  - [Conclusión](#conclusión)


## Estado

⚠️ En construcción.

## Composición

La API, en general, son clases e instancias de clase anidadas.

## Especificaciones

Las especificaciones son documentos de apoyo que formalizan y explican cómo usar una API.

- [ModulerV5 Spec.](./SPEC.ModulerV5.md)
- [ModulerV5+CssModuler Spec.](./SPEC.ModulerV5.CssModuler.md)
- [DevToolkit Spec.](./SPEC.DevToolkit.md)
- [DevToolkit+CommandLine Spec.](./SPEC.DevToolkit.CommandLine.md)
- [DevToolkit+Documentator Spec.](./SPEC.DevToolkit.Documentator.md)

### Partes más críticas

Los puntos donde la API se puede complicar un poco más son estos:

- `ModulerV5` (clase)
   - `ModulerV5.Dictionary` (instancia global de `ModulerV5`)
   - `ModulerV5.CssModuler` (clase)
      - `ModulerV5.css` (instancia global de `CssModuler`)
- `DevToolkit` (clase)
   - `DevToolkit.FileWatcher.Refrescador`:
      - [https://github.com/allnulled/refrescador](https://github.com/allnulled/refrescador)
      - `chokidar: ^5.0.0`
      - `ejs: ^5.0.2`
      - `express: ^5.2.1`
      - `picomatch: ^4.0.4`
      - `socket.io: ^4.8.3`
   - `DevToolkit.Templating.Tjs`:
      - [https://github.com/allnulled/templated-js](https://github.com/allnulled/templated-js)
      - `js-beautify: ^1.15.4`
      - tiene algún hack añadido, en `include` e `includeSync`, que puede no reflejarse en el proyecto original

## Dominios de ModulerV5 y DevToolkit

El dominio donde las 2 APIs coinciden es en el de **modulación**, pero:

- `ModulerV5` es **production code** para módulos en **run-time**.
- `DevToolkit` es **development code** para módulos en **compilation-time**.

El consejo es simple:

> Usa `ModulerV5` para situar y acceder módulos en lugar de contaminar variables globales.

En cambio:

> Usa `DevToolkit` para dividir y reutilizar fragmentos de código en lugar de modular con `import/export` o similares.

## Motivación

¿Por qué usar esto en vez de import/export? Por varias:

- por control, principalmente
- por trackeabilidad
- por legibilidad
- por simplicidad
- por flexibilidad y ergonomía de modulación
- por aligeramiento de herramientas intermedias
- por acortamiento de tiempos
- pero cada uno tiene su dominio también:
   - el `import/export` sigue teniendo sentido para los tipos en TypeScript
   - aunque la filosofía de TypeScript choca con la de este proyecto
      - porque TypeScript necesita parsear los módulos JavaScript
      - y este proyecto invita a fragmentar el código de forma que el parser no puede reconstruir bien los módulos

## API

A continuación se expone toda la API documentada de tanto `DevToolkit` como de `ModulerV5`.

----

**{@root}/dev-toolkit/dev-toolkit.dist.js**

----

- **@name:** DevToolkit
- **@type:** class
- **@description:** Clase para las utilidades principales en el tiempo de desarrollo.

----

- **@name:** DevToolkit.create
- **@type:** static method
- **@arguments:** Los mismos que el DevToolkit.constructor
- **@description:** Método para fácil construcción del objeto.

----

- **@name:** DevToolkit.Tracer
- **@type:** class
- **@description:** Clase con utilidades para el traceo.

----

- **@name:** DevToolkit.Tracer.createTracer
- **@type:** static method
- **@parameter:**
   - prefix:String - Prefijo del traceador. Se refiere a la clase.
   - firstMessage:String|Boolean = false - Primer mensaje que quieres trazar ya al construir el traceador. Para no hacerlo en 2 llamadas.
   - isTracing:Boolean = true - Flag para activar o desactivar el traceador.
- **@returns:** Function<method:String,args:Arguments|Array>:void - Función que acepta 1 string y 1 array o 1 arguments, y imprime la traza. El segundo argumento será pasado a `inspectToString`.
- **@description:** Devuelve un traceador, que es una función que va imprimiendo las trazas que le dices. Esta función acepta 2 argumentos: el nombre del metodo en String, y los argumentos de la función traceada, en Array o Arguments.
- **@note:** Este método de traceo es muy precario ahora mismo, y no es para producción en ningún caso.

----

- **@name:** DevToolkit.Tracer.inspectToString
- **@type:** static method
- **@parameter:**
   - args:Array|Arguments - Típicamente, el `arguments` de la función que se está inspeccionando, pero cualquier array también valdría.
   - debugLevel:0|1|2 - Nivel de debug que quieres aplicar. El 1 solo dice cuantos argumentso, el 2 da los tipos, el 3 da el tipo y stringifica el valor.
----

- **@name:** DevToolkit.Tracer.stringify
- **@type:** static method
- **@parameter:** it:any - Cosa que quieres stringificar.
- **@description:** Usa JSON.stringify para stringificar algo, o devuelve el algo tal cual.

----

- **@name:** DevToolkit.Utils
- **@type:** class
- **@description:** Clase con utilidades que no encajan en otro dominio.

----

- **@name:** DevToolkit.Debug
- **@type:** class
- **@description:** Utilidades para el debugging de DevToolkit

----

- **@name:** DevToolkit.Debug.die
- **@type:** class method
- **@parameters:** ...args:Array - Lo que se quiere imprimir por consola antes de interrumpir el proceso.
- **@description:** Sirve para interrumpir el proceso, sacando con console.log lo que quieras antes. Usa `process.exit(1)` para ello.

----

- **@name:** DevToolkit.Documentator
- **@type:** class 
- **@description:** Utilidades para documentación de DevToolkit

----

- **@name:** DevToolkit.Documentator.symbols
- **@type:** Object
- **@description:** Tiene varias expresiones regulares que interesan para capturar y limpiar los comentarios javadoc.

----

- **@name:** DevToolkit.Documentator.prototype._findFiles
- **@type:** private class method
- **@parameter:**
   - globPattern:String - Patrón glob para encontrar los ficheros que contienen comentarios javadoc.
   - options:Object - Opciones pasadas a la llamada de la librería [`glob`](https://www.npmjs.com/package/glob). Algunas opciones están ya prefijadas por el método:
      - - cwd: `this.toolkit.basedir` (este sí puede sobreescribir)
      - - absolute: `true`
      - - ignore: `node_modules` (este puede extenderse, pero no sobreescribirse)
- **@returns:** Promise<Array<String>> - Es una llamada asíncrona, así que devuelve una promesa, con la lista de ficheros encontrados.

----

- **@name:** DevToolkit.Documentator.prototype._extractJavadocCommentsFromString
- **@type:** private class method
- **@parameter:** text:String - Texto que puede contener comentarios javadoc. 
- **@returns:** Array<Object> - Lista de comentarios javadoc, representados por objetos.
- **@description:** Método que devuelve los comentarios javadoc encontrados en un string.

----

- **@name:** DevToolkit.Documentator.prototype.extractJavadocCommentsFromDirectory
- **@type:** class method
- **@parameter:** dir:String - Directorio del cual que quieren extraer los comentarios. Se entiende que solo son ficheros `.js`. Ahora mismo esto no se puede cambiar, pero puede que se cambie más adelante. Por defecto usa el `this.toolkit.basedir`.
- **@returns:** Promise<Object> - Objeto con los nombres de ficheros (relativos, empiezan con `{@root}/`) y los comentarios javadoc encontrados en cada uno.
- **@description:** Extrae todos los comentarios javadoc encontrados en ficheros js de un directorio dado.

----

- **@name:** DevToolkit.Documentator.prototype.extractJavadocTextFromDirectory
- **@type:** class method
- **@parameter:**
   - dir:String - Directorio del cual se quieren extraer los comentarios javadoc.
   - options:Object - Opciones. Actualmente no tiene uso. Por defecto, un objeto vacío.
- **@returns:** Promise<String> - Texto compuesto por todos los comentarios javadoc encontrados.
- **@description:** Devuelve el texto de todos los comentarios javadoc encontrador bajo un directorio. Utiliza `this.extractJavadocCommentsFromDirectory` por dentro.

----

- **@name:** DevToolkit.CommandLine
- **@type:** class
- **@description:** Clase con utilidades para la interfaz de línea de comandos de DevToolkit

----

- **@name:** DevToolkit.CommandLine.Colors
- **@type:** class
- **@description:** Clase con utilidades para pintar colores por consola, tablas, cajas, y cosas así. Esta clase se saca de `require(__dirname + "/refrescador.api.dist.js").colors`. Por lo cual, se sobreentiende que `dev-toolkit.dist.js` tiene que estar acompañado de este fichero.

----

- **@name:** DevToolkit.CommandLine.printError
- **@parameter:** error:Error - Instancia de la clase Error que se quiere imprimir.
- **@description:** Imprime un error pero bonitamente, con colores.

----

- **@name:** DevToolkit.CommandLine.constructor
- **@type:** class constructor
- **@parameter:** toolkit:DevToolkit - Instancia de DevToolkit para esta clase.
- **@sets:** this.toolkit a partir del parámetro proporcionado.
- **@description:** Construye la instancia de DevToolkit.CommandLine

----

- **@name:** DevToolkit.CommandLine.baseProject
- **@type:** Object
- **@description:** Este objeto contiene el esqueleto de un proyecto nuevo que utilizará `DevToolkit` y `ModulerV5`. Tiene la estructura de carpetas y ficheros con su contenido necesarios para ello.

----

- **@name:** DevToolkit.CommandLine.prototype.tool
- **@type:** class method
- **@parameter:** args:Array<String> - Indica la herramienta. Permite niveles. Cada nivel es concatenado con el caracter `/`, que luego es normalizado por `DevToolkit.prototype.fullpathOf`. Este parámetro pueden ser los `process.argv` que buscará donde terminan los argumentos posicionales y los tomará desde ahí automáticamente.
- **@returns:** any - Lo que devuelva la herramienta llamada.
- **@description:** Llama a la herramienta que esté guardada dentro de la raíz del proyecto, en `dev/cli/tool/{args.join("/")}

----

- **@name:** DevToolkit.CommandLine.prototype.createProject
- **@type:** class method
- **@description:** Construye un proyecto que utiliza DevToolkit y ModulerV5 para modular js y css. Requiere que el directorio esté vacío. Este método obliga que el fichero `dev-toolkit.dist.js` esté con todo el contenido de la clase.

----

- **@name:** DevToolkit.CommandLine.prototype.buildJs
- **@not-finished:** 

----

- **@name:** DevToolkit.CommandLine.prototype.buildCss
- **@not-finished:** 

----

- **@name:** DevToolkit.CommandLine.prototype.buildTs
- **@not-finished:** 

----

- **@name:** DevToolkit.CommandLine.prototype.testJs
- **@not-finished:** 

----

- **@name:** DevToolkit.CommandLine.prototype.loop
- **@not-finished:** 

----

- **@name:** DevToolkit.CommandLine.prototype.up
- **@not-finished:** 

----

- **@name:** DevToolkit.Testing
- **@type:** class
- **@description:** Clase con utilidades para testeo de DevToolkit.

----

- **@name:** DevToolkit.Testing.Asserter
- **@type:** class
- **@description:** Clase con utilidades para aserciones.

----

- **@name:** DevToolkit.Testing.Asserter.AssertionError
- **@type:** class
- **@extends:** Error
- **@description:** Subclase de `Error` que representa un fallo en aserción. 

----

- **@name:** DevToolkit.Events
- **@type:** class
- **@descrition:** Gestión de eventos de escucha de ficheros en tiempo de desarrollo de DevToolkit. Esta clase se encarga de los eventos que se tienen que encender cuando un fichero es guardado. Los eventos incluyen:
- compilar JavaScript o CSS
- pasar los tests
- generar distribuibles.

----

- **@name:** DevToolkit.Events.constructor
- **@type:** class constructor
- **@parameter:** toolkit:DevToolkit - Instancia de DevToolkit. 
- **@sets:** this.toolkit - Con el parámetro proporcionado.
- **@description:** Construye una instancia.

----

- **@name:** DevToolkit.Events.prototype.touch
- **@parameter:** file:String - Fichero que se quiere hacer el touch.
- **@returns:** Promise<void> - No devuelve nada actualmente
- **@description:** Primero bloquea el semáforo, luego propaga el touch, el test, el distribute, y luego desbloquea el semáforo.

----

- **@name:** DevToolkit.Events.prototype.propagateOnTouch
- **@parameter:** file:String - Fichero del cual se quiere propagar el touch.
- **@returns:** Promise<void> - No devuelve nada actualmente.
- **@description:** Realiza la propagación de tipo Touch para un fichero dado.

----

- **@name:** DevToolkit.Semaphore
- **@type:** class
- **@description:** Clase con utilidades para la gestión de semáforos de DevToolkit

----

- **@name:** DevToolkit.Semaphore.constructor
- **@parameter:**
   - toolkit:DevToolkit - Instancia de DevToolkit.
   - filename:String - Fichero usado como semáforo. Por defecto será `"semaphore.main.txt"`.
- **@sets:**
   - this.toolkit:DevToolkit - Con el parámetro proporcionado.
   - this.filename:String - Con el parámetro proporcionado. Se refiere al fichero usado como semáforo por esta instancia.
- **@description:** Construye una instancia.

----

- **@name:** DevToolkit.Semaphore.prototype.setFilename
- **@parameter:** filename:String - Nuevo nombre (o subruta) de fichero.
- **@sets:** this.filename:String - Según el parámetro.
- **@returns:** void - No devuelve nada, es síncrono.
- **@description:** Solo cambia el nombre del fichero.

----

- **@name:** DevToolkit.Semaphore.prototype.getFilepath
- **@type:** class method
- **@returns:** String - Ruta completa del fichero semáforo.
- **@description:** Devuelve la ruta completa del fichero usado como semáforo.

----

- **@name:** DevToolkit.Semaphore.prototype.acquire
- **@type:** class method
- **@returns:** Promise<void> - No devuelve nada.
- **@description:** Bloquea el semáforo, o lanza un error si no está liberado. Si el error es que no existe el fichero, lo ignora y lo crea. El semáforo está desbloqueado si su contenido es `released`.

----

- **@name:** DevToolkit.Semaphore.prototype.release
- **@returns:** Promise<void> - No devuelve nada, solo que usa fs.promises.writeFile y devuelve lo que este.
- **@description:** Escribe `"released"` en el fichero semáforo.

----

- **@name:** DevToolkit.Semaphore.prototype.destroy
- **@type:** class method
- **@throws:** Error - Lanza el error que se produzca por unlink, a no ser que fuera que el fichero no existía, en cuyo caso devuelve false solamente.
- **@returns:** Promise<Boolean> - Devuelve true si existía, false si no existía.
- **@description:** Elimina el fichero de semáforo.

----

- **@name:** DevToolkit.FileWatcher
- **@type:** class
- **@description:** Clase con utilidades para la escucha de cambios en ficheros de DevToolkit

----

- **@name:** DevToolkit.FileWatcher.Refrescador
- **@type:** class
- **@description:** Devuelve la instancia de refrescador. Presupone el fichero `__dirname + "/refrescador.api.dist.js"`. Esta API está documentada en [https://github.com/allnulled/refrescador](https://github.com/allnulled/refrescador).

----

- **@name:** DevToolkit.FileWatcher.start
- **@type:** static method
- **@parameter:** options:Object - Opciones que se le pasarán al refrescador.
- **@description:** Llama al `run` del refrescador.

----

- **@name:** DevToolkit.FileSystem
- **@type:** class
- **@description:** Clase con utilidades para gestión del sistema de ficheros y carpetas.

----

- **@name:** DevToolkit.FileSystem.exists
- **@type:** static method
- **@parameter:** dir:String - Fichero o directorio absoluto
- **@returns:** Promise<Object|false> - Lo mismo que fs.promises.lstat. Si falla, silencia el error y devuelve false.
- **@description:** Comprueba si un fichero o directorio vive en la ruta proporcionada.

----

- **@name:** DevToolkit.FileSystem.existsDirectory
- **@type:** static method
- **@parameter:** file:String - Ficero absoluto
- **@returns:** Promise<Boolean> - Devuelve true si es un fichero, false en cualquier otro caso.
- **@description:** Comprueba si un fichero vive en la ruta proporcionada.

----

- **@name:** DevToolkit.FileSystem.readFile
- **@type:** static method
- **@parameter:**
   - dir:String - Fichero absoluto
   - options:Object - Opciones. Ahora mismo solo permite `inTry:Boolean=false`, que en `true` silenciará el error, y devolverá `false`.
- **@returns:** Promise<String> - El contenido de un fichero en utf8.
- **@description:** Devuelve el contenido de un fichero.

----

- **@name:** DevToolkit.FileSystem.writeFile
- **@type:** static method
- **@parameter:**
   - file:String - Fichero absoluto
   - contents:String - Contenido con el que sobreescribir
   - options:Object - Opciones pasadas. Ahora mismo no admite nada.
- **@returns:** Promise<void> - Devuelve lo mismo que fs.promises.writeFile
- **@description:** Sobreescribe un fichero con el contenido especificado.

----

- **@name:** DevToolkit.FileSystem.deleteFile
- **@type:** static method
- **@parameter:**
   - dir:String - Fichero absoluto
   - options:Object - Opciones. Ahora mismo solo acepta `inTry:Boolean=false`, que en `true` falla silenciosamente.
- **@returns:** Promise<void> - Lo mismo que fs.promises.unlink
- **@description:** Elimina un directorio, recursivamente.

----

- **@name:** DevToolkit.FileSystem.existsDirectory
- **@type:** static method
- **@parameter:** dir:String - Directorio absoluto
- **@returns:** Promise<Boolean> - Devuelve true si es un directorio, false en cualquier otro caso.
- **@description:** Comprueba si un directorio vive en la ruta proporcionada.

----

- **@name:** DevToolkit.FileSystem.readDirectory
- **@type:** static method
- **@parameter:**
   - dir:String - Directorio absoluto
   - options:Object - Opciones. Ahora mismo solo permite `inTry:Boolean=false`, que en `true` silenciará el error, y devolverá `false`.
- **@returns:** Promise<Array<String>> - Los ficheros y directorios contenidos dentro.
- **@description:** Devuelve los contenidos de un directorio.

----

- **@name:** DevToolkit.FileSystem.writeDirectory
- **@type:** static method
- **@parameter:** dir:String - Directorio absoluto
- **@returns:** Promise<void> - Devuelve lo mismo que fs.promises.mkdir
- **@description:** Construye un directorio

----

- **@name:** DevToolkit.FileSystem.deleteDirectory
- **@type:** static method
- **@parameter:**
   - dir:String - Directorio absoluto
   - options:Object - Opciones. Ahora mismo solo acepta `inTry:Boolean=false`, que en `true` falla silenciosamente.
- **@returns:** Promise<void> - Lo mismo que fs.promises.rm
- **@description:** Elimina un directorio, recursivamente.

----

- **@name:** DevToolkit.FileSystem.emptyDirectory
- **@type:** static method
- **@parameter:**
   - dir:String - Directorio absoluto
   - options:Object - Opciones. Ahora mismo solo acepta `inTry:Boolean=false`, que en `true` falla silenciosamente.
- **@returns:** Promise<void> - Lo mismo que fs.promises.mkdir
- **@description:** Elimina un directorio recursivamente, y luego lo crea, lo cual al final es como haberlo vaciado.

----

- **@name:** DevToolkit.FileSystem.fromDirectoryToObject
- **@type:** class method
- **@parameter:**
   - dir:String - Directorio absoluto.
   - options:Object - Opciones. Admite un `filter:Function<fsnode:String>:Boolean` para usar como filtro y discriminar qué partes del directorio no quieres incluir en la representación. Esto puede ser útil si quieres que 1 fichero contenga la representación final de la estructura del directorio, y así evitas que la representación objetual se haga incremental.
- **@returns:** Promise<Object> - Representación objetual del directorio proporcionado.
- **@description:** Construye la representación objetual de un directorio.

----

- **@name:** DevToolkit.FileSystem.prototype.fromObjectToDirectory
- **@type:** class method
- **@parameter:**
   - obj:Object - Representación objetual de un directorio.
   - dir:String - Directorio raíz donde se quiere reconstruir la representación objetual
- **@returns:** Promise<void>
- **@description:** Reconstruye un directorio a partir de una representación objetual de directorio, y el directorio raíz.
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.sizeOf
- **@type:** static method
- **@parameter:** dir:String - Fichero absoluto
- **@returns:** Promise<Integer> - El tamaño de un fichero o directorio
- **@description:** Devuelve el tamaño de un fichero o directorio

----

- **@name:** DevToolkit.FileSystem.constructor
- **@type:** class constructor
- **@sets:** toolkit:DevToolkit
- **@description:** Construye una instancia.

----

- **@name:** DevToolkit.FileSystem.prototype.exists
- **@type:** class method
- **@parameter:** file:String - Fichero o directorio, puede ser relativo.
- **@returns:** Promise<Boolean>
- **@description:** Dice si existe un fichero o directorio en la ruta proporcionada
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.existsFile
- **@type:** class method
- **@parameter:** file:String - Fichero, puede ser relativo.
- **@returns:** Promise<Boolean>
- **@description:** Dice si existe un fichero (no directorio) en la ruta proporcionada
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.readDirectory
- **@type:** class method
- **@parameter:** file:String - Fichero, puede ser relativo.
- **@returns:** Promise<Array<String>>
- **@description:** Lee un fichero y devuelve su contenido en utf8
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.writeFile
- **@type:** class method
- **@parameter:**
   - file:String - Fichero, puede ser relativo.
   - contents:String - Contenido del fichero
- **@returns:** Promise<void>
- **@description:** Sobreescribe un fichero con fs.promises.writeFile
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.deleteFile
- **@type:** class method
- **@parameter:**
   - file:String - Fichero
   - options:Object - Opciones pasadas a su homólogo estático.
- **@returns:** Promise<void>
- **@description:** Elimina un fichero.
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.exists
- **@type:** class method
- **@parameter:** dir:String - Directorio, puede ser relativo.
- **@returns:** Promise<Boolean>
- **@description:** Dice si existe un directorio en la ruta proporcionada
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.readDirectory
- **@type:** class method
- **@parameter:** dir:String - Directorio, puede ser relativo.
- **@returns:** Promise<Array<String>>
- **@description:** Lee un directorio y devuelve sus rutas
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.writeDirectory
- **@type:** class method
- **@parameter:** file:String - Directorio, puede ser relativo.
- **@returns:** Promise<void>
- **@description:** Crea un directorio con fs.promises.mkdir
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.deleteDirectory
- **@type:** class method
- **@parameter:**
   - dir:String - Directorio
   - options:Object - Opciones pasadas a su homólogo estático.
- **@returns:** Promise<void>
- **@description:** Elimina un directorio.
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.emptyDirectory
- **@type:** class method
- **@returns:** Promise<void>
- **@description:** Vacía un directorio pero no lo elimina.
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.fromDirectoryToObject
- **@type:** class method
- **@parameter:** file:String - Directorio, puede ser relativo.
- **@returns:** Promise<Object>
- **@description:** Construye la representación objetual de un directorio.
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.fromObjectToDirectory
- **@type:** class method
- **@parameter:**
   - obj:Object - Representación objetual de un directorio.
   - dir:String - Directorio raíz donde se quiere reconstruir la representación objetual
- **@returns:** Promise<void>
- **@description:** Reconstruye un directorio a partir de una representación objetual de directorio, y el directorio raíz.
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.sizeOf
- **@type:** class method
- **@parameter:** file:String - fichero, puede ser relativo.
- **@returns:** Promise<Integer> - El size que devuelve el lstat de node.js
- **@description:** Lee el lstat del fichero y devuelve el resultado.
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.Templating
- **@type:** class
- **@description:** Utilidades para plantillas de texto de DevToolkit

----

- **@name:** DevToolkit.Templating.Tjs
- **@type:** static class
- **@description:** Es la clase que gestiona las plantillas de "templated-js". Está documentada aquí: [https://github.com/allnulled/templated-js](https://github.com/allnulled/templated-js). Puede tener ligeras variaciones, como el hack en `include` e `includeSync` que fabrica el fichero si no lo encuentra.

----

- **@name:** DevToolkit.Templating.constructor
- **@type:** class constructor
- **@parameter:** toolkit:DevToolkit - Instancia de DevToolkit.
- **@sets:**
   - this.toolkit:DevToolkit - Con el parámetro proporcionado.
   - this.tjs:Tjs - Instancia de [Tjs](https://github.com/allnulled/templated-js) que ya conoce el `this.toolkit.basedir` y permite rutas relativas
- **@description:** Construye un gestor de plantillas para DevToolkit. Utiliza [Tjs](https://github.com/allnulled/templated-js)

----

- **@name:** DevToolkit.Time
- **@type:** class
- **@description:** Clase con utilidades para tiempo.


----

- **@name:** DevToolkit.constructor
- **@type:** class constructor
- **@parameter:** basedir:String - Ruta raíz de proyecto para la instancia. Por defecto, se utiliza el `process.cwd()`.
- **@sets:**
   - this.basedir:String - Ruta raíz. Se construye con `path.resolve` y el parámetro `basedir`
   - this.fileSystem:DevToolkit.FileSystem - Utilidades para sistema de ficheros
   - this.cli:DevToolkit.CommandLine - Utilidades para línea de comandos
   - this.documentator:DevToolkit.Documentator - Utilidades para documentación
   - this.testing:DevToolkit.Testing - Utilidades para testeo
   - this.templating:DevToolkit.Templating - Utilidades para plantillas
   - this.events:DevToolkit.Events - Utilidades para eventos de la escucha a cambios en ficheros
   - this.semaphore:DevToolkit.Semaphore - Utilidades para semáforos. Presupone el fichero `semaphore.dev-toolkit.txt` para la gestión del semáforo.
   - this.assert:DevToolkit.Assert - Utilidades para aserciones
- **@description:** En la construcción de DevToolkit se establecen las propiedades. En general, lo que consigues creando estas instancias es facilitar que los métodos de ellas conozcan la ruta raíz del proyecto, y así no tener que estar combinándolas con `DevToolkit.prototype.fullpathOf` manualmente en cada caso.

----

- **@name:** DevToolkit.prototype.fullpathOf
- **@type:** class method
- **@parameter:** subpath:String - ruta relativa al `DevToolkit.prototype.basedir`
- **@returns:** String - ruta completa resultante. 
- **@description:** Reconstruye la ruta completa a partir de una ruta relativa. Utiliza `path.resolve` con el `this.basedir`.

----

- **@name:** DevToolkit.prototype.subpathOf
- **@type:** class
- **@parameter:** absolutePath:String - ruta relativa al `DevToolkit.prototype.basedir`
- **@returns:** String - ruta relativa resultante. 
- **@throws:** Error - Si la proporcionada no es una ruta relativa al `this.basedir`, lanza un error con `Provided file is not a subpath of...`.
- **@description:** Se asegura que la ruta absoluta proporcionada es relativa al `this.basedir`, y devuelve la ruta relativa resultante.



## Conclusión

La modulación en JavaScript desde la industria actual:

- no facilita la compactación natural del código
   - porque delega este aspecto a los bundlers
   - y los bundlers tienen su propio método para modular código
   - e implica no poder fragmentar el código en las piezas lógicas reutilizables reales
      - sino en piezas que tienen que poder expresarse en funciones
      - y esto no permite optimizar el código en tiempo de ejecución
      - ni tampoco reutilizar fragmentos con metacódigo
      - mientras que este proyecto sí
- tampoco facilita la modulación lógica del código a través de los 2 entornos principales (browser y node)
   - ni el require ni el global existen en el browser
   - ni el window existe en node.js
   - ni contaminar globales sería lo mejor para mantener limpio el espacio de nombres y el control automático sobre los módulos
   - existen alternativas fragmentadas, como [SystemJS](https://github.com/systemjs/systemjs) y modulación por [AMD](https://requirejs.org/docs/whyamd.html), por ejemplo
   - pero el consenso está en las sintaxis de `import/export`, donde:
      - los bundlers le dan un uso
      - los metalenguajes como TypeScript le dan otro uso
      - los sistemas de carga embedidos también
         - en node.js te rompe el uso de `require` global si pones `type:"module"` en el `package.json`
         - en el browser se vuelve un infierno de llamadas *AJAX* que no siempre van a ser compatibles con las configuraciones que especifica cada librería/proyecto que puede interesarte
            - aunque es atractivo poder usar los `node_modules` desde el browser
            - al final resulta en algo engañoso y que fácilmente se va a ver roto
- la conclusión fue desechar absolutamente el sistema de modulación propuesto por la industria
   - y perderse en intentos para parchear este dominio tan fundamental: la compilación y modulación del código js
- con este proyecto sí puedes:
   - compilar js final de forma eficiente
      - permitiéndote mucha más libertad de modulación
      - incluyendo metalógica para reusar (meta-)módulos
   - modular js de forma predecible
      - no promete que puedas reutilizar módulos del `node_modules`
      - porque solo funciona con rutas relativas específicas a puntos que tú mismo señales
      - pero sí gran libertad y eficiencia de modulación si te limitas a estas directivas previas

Entonces:

- han sido varios intentos y
- no prometo que todavía quede alguno más, pero
- después de estudiar las diferentes fórmulas para conseguir estas 2 sencillas cosas (compilación y modulación)
   - la conclusión parece estar mucho más madurada que
      - una sintaxis mágica `import/export`
      - que te permita resolver este problema
      - pero que por la congestión de la necesidad de esta feature
         - al final resulta en una sintaxis ambigua
         - que no te va a aclarar qué uso se le está dando en cada caso
         - y que al final resulta en un trato injusto para JavaScript
            - dejándolo como un lenguaje de scripting de broma para salir del paso
            - cuando personalmente, pues, discrepo

Veremos entonces:

- cuál es el uso que le quieren dar nuevos proyectos de JavaScript tan prometedores como Bun.js
   - pero ya sin mucha fe después de ver lo que ha estado haciendo la industria con el estándar
   - que pensábamos que era difícil tirarlo por tierra
   - pero que con el tiempo ya va asomando la posibilidad de que:
      - con todo lo que cuesta estandarizar algo como JS
      - son capaces de romperlo
      - aunque en principio, siempre (confiando en V8 y webkit) se podrá volver a las versiones anteriores del lenguaje
         - donde JavaScript se mantenía en un dominio prudente basado en la experticia y la experiencia
         - y las sintaxis en general, al menos a primera vista, no parecían trampas infernales donde perderte intentando compatibilizar y armonizar código de diferentes proyectos

Por tanto, aunque puede ser mejorable, este acercamiento para estos 2 temas me resulta mucho más **sensato** y **respetuoso**.

El tema de perder el control de las dependencias con `import/export`, que fue el principal motivante del proyecto, queda como anecdótica ventaja una vez has llegado a aquí. El `V5` del `Moduler` es solo para dejar claro que había que darse unos cuantos... intentos y fracasos, antes de llegar a lo que parece una solución mínimamente satisfactoria.