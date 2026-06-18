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

- La API, en general, son clases e instancias de clase anidadas.
- DevToolkit es un superconjunto de ModulerV5
   - O ModulerV5 es un subconjunto de DevToolkit
   - Quiere decir que si importar DevToolkit ya importas ModulerV5 automáticamente
   - Esto se hace así porque:
      - DevToolkit es código para el compilation-time
         - Tiene todo lo necesario para la modulación/compilación en el compilation-time
         - Principalmente, se incluyó a ModulerV5 para poder compilar el CSS en el compilation-time
            - Pero el CssModuler requiere de ModulerV5
            - Así que al final, he decidido incluir todo el ModulerV5 en el DevToolkit y ya está
      - ModulerV5 es código para el run-time
         - Se encarga de la modulación del JS y el CSS en run-time
         - Tiene lo mínimo necesario para la modulación en el run-time
         - Se separa de DevToolkit para contaminar lo menos posible el run-time

## Especificaciones

⚠️ En construcción.

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
         - tiene algún hack añadido, en `include` e `includeSync`, que puede no reflejarse en el proyecto original
      - `js-beautify: ^1.15.4`

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

**{@root}/moduler-v5/moduler-v5.dist.js**

----

- **@name:** ModulerV5
- **@type:** class
- **@description:** Clase útil para modulación en runtime de JavaScript y CSS.
- **@exports:**
   - window.ModulerV5 - Para poder encontrarla en el browser globalmente
   - global.ModulerV5 - Para poder encontrarla en node.js globalmente
   - module.exports - Para poder importarla en node.js con require o import
- **@file:** moduler-v5.dist.js

----

- **@name:** ModulerV5.default
- **@type:** static property
- **@description:** Una referencia a la misma clase, para poder importarla con `import` además de con `module.exports`.

----

- **@name:** ModulerV5.CssModuler
- **@type:** class
- **@description:** Clase encargada de gestionar la modulación en runtime de ficheros y sincronización en runtime de estilos CSS

----

- **@name:** ModulerV5.CssModuler.create
- **@type:** static method
- **@description:** Método típico para facilitar la creación de la clase.

----

- **@name:** ModulerV5.fakeCssStyleSheet
- **@type:** static method
- **@returns:** fakeStyleSheet:FakeCssStyleSheet
- **@description:** Devuelve una CSSStyleSheet de tipo fake, para polifilear lo mínimo en entornos no-navegador.

----

- **@name:** ModulerV5.CssModuler.symbols
- **@type:** static property + Object
- **@description:** Contiene las regex usadas por la clase, como la del `/ *@requires:...* /`.

----

- **@name:** ModulerV5.CssModuler.constructor
- **@type:** class constructor
- **@parameter:** moduler:ModulerV5 - Instancia de ModulerV5 para esta instancia de CssModuler. 
- **@sets:**
   - this.moduler:ModulerV5 - Del parámetro proporcionado.
   - this.sheets:`Object<String>` - Objeto con los códigos CSS asociados con el fichero que los introdujo
   - this.entry:CSSStyleSheet|FakeCssStyleSheet - Propiedad que guarda y sincroniza el CSS. Se basa en la clase oficial del estándar de los navegadores, pero en node.js se polifilea con un objeto propio.
- **@description:** Método constructor. Después de establecer las propiedades, inyecta la CSSStyleSheet en el document.adoptedStyleSheets, aunque esté vacía, que lo está.

----

- **@name:** ModulerV5.CssModuler.prototype.sheets
- **@type:** class property + `Object<String,{ id:String, source:String, requires:Array<String> }>`
- **@description:**
   - Objeto con la metainformación de todas las hojas CSS añadidas en la instancia.
   - Esta metainformación se compone de un id:String, un source:String y un `requires:Array<String>`.
----

- **@name:** ModulerV5.CssModuler.prototype.entry
- **@type:** class property + CSSStyleSheet|FakeCssStyleSheet
- **@description:**
   - Objeto nativo del browser (CSSStyleSheet) o polyfill propio en entornos no-browser (FakeCssStyleSheet) para hacer (o fake-polifilear) la inyección de estilos en la página.
   - De este objeto, lo que se va a usar es el método `.replace(source:String)`.
----

- **@name:** ModulerV5.CssModuler.prototype.assert
- **@type:** class method
- **@parameter:**
   - condition:Boolean - Condición que se aserciona
   - message:String - Mensaje de error en caso de la aserción fallar
- **@description:** Método propio para hacer aserciones locales en algunos métodos.

----

- **@name:** ModulerV5.CssModuler.prototype.add
- **@type:** class method
- **@parameter:**
   - input1:String - Ruta al fichero css. Se usa el método `ModulerV5.prototype.fullpathOf` para normalizar.
   - eventToAdd:Object - Objeto del evento de añadir. Usa las propiedades oldSheets, newSheets y count.
- **@returns:** eventToAdd:Object - Objeto que representa el evento de añadir.
- **@sets:**
   - eventToAdd.oldSheets - Va poniendo las sheets que ya se conocían en this.sheets, antes de iniciar el evento de añadir.
   - eventToAdd.newSheets - Va poniendo las sheets que no se conocían en this.sheets antes de iniciar el evento de añadir.
   - eventToAdd.count - Va incrementando el contador a medida que las va encontrando.
- **@description:** Añade recursivamente, llamando a this.add recursivamente y pasándole el mismo objeto del evento de añadir, las dependencias especificadas con comentarios css que cumplan el patrón: `/ *@requires:fichero.css* /`
- **@explanation:**
   - Añade la hoja especificada, en old o new. Si está en old, no la analiza. Pero si entra en newSheets, analiza el contenido para extraer los `/ *@requires:fichero.css* /`, y los añade con `this.add` recursivamente.
   - Los objetos que representan a cada fichero css tienen las propiedades id:String, source:String, requires:`Array<String>`.
   - Otro dato importante es que en cada nuevo fichero/dependencia, crea un ModulerV5 diferente, con una ruta propia fijada al fichero css que se está incluyendo. De esta forma, el fichero css soporta rutas relativas, y puedes importar ficheros así: `/ *@requires:./fichero.css* /`
----

- **@name:** ModulerV5.CssModuler.prototype._sortSheets
- **@type:** private method
- **@parameter:** eventToSync:Object - Se usarán las propiedades dependencies y counter
- **@returns:** void - Nada.
- **@description:** Método que ordena según la inter-dependencia de los ficheros css añadidos en la instancia, donde los que dependen van después de sus propias dependencias.
- **@sets:**
   - eventToSync.dependencies - Especifíca en el objeto del evento de sincronización todas las dependencias acumuladas.
   - eventToSync.counter - Especifíca también la cantidad de dependencias acumuladas (el length del anterior, vaya).
----

- **@name:** ModulerV5.CssModuler.prototype._generateSource
- **@type:** private method
- **@parameter:** eventToSync:Object - Se usará su propiedad eventToSync.dependencies y eventToSync.source
- **@returns:** void - Nada.
- **@description:** Este método acumula el css de las dependencias especificadas y lo vuelva en eventToSync.source.
- **@explanation:**
   - En el camino pone una cabecera para cada dependencia, para que en el resultado se pueda distinguir el fragmento de cada dependencia css.
   - Las cabeceras son: **!original** con la ruta del fichero y **!order** con el número ordinal de la dependencia.
   - También hace un reemplazo de los `@requires:fichero.css` por `!requires:fichero.css`, lo cual permite que cualquier css compilado, pueda usarse, sin problemas de recursividad, como dependencia de otro css que quiere ser compilado.
----

- **@name:** ModulerV5.CssModuler.prototype._synchronizeSource
- **@type:** private method
- **@parameter:** eventToSync:Object - Se usará la propiedad source:String
- **@returns:** `Promise<void>` - Nada
- **@description:** Sincroniza el CSS de la página con las hojas añadidas en la instancia. Se llama al método CSSStyleSheet.prototype.replace. En entornos no-navegador, usará el polifill propio, así no explote en ningún entorno.

----

- **@name:** ModulerV5.CssModuler.prototype._exportSource
- **@type:** private method
- **@parameter:**
   - eventToSync:Object - Objeto del evento de sincronización. Se usará su propiedad source:String.
   - options:Object - Objeto de opciones de la sincronización. Se usará su propiedad outFile:String.
- **@returns:** `Promise<void>` - No devuelve nada concreto
- **@description:** Método que exporta el CSS acumulado en esta instancia, a un fichero. Lo que hace es que escribe en el fichero especificado en options.outFile el código acumulado en el eventToSync.source.

----

- **@name:** ModulerV5.CssModuler.prototype.add
- **@type:** class method
- **@parameter:** input1:String - Ruta del fichero css a eliminar. Se usa el método `ModulerV5.prototype.fullpathOf` para normalizar.
- **@returns:** this:ModulerV5.CssModuler - Devuelve la instancia propia por si se quiere hacer chaining.
- **@asserts:** id in this.sheets - Comprueba que el id existe en this.sheets o lanza un error de aserción.
- **@deletes:** this.sheets[id] - Elimina el fichero css del this.sheets
- **@description:** Elimina un fichero css añadido previamente del this.sheets. No hace recursión, se elimina la hoja suelta, y esto puede producir inconsistencias. Usar con coherencia con esto, o evitar de usarlo.

----

- **@name:** ModulerV5.CssModuler.prototype.synchronize
- **@type:** class method
- **@parameter:** options:Object - Se usa la propiedad outFile:String|false, opcionalmente, si quieres exportar el css a un fichero.
- **@returns:** `Promise<eventToSync:Object>` - Devuelve el evento de sincronización.
- **@description:** Sincroniza el css de la página con el css de la instancia.
- **@calls:**
   - this._sortSheets - Primero ordena los css
   - this._generateSource - Segundo genera el css resultante, la resolución recursiva ya se ha hecho en el `this.add`, aquí solo se recoge lo ya descargado
   - this._synchronizeSource - Tercero sincroniza el css de la página
   - this._exportSource - Cuarto exporta el css al fichero indicado en options.outFile, si es que se especifica.
----

- **@name:** ModulerV5.create
- **@type:** static method
- **@description:** Constructor que evita el `new`.

----

- **@name:** ModulerV5.constructor
- **@type:** class constructor
- **@parameter:** ...args:`Array` - Tiene varias firmas posibles.
- **@signature:**
   - ...args:[] - Sin parámetros. Esto resulta en: basedir, rootdir, definitions y css, todos por defecto.
   - ...args:[String|ModulerV5|null] - Con 1 parámetro tipo String u ModulerV5 o null. Si es String, especificas el basedir y el rootdir. Si es ModulerV5, especificas los mismos basedir, rootdir, definitions y css que la instancia que le pasas.
   - ...args:[ModulerV5,String] - Con 2 parámetros, el primero tipo ModulerV5 y el segundo tipo String. Aquí heredas los basedir, rootdir, definitions y css del ModulerV5, y con el segundo como String sobreescribes el basedir. Útil para cuando quieres usar un ModulerV5 pero que capte rutas relativas a otro directorio.
- **@sets:**
   - this.basedir:String - Ruta del directorio base. Se usa como base para resolver rutas relativas.
   - this.rootdir:String - Ruta del directorio base original, el primer basedir de la cadena de herencia. Cuando heredas otro ModulerV5, esta propiedad se mantiene a través de toda la cadena de herencia. Útil para no perder el directorio raíz del proyecto a través de diferentes instancias ModulerV5.
   - this.definitions:Object - Objeto con todas las referencias conocidas por el ModulerV5.
   - this.css:CssModuler - Gestor de dependencias CSS. Una instancia de ModulerV5.CssModuler.
   - this.isBrowser:Boolean - Sirve para saber rápidamente si estás en un navegador o no. Se saca de `typeof window !== "undefined"`.
- **@defaults:**
   - this.basedir - Por defecto, en navegador es `window.location.origin + window.location.pathname` y en node.js es `process.cwd()`.
   - this.rootdir - Por defecto, es el this.basedir.
   - this.definitions - Por defecto, es un objeto vacío.
   - this.css - Por defecto, es una nueva instancia de CssModuler.
- **@description:**
   - Método constructor de instancias de ModulerV5. El constructor de ModulerV5 tiene una lógica un poco extensa, porque:
   - Tiene que cubrir los casos donde se cambia el directorio base, y de esta forma puede ocuparse de las rutas relativas de forma más o menos eficiente, porque aunque es una instancia de modulador distinta:
   - El modulador de css es el mismo objeto (porque en la herencia se transmite el mismo objeto `css` y sus cambios afectan a toda la cadena de herencia igual)
   - El modulador de js es el mismo objeto (porque en la herencia se transmite el mismo objeto `definitions`, con lo que una nueva definición afecta también a toda la cadena de herencia)
   - Mientras que por otro lado permite usar rutas relativas tanto para módulos css como js
- **@note:**
   - La herencia entre instancias ModulerV5 implica que **no es conveniente** retener instancias locales de `ModulerV5` para lógica de funciones.
   - Es mejor usar la instancia global para esto, y así evitar retener diferentes objetos.
   - El uso de las instancias locales se reduce a llamadas de primer nivel superficial, que te permitan usar rutas locales.
   - Esto último, en la modulación CSS es inevitable, así que no es problema.
   - En cuanto a JavaScript, lo que implica es que no conviene usar `LocalDictionary` dentro de funciones, porque vas a provocar retener diversas instancias ModulerV5 en la memoria del motor de V8, y aunque no sea muy crítico en principio, es una mala práctica que va a polucionar innecesariamente la memoria. De requerirlo, usar mejor la instancia global de `ModulerV5.Dictionary`, que es única en todo el programa, lo único que pierdes es la capacidad de especificar rutas relativas.
----

- **@name:** ModulerV5.prototype.isBrowser
- **@type:** class prototype + Boolean
- **@description:** Flag que indica si se está funcionando en navegador o no. Se aclara por la expresión `typeof window !== "undefined"`.

----

- **@name:** ModulerV5.prototype.rootdir
- **@type:** class property + String
- **@in-constructor:** 
- **@not-prototype:** 
- **@description:** Propiedad del ModulerV5 que indica el this.basedir del ModulerV5 más alto en la cadena de clonación. Por clonación se entienden las instancias creadas por los métodos cloneForFile y cloneForDirectory, o cualquier instancia que se haya creado pasándole otra instancia de ModulerV5 en los parámetros del constructor.

----

- **@name:** ModulerV5.prototype.basedir
- **@type:** class property + String
- **@in-constructor:** 
- **@not-prototype:** 
- **@description:** Propiedad del ModulerV5 que indica el directorio base de la instancia. Se diferencia del rootdir porque no tiene por qué coincidir con el this.basedir del ModulerV5 más alto de la cadena de clones.

----

- **@name:** ModulerV5.prototype.definitions
- **@type:** class property + `Object<String,any>`
- **@in-constructor:** 
- **@not-prototype:** 
- **@description:** Objeto con las definiciones retenidas por la instancia de ModulerV5.

----

- **@name:** ModulerV5.prototype.css
- **@type:** class property + CssModuler
- **@in-constructor:** 
- **@not-prototype:** 
- **@description:** Instancia de ModulerV5.CssModuler asociada a este ModulerV5. En una misma cadena de clonación se comparte el mismo CssModuler. Esto implica que un cambio en el this.css desde cualquier punto de la cadena de clones, afecta igual y simultáneamente a toda la cadena.

----

- **@name:** ModulerV5.inspectToString
- **@type:** static method
- **@parameter:**
   - args:`Array|Arguments` - Argumentos o array con lo que quieras inspeccionar.
   - debugLevel:Integer = 0 - Nivel de debugging. Por defecto 0. Tiene que ser entre 0, 1 y 2.
- **@returns:** String - Representación de la inspección de los valores.
- **@description:** Devuelve un string que explora mínimamente lo que se pasa. Da el número (L0), da el tipo (L1) o da el tipo y la stringificación (L2).

----

- **@name:** ModulerV5.stringify
- **@type:** static method
- **@parameter:** it:any - Cualquier cosa que sea stringificable por el método mismo.
- **@returns:** String|any - Devuelve la stringificación, o si da error, el parámetro tal cual.
- **@description:** Actualmente solo llama a JSON.stringify, no hay un método más allá de stringificación.

----

- **@name:** ModulerV5.prototype.isTracing
- **@type:** class property + Boolean=false
- **@defaults:** false - Por defecto, el traceo está desactivado.
- **@description:** Flag para saber si se está traceando o no. Repercute a la instancia de ModulerV5.

----

- **@name:** ModulerV5.prototype.trace
- **@type:** class method
- **@parameter:**
   - method:String - Método que estás traceando
   - args:Array|Arguments - Lista de valores que quieres inspeccionar al tracear. Se le pasarán al `ModulerV5.inspectToString`
- **@description:** Método de traceo. Consulta al this.isTracing para saber si debe imprimir o evitar.

----

- **@name:** ModulerV5.prototype.assert
- **@type:** class method
- **@parameter:**
   - condition:Boolean - Condición a comprobar
   - message:String - Mensaje del error, lanzado si la condición no se cumple.
- **@description:** Método de aserción interno.

----

- **@name:** ModulerV5.prototype.normalizationOf
- **@parameter:**
   - subpath:String - Subruta que se quiere normalizar.
   - debug:Boolean = false - Flag por si quieres debugar la ruta final antes de llamar al return.
- **@returns:** String - Ruta normalizada en su versión absoluta.
- **@supports:**
   - Caso 1. Ruta protocolizada. Acepta `http://`, `https://`, `file://`, o cualquiera que contenga el patrón `://`. Se resuelve tal cual.
   - Caso 2. Ruta relativa. Cuando empieza con `./`. Se resuelve prependizando el this.basedir.
   - Caso 3. Ruta relativa al directorio superior. Cuando empieza con `../`. Se resuelve prependizando el this.basedir + "/..".
   - Caso 4. Ruta relativa al directorio raíz. Cuando empieza con `@/`. Se resuelve prependizando el this.rootdir.
   - Caso 5. Ruta absoluta estilo Linux. Cuando empieza con `/`. Se resuelve tal cual.
   - Caso 6. Otros casos. Se resuelve prependizando this.basedir.
- **@description:**
   - Devuelve la normalización de una ruta (relativa, relativa superior, protocolizada, etc) en su representación absoluta.
   - La idea es que el resultado de esta llamada da un identificador único para un recurso único, y siempre el mismo identificador único, de modo que si 2 rutas escritas de formas diferentes apuntan al mismo recurso, la normalización devuelve el mismo String en ambos casos.
   - Este método soporta mútliples casos.
   - Este método está un poco sobrecargado (lo cual no es bueno), para evitar casos raros y conductas poco predecibles.
- **@explanation:**
   - El método sigue varios pasos:
   - 1. Discrimina el caso de uso, lo interpreta y obtiene las partes
   - 2. De las partes, elimina las vacías, corrige los saltos a directorios superiores (..) o actuales (.) y neutraliza repetición de separadores (no protocolarios)
   - 3. Vuelve a juntar las partes y elimina la barra final (a no ser que sea el root de Linux)
   - 4. Devuelve la ruta final, imprimiéndola si se ha pedido debugar.
----

- **@name:** ModulerV5.prototype.fullpathOf
- **@parameter:** subpath:String - Subruta de la que se quiere extraer la ruta absoluta.
- **@returns:** String - Ruta absoluta.
- **@description:**
   - Retorna la ruta absoluta de una ruta relativa al this.basedir.
   - En realidad, retorna una llamada a this.normalizationOf(subpath)
----

- **@name:** ModulerV5.prototype.relpath
- **@parameter:** subpath:String - Subruta o ruta. Será normalizada por this.fullpathOf.
- **@returns:** `String` - Representación de la ruta relativa al this.rootdir.
- **@description:**
   - Devuelve la ruta relativa al this.rootdir.
   - La ruta devuelta siempre empieza por `@/` que es la representación del this.rootdir que usa este framework.
----

- **@name:** ModulerV5.prototype.importModule
- **@type:** class method
- **@parameter:**
   - subpath:String - Subruta a importar.
   - injection:Object = {} - Variables inyectadas en el script que se importa.
- **@returns:** `Promise<any>` - Lo devuelto por la llamada a la factoría del módulo especificado. Esto implica a `this.readPath` y a `this._callModuleFactory`. Por el camino se usan `this.cloneForFile` y `this.normalizationOf` con el `subpath`.
- **@description:** Este método es un wrapper de _callModuleFactory que usa this.readPath y el constructor de AsyncFunction.
- **@explanation:**
   - Primero hace un this.readPath del subpath para extraer el código.
   - Segundo crea una función con el código extraído, usando el constructor AsyncFunction.
   - En este punto, entiende estas variables en los parámetros: `\`[${Object.keys(injection).join(",")}]\`, "module", "exports", "LocalDictionary", "__filename", "__dirname"`
   - Tercero, llama al this._callModuleFactory y retorna lo que esta devuelva.
   - En este punto, al this._callModuleFactory le pasa estas variables: `Object.values(injection), asyncFunction, this.cloneForFile(subpath), subpath, this.normalizationOf(subpath + "/..")`
----

- **@name:** ModulerV5.prototype.readPath
- **@parameter:** file:String - Ruta. Puede ser relativa. Acepta fichero (en node.js) o URL (en browser).
- **@returns:** `Promise<String>` - El contenido utf8 del fichero o de la URL.
- **@description:** Devuelve el contenido de un fichero o URL, aceptando rutas relativas.

----

- **@name:** ModulerV5.prototype.readUrl
- **@parameter:** url:String - URL. Puede ser relativa.
- **@returns:** `Promise<String>` - El contenido utf8 de la URL.
- **@description:** Devuelve el contenido de la URL, aceptando rutas relativas.

----

- **@name:** ModulerV5.prototype.readFile
- **@parameter:** file:String - Ruta a fichero. Puede ser relativa porque será pasada por this.fullpathOf.
- **@returns:** `Promise<String>` - El contenido utf8 del fichero.
- **@description:** Devuelve el contenido de un fichero, aceptando rutas relativas.

----

- **@name:** ModulerV5.prototype.knows
- **@type:** class method
- **@parameter:** id:String - Ruta de un módulo en this.definitions.
- **@returns:** Boolean - Si se conoce el id o no por this.definitions.
- **@description:** Aclara si la instancia conoce una ruta de módulo o no. Se utiliza el método this.normalizationOf con el id para normalizar la ruta, por lo cual soporta rutas relativas.

----

- **@name:** ModulerV5.prototype.define
- **@parameter:** `...args:Array` - Soporta varias firmas
- **@signature:**
   - `...args:[factory:Function]` - Solo 1 función, que se entiende como factoría.
   - `...args:[dependencies:Array, factory:Function]` - Función factoría precedida por array de dependencias. Las dependencias pueden ser varias cosas.
- **@returns:**
   - `Promise<any>` - Devuelve una promesa con lo que devuelve o exporta la factoría que se le pasa como parámetro.
   - Devuelve lo que devolvería `this._callModuleFactory(dependencyPromises, factory)`.
   - Teniendo en cuenta que dependencyPromises se construye mapeando `dependencies` a través de `this.mean(dependency)`.
   - Pero hay que mirar el método `_callModuleFactory` para entender este método bien.
   - Se mantiene separado porque ese método también se llama en el `this.mean`.
- **@description:**
   - Resuelve una factoría, inyectándole las dependencias especificadas.
   - Se puede dividir en 3 pasos:
   - 1. Validar parámetros. Se cerciora que los parámetros estén cumpliendo con alguna de las firmas antes especificadas.
   - 2. Resolver dependencias. Esto es que se llama al `this.mean(dependency)` y se construye `dependencyPromises` como un array de promesas.
   - 3. Resolver módulo. Esta parte consiste en llamar a `this._callModuleFactory(dependencyPromises, factory)`.
   - En este último paso, se entiende que se devuelve una Promise.
   - El método, sin embargo, se define como síncrono, para evitar sobrecargar de asincronicidad una función tan clave del framework.
----

- **@name:** ModulerV5.prototype.mean
- **@parameter:** ...args:Array - Acepta diferentes firmas.
- **@signature:**
   - ...args:[id:String] - Acepta 1 identificador de dependencia
   - ...args:[factory:Function] - Acepta 1 función factoría
   - ...args:[dependencies:Array] - Acepta 1 array de dependencias. En este caso, devuelve las dependencias resueltas directamente, en formato `Promise<Array<?>>`.
   - ...args:[dependencies:Array,factory:Function] - Acepta 1 array de dependencias seguido de 1 función factoría
- **@returns:** `Promise<any>` - Devuelve o la resolución final de la factoría, o la resolución final de la dependencia, o la lista de resoluciones de dependencias, según el caso de los parámetros de entrada.
- **@description:**
   - Este método permite resolver dependencias y/o factorías de módulos al vuelo, de forma asíncrona.
   - Sin embargo, el método de define como síncrono, para no sobrecargar de asincronía un método tan clave en el framework.
- **@explanation:**
   - Los pasos que sigue son:
   - 1. Validación y formateo de parámetros. Aquí encaja los argumentos. En el caso de la firma `dependencies:Array`, retorna, ya en este paso, las promesas construidas con el mapeo de la lista de dependencies mediante this.mean(dependency).
   - 2. Si hay una factoría, crea la `dependencyPromises` con el `this.mean(dependency)` y devuelve la llamada a `this._callModuleFactory(dependencyPromises, factory)`.
   - 3. Si hay un id, devuelve la definition de este de haberla, y de no haberla devuelve la llamada a `this.importModule(id)`, habiendo normalizado el id con `this.normalizationOf`.
   - En el último paso, lanza un error, porque llegados a aquí, ya se han resuelto todas las posibilidades, y la función ya debería haber hecho su return antes.
----

- **@name:** ModulerV5.prototype.cloneForFile
- **@type:** class method
- **@parameter:** file:String - Fichero base para la nueva instancia de ModulerV5. Interesa su directorio, pero se facilita el no tener que extraerlo.
- **@returns:** ModulerV5 - Una nueva instancia de ModulerV5, que hereda de la actual, el this.
- **@description:** Básicamente hace: `return ModulerV5.create(this, file + "/..")`. Puedes ir al constructor de ModulerV5 para entender qué sucede al hacer esto.

----

- **@name:** ModulerV5.prototype.cloneForDirectory
- **@type:** class method
- **@parameter:** directory:String - Directorio base para la nueva instancia de ModulerV5.
- **@returns:** ModulerV5 - Una nueva instancia de ModulerV5, que hereda de la actual, el this.
- **@description:** Básicamente hace: `return ModulerV5.create(this, directory)`. Puedes ir al constructor de ModulerV5 para entender qué sucede al hacer esto.

----

- **@name:** ModulerV5.prototype._callModuleFactory
- **@type:** private method
- **@parameter:**
   - `dependencyPromises:Array<Promise>` - Dependencias a inyectar en el factory.
   - `factory:Function` - Función factoría. A continuación se explicará la firma que sigue.
   - `submoduler:ModulerV5=null` - Instancia de ModulerV5 que quieres inyectar en la factoría. Puede ser distinta de la instancia actual, para conseguir una resolución de rutas relativas personalizada en el caso concreto.
   - `filename:String=null` - Fichero de la llamada. Se inyecta por conveniencia.
   - `dirname:String=null` - Directorio de la llamada. Se inyecta por conveniencia.
- **@returns:**
   - `Promise<any>` - Devuelve lo que la factoría devuelve al llamarse, en este orden:
   - 1. Si el filename termina con `.css`, devuelve lo que devuelve `this.css.add(filename)`.
   - 2. Lo que devuelve la factoría con `return`, si no es `undefined`.
   - 3. Lo que exporta la factoría con `module.exports` o con `export.<prop>`, si con `return` no devuelve nada o `undefined`.
- **@description:**
   - Método que permite resolver módulos JavaScript y CSS.
   - Se utiliza para resolver cualquiera de los 2 tipos de módulos.
   - Es de uso interno, pero hay que saber cómo funciona para usar correctamente los métodos `define` y `mean`.
   - El método se define como síncrono aunque se entiende que devuelve una Promise.
   - Se hace así para evitar sobrecargar de asincronicidad una función tan clave en el framework.
----

- **@name:** ModulerV5.Dictionary
- **@type:** ModulerV5
- **@description:**
   - Instancia global de ModulerV5. Tienes una referencia global para todo el programa aquí, así evitas duplicidades y otros inconvenientes.
   - Utiliza los parámetros por defecto. Por lo cual, es instancia original, no clonada.
----

- **@name:** Promise.fromObject
- **@type:** static method
- **@parameter:** obj:Object - Objeto con las Promise.
- **@description:** Hace lo mismo que Promise.all pero en lugar de usar y devolver un Array, usa y devuelve un Object. Es un polyfill.

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

- **@name:** DevToolkit.Reflection
- **@type:** class
- **@description:** Clase con utilidades de introspección. Principalmente estáticas.

----

- **@name:** DevToolkit.Reflection.getDescriptionOf
- **@type:** static method
- **@parameter:** obj:Object|Function|Class - Ontología a debuggar sus propiedades.
- **@returns:** Object - El objeto con la descripción. Tiene propiedades, metodos, simbolos, y heredadas.
- **@by:** ChatGPT.
- **@description:** Obtiene un objeto con una descripción del objeto pasado con parámetros. Por el camino usa Reflect.ownKeys, Object.getOwnPropertyDescriptor y Object.getPrototypeOf.

----

- **@name:** DevToolkit.Reflection.printDescriptionOf
- **@type:** static method
- **@parameter:** obj:Object|Function|Class - Ontología a debuggar sus propiedades.
- **@returns:** void - Nada.
- **@description:** Imprime una descripción profunda del objeto pasado con parámetros. Usa this.getDescriptionOf y lo pasa a console.log.

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
- **@returns:** `Promise<Array<String>>` - Es una llamada asíncrona, así que devuelve una promesa, con la lista de ficheros encontrados.

----

- **@name:** DevToolkit.Documentator.prototype._extractJavadocCommentsFromString
- **@type:** private class method
- **@parameter:** text:String - Texto que puede contener comentarios javadoc. 
- **@returns:** `Array<Object>`- Lista de comentarios javadoc, representados por objetos.
- **@description:** Método que devuelve los comentarios javadoc encontrados en un string.

----

- **@name:** DevToolkit.Documentator.prototype.extractJavadocCommentsFromDirectory
- **@type:** class method
- **@parameter:** dir:String - Directorio del cual que quieren extraer los comentarios. Se entiende que solo son ficheros `.js`. Ahora mismo esto no se puede cambiar, pero puede que se cambie más adelante. Por defecto usa el `this.toolkit.basedir`.
- **@returns:** `Promise<Object>` - Objeto con los nombres de ficheros (relativos, empiezan con `{@root}/`) y los comentarios javadoc encontrados en cada uno.
- **@description:** Extrae todos los comentarios javadoc encontrados en ficheros js de un directorio dado.

----

- **@name:** DevToolkit.Documentator.prototype.extractJavadocTextFromDirectory
- **@type:** class method
- **@parameter:**
   - dir:String - Directorio del cual se quieren extraer los comentarios javadoc.
   - options:Object - Opciones. Actualmente no tiene uso. Por defecto, un objeto vacío.
- **@returns:** `Promise<String>` - Texto compuesto por todos los comentarios javadoc encontrados.
- **@description:** Devuelve el texto de todos los comentarios javadoc encontrador bajo un directorio. Utiliza `this.extractJavadocCommentsFromDirectory` por dentro.

----

- **@name:** DevToolkit.CommandLine
- **@type:** class
- **@description:** Clase con utilidades para la interfaz de línea de comandos de DevToolkit

----

- **@name:** DevToolkit.CommandLine.baseProject
- **@type:** Object
- **@description:** Este objeto contiene el esqueleto de un proyecto nuevo que utilizará `DevToolkit` y `ModulerV5`. Tiene la estructura de carpetas y ficheros con su contenido necesarios para ello.

----

- **@name:** DevToolkit.CommandLine.Colors
- **@type:** class
- **@description:** Clase con utilidades para pintar colores por consola, tablas, cajas, y cosas así. Esta clase se saca de `require(__dirname + "/refrescador.api.dist.js").colors`. Por lo cual, se sobreentiende que `dev-toolkit.dist.js` tiene que estar acompañado de este fichero.

----

- **@name:** DevToolkit.CommandLine.Tools
- **@type:** static property + `Class<Tools>`

----

- **@name:** DevToolkit.CommandLine.Tools.create
- **@type:** static method
- **@description:** Constructor que evita el new.

----

- **@name:** DevToolkit.CommandLine.Tools.prototype.toolkit
- **@in-constructor:** 
- **@not-prototype:** 
- **@type:** class property + DevToolkit
- **@description:** Es una propiedad de acceso al DevToolkit que dio origen a esta instancia

----

- **@name:** DevToolkit.CommandLine.prototype.buildDocs
- **@not-finished:** 

----

- **@name:** DevToolkit.CommandLine.Tools.prototype.buildCss
- **@not-finished:** 

----

- **@name:** DevToolkit.CommandLine.Tools.prototype.buildJs
- **@type:** class method
- **@parameter:** file:String - Fichero a construir.
- **@requirement:**
   - El file:String debe empezar por `src/`
   - El file:String debe terminar por `.entry.js`
- **@returns:** `Promise<void>` - Nada
- **@description:**
   - Lo que va a hacer es crear el fichero `dist/{ruta}.dist.js` con la compilación de este.
   - La compilación se hace con el método `this.toolkit.templating.tjs.renderFile(file)`
----

- **@name:** DevToolkit.CommandLine.Tools.prototype.testJs
- **@not-finished:** 

----

- **@name:** DevToolkit.CommandLine.Tools.prototype.loop
- **@not-finished:** 

----

- **@name:** DevToolkit.CommandLine.Tools.prototype.up
- **@type:** class method
- **@description:** ...

----

- **@name:** DevToolkit.CommandLine.create
- **@type:** static method
- **@description:** Constructor que evita el new.

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

- **@name:** DevToolkit.CommandLine.prototype.toolkit
- **@type:** class property + DevToolkit
- **@description:**
   - Instancia DevToolkit que creó este CommandLine
   - Para ver más, consultar la clase DevToolkit
----

- **@name:** DevToolkit.CommandLine.prototype.tools
- **@type:** class property + DevToolkit.CommandLine.Tools
- **@description:**
   - Instancia DevToolkit.CommandLine.Tools, el kit de herramientas para línea de comandos incluidas por defecto en el DevToolkit.CommandLine
   - Para ver más, consultar la clase DevToolkit.CommandLine.Tools
----

- **@name:** DevToolkit.CommandLine.prototype.findProjectRoot
- **@type:** class method
- **@parameter:**
   - fromDirectory:String = process.cwd() - Directorio desde el que quieres iniciar la búsqueda
   - file:String = "package.json" - Nombre del fichero que se usará para encontrar el directorio raíz del proyecto
- **@throws:** Error - Lanzará un error de "project root not found by file ${file}"
- **@returns:** `Promise<String>` - Directorio considerado raíz del proyecto
- **@description:**
   - Buscará desde el directorio `fromDirectory:String` hacia arriba el primer directorio que encuentre el fichero `file:String`.
   - De no encontrarse y llegar a la raíz del sistema operativo, lanzará un error.
----

- **@name:** DevToolkit.CommandLine.prototype.createProject
- **@type:** class method
- **@returns:** true - Si todo ha ido bien.
- **@description:** Construye un proyecto que utiliza DevToolkit y ModulerV5 para modular js y css. Requiere que el directorio esté vacío. Este método obliga que el fichero `dev-toolkit.dist.js` esté con todo el contenido de la clase.

----

- **@name:** DevToolkit.CommandLine.prototype.tool
- **@type:** class method
- **@parameter:** args:`Array<String>`- Indica la herramienta. Permite niveles. Cada nivel es concatenado con el caracter `/`, que luego es normalizado por `DevToolkit.prototype.fullpathOf`. Este parámetro pueden ser los `process.argv` que buscará donde terminan los argumentos posicionales y los tomará desde ahí automáticamente.
- **@returns:** any - Lo que devuelva la herramienta llamada.
- **@description:** Llama a la herramienta que esté guardada dentro de la raíz del proyecto, en `dev/cli/tool/{args.join("/")}

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
- **@returns:** `Promise<void>` - No devuelve nada actualmente
- **@description:** Primero bloquea el semáforo, luego propaga el touch, el test, el distribute, y luego desbloquea el semáforo.

----

- **@name:** DevToolkit.Events.prototype.propagateOnTouch
- **@parameter:** file:String - Fichero del cual se quiere propagar el touch.
- **@returns:** `Promise<void>` - No devuelve nada actualmente.
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
- **@returns:** `Promise<void>` - No devuelve nada.
- **@description:** Bloquea el semáforo, o lanza un error si no está liberado. Si el error es que no existe el fichero, lo ignora y lo crea. El semáforo está desbloqueado si su contenido es `released`.

----

- **@name:** DevToolkit.Semaphore.prototype.release
- **@returns:** `Promise<void>` - No devuelve nada, solo que usa fs.promises.writeFile y devuelve lo que este.
- **@description:** Escribe `"released"` en el fichero semáforo.

----

- **@name:** DevToolkit.Semaphore.prototype.destroy
- **@type:** class method
- **@throws:** Error - Lanza el error que se produzca por unlink, a no ser que fuera que el fichero no existía, en cuyo caso devuelve false solamente.
- **@returns:** `Promise<Boolean>` - Devuelve true si existía, false si no existía.
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
- **@returns:** `Promise<Object|false>` - Lo mismo que fs.promises.lstat. Si falla, silencia el error y devuelve false.
- **@description:** Comprueba si un fichero o directorio vive en la ruta proporcionada.

----

- **@name:** DevToolkit.FileSystem.existsDirectory
- **@type:** static method
- **@parameter:** file:String - Ficero absoluto
- **@returns:** `Promise<Boolean>` - Devuelve true si es un fichero, false en cualquier otro caso.
- **@description:** Comprueba si un fichero vive en la ruta proporcionada.

----

- **@name:** DevToolkit.FileSystem.readFile
- **@type:** static method
- **@parameter:**
   - dir:String - Fichero absoluto
   - options:Object - Opciones. Ahora mismo solo permite `inTry:Boolean=false`, que en `true` silenciará el error, y devolverá `false`.
- **@returns:** `Promise<String>` - El contenido de un fichero en utf8.
- **@description:** Devuelve el contenido de un fichero.

----

- **@name:** DevToolkit.FileSystem.writeFile
- **@type:** static method
- **@parameter:**
   - file:String - Fichero absoluto
   - contents:String - Contenido con el que sobreescribir
   - options:Object - Opciones pasadas. Ahora mismo no admite nada.
- **@returns:** `Promise<void>` - Devuelve lo mismo que fs.promises.writeFile
- **@description:** Sobreescribe un fichero con el contenido especificado.

----

- **@name:** DevToolkit.FileSystem.deleteFile
- **@type:** static method
- **@parameter:**
   - dir:String - Fichero absoluto
   - options:Object - Opciones. Ahora mismo solo acepta `inTry:Boolean=false`, que en `true` falla silenciosamente.
- **@returns:** `Promise<void>` - Lo mismo que fs.promises.unlink
- **@description:** Elimina un directorio, recursivamente.

----

- **@name:** DevToolkit.FileSystem.existsDirectory
- **@type:** static method
- **@parameter:** dir:String - Directorio absoluto
- **@returns:** `Promise<Boolean>` - Devuelve true si es un directorio, false en cualquier otro caso.
- **@description:** Comprueba si un directorio vive en la ruta proporcionada.

----

- **@name:** DevToolkit.FileSystem.readDirectory
- **@type:** static method
- **@parameter:**
   - dir:String - Directorio absoluto
   - options:Object - Opciones. Ahora mismo solo permite `inTry:Boolean=false`, que en `true` silenciará el error, y devolverá `false`.
- **@returns:** `Promise<Array<String>>` - Los ficheros y directorios contenidos dentro.
- **@description:** Devuelve los contenidos de un directorio.

----

- **@name:** DevToolkit.FileSystem.writeDirectory
- **@type:** static method
- **@parameter:** dir:String - Directorio absoluto
- **@returns:** `Promise<void>` - Devuelve lo mismo que fs.promises.mkdir
- **@description:** Construye un directorio

----

- **@name:** DevToolkit.FileSystem.deleteDirectory
- **@type:** static method
- **@parameter:**
   - dir:String - Directorio absoluto
   - options:Object - Opciones. Ahora mismo solo acepta `inTry:Boolean=false`, que en `true` falla silenciosamente.
- **@returns:** `Promise<void>` - Lo mismo que fs.promises.rm
- **@description:** Elimina un directorio, recursivamente.

----

- **@name:** DevToolkit.FileSystem.emptyDirectory
- **@type:** static method
- **@parameter:**
   - dir:String - Directorio absoluto
   - options:Object - Opciones. Ahora mismo solo acepta `inTry:Boolean=false`, que en `true` falla silenciosamente.
- **@returns:** `Promise<void>` - Lo mismo que fs.promises.mkdir
- **@description:** Elimina un directorio recursivamente, y luego lo crea, lo cual al final es como haberlo vaciado.

----

- **@name:** DevToolkit.FileSystem.fromDirectoryToObject
- **@type:** class method
- **@parameter:**
   - dir:String - Directorio absoluto.
   - options:Object - Opciones. Admite un `filter:Function<fsnode:String>:Boolean` para usar como filtro y discriminar qué partes del directorio no quieres incluir en la representación. Esto puede ser útil si quieres que 1 fichero contenga la representación final de la estructura del directorio, y así evitas que la representación objetual se haga incremental.
- **@returns:** `Promise<Object>` - Representación objetual del directorio proporcionado.
- **@description:** Construye la representación objetual de un directorio.

----

- **@name:** DevToolkit.FileSystem.prototype.fromObjectToDirectory
- **@type:** class method
- **@parameter:**
   - obj:Object - Representación objetual de un directorio.
   - dir:String - Directorio raíz donde se quiere reconstruir la representación objetual
- **@returns:** `Promise<void>`
- **@description:** Reconstruye un directorio a partir de una representación objetual de directorio, y el directorio raíz.
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.sizeOf
- **@type:** static method
- **@parameter:** dir:String - Fichero absoluto
- **@returns:** `Promise<Integer>` - El tamaño de un fichero o directorio
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
- **@returns:** `Promise<Boolean>`
- **@description:** Dice si existe un fichero o directorio en la ruta proporcionada
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.existsFile
- **@type:** class method
- **@parameter:** file:String - Fichero, puede ser relativo.
- **@returns:** `Promise<Boolean>`
- **@description:** Dice si existe un fichero (no directorio) en la ruta proporcionada
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.readDirectory
- **@type:** class method
- **@parameter:** file:String - Fichero, puede ser relativo.
- **@returns:** `Promise<Array<String>>`
- **@description:** Lee un fichero y devuelve su contenido en utf8
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.writeFile
- **@type:** class method
- **@parameter:**
   - file:String - Fichero, puede ser relativo.
   - contents:String - Contenido del fichero
- **@returns:** `Promise<void>`
- **@description:** Sobreescribe un fichero con fs.promises.writeFile
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.deleteFile
- **@type:** class method
- **@parameter:**
   - file:String - Fichero
   - options:Object - Opciones pasadas a su homólogo estático.
- **@returns:** `Promise<void>`
- **@description:** Elimina un fichero.
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.existsDirectory
- **@type:** class method
- **@parameter:** dir:String - Directorio, puede ser relativo.
- **@returns:** `Promise<Boolean>`
- **@description:** Dice si existe un directorio en la ruta proporcionada
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.readDirectory
- **@type:** class method
- **@parameter:** dir:String - Directorio, puede ser relativo.
- **@returns:** `Promise<Array<String>>`
- **@description:** Lee un directorio y devuelve sus rutas
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.writeDirectory
- **@type:** class method
- **@parameter:** file:String - Directorio, puede ser relativo.
- **@returns:** `Promise<void>`
- **@description:** Crea un directorio con fs.promises.mkdir
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.deleteDirectory
- **@type:** class method
- **@parameter:**
   - dir:String - Directorio
   - options:Object - Opciones pasadas a su homólogo estático.
- **@returns:** `Promise<void>`
- **@description:** Elimina un directorio.
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.emptyDirectory
- **@type:** class method
- **@returns:** `Promise<void>`
- **@description:** Vacía un directorio pero no lo elimina.
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.fromDirectoryToObject
- **@type:** class method
- **@parameter:** file:String - Directorio, puede ser relativo.
- **@returns:** `Promise<Object>`
- **@description:** Construye la representación objetual de un directorio.
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.fromObjectToDirectory
- **@type:** class method
- **@parameter:**
   - obj:Object - Representación objetual de un directorio.
   - dir:String - Directorio raíz donde se quiere reconstruir la representación objetual
- **@returns:** `Promise<void>`
- **@description:** Reconstruye un directorio a partir de una representación objetual de directorio, y el directorio raíz.
- **@differences:** Admite rutas relativas al `this.toolkit.basedir`, no como su homólogo estático.

----

- **@name:** DevToolkit.FileSystem.prototype.sizeOf
- **@type:** class method
- **@parameter:** file:String - fichero, puede ser relativo.
- **@returns:** `Promise<Integer>` - El size que devuelve el lstat de node.js
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