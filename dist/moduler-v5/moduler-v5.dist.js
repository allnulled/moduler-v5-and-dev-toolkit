(function(mod) {
  if (typeof window !== 'undefined') window['ModulerV5'] = mod;
  if (typeof global !== 'undefined') global['ModulerV5'] = mod;
  if (typeof module !== 'undefined') module.exports = mod;
})(function() {
  /**
   * @name ModulerV5
   * @type class
   * @description Clase útil para modulación en runtime de JavaScript y CSS.
   * @exports window.ModulerV5 - Para poder encontrarla en el browser globalmente
   * @exports global.ModulerV5 - Para poder encontrarla en node.js globalmente
   * @exports module.exports - Para poder importarla en node.js con require o import
   * @file moduler-v5.dist.js
   */
  const ModulerV5 = class {
    /**
     * @name ModulerV5.default
     * @type static property
     * @description Una referencia a la misma clase, para poder importarla con `import` además de con `module.exports`.
     */
    static
    default = this;
    /**
     * @name ModulerV5.CssModuler
     * @type class
     * @description Clase encargada de gestionar la modulación en runtime de ficheros y sincronización en runtime de estilos CSS
     */
    static CssModuler = class CssModuler {
      /**
       * @name ModulerV5.CssModuler.create
       * @type static method
       * @description Método típico para facilitar la creación de la clase.
       */
      static create(...args) {
        return new this(...args);
      }
      /**
       * @name ModulerV5.fakeCssStyleSheet
       * @type static method
       * @returns fakeStyleSheet:FakeCssStyleSheet
       * @description Devuelve una CSSStyleSheet de tipo fake, para polifilear lo mínimo en entornos no-navegador.
       */
      static fakeCssStyleSheet() {
        return new class FakeCssStyleSheet {
          isFake = true;
          replace(...args) {
            // console.log("in node.js this does nothing", args)
          }
        }();
      }
      /**
       * @name ModulerV5.CssModuler.symbols
       * @type static property + Object
       * @description Contiene las regex usadas por la clase, como la del `/ *@requires:...* /`.
       */
      static symbols = {
        REQUIRES_REGEX: /(\/\*\@requires\:((?!\*\/).)+\*\/)+(\r|\t|\n| )?/g
      };
      /**
       * @name ModulerV5.CssModuler.constructor
       * @type class constructor
       * @parameter moduler:ModulerV5 - Instancia de ModulerV5 para esta instancia de CssModuler. 
       * @sets this.moduler:ModulerV5 - Del parámetro proporcionado.
       * @sets this.sheets:`Object<String>` - Objeto con los códigos CSS asociados con el fichero que los introdujo
       * @sets this.entry:CSSStyleSheet|FakeCssStyleSheet - Propiedad que guarda y sincroniza el CSS. Se basa en la clase oficial del estándar de los navegadores, pero en node.js se polifilea con un objeto propio.
       * @description Método constructor. Después de establecer las propiedades, inyecta la CSSStyleSheet en el document.adoptedStyleSheets, aunque esté vacía, que lo está.
       */
      constructor(moduler) {
        this.moduler = moduler;
        /**
         * @name ModulerV5.CssModuler.prototype.sheets
         * @type class property + `Object<String,{ id:String, source:String, requires:Array<String> }>`
         * @description Objeto con la metainformación de todas las hojas CSS añadidas en la instancia.
         * @description Esta metainformación se compone de un id:String, un source:String y un `requires:Array<String>`.
         */
        this.sheets = {};
        /**
         * @name ModulerV5.CssModuler.prototype.entry
         * @type class property + CSSStyleSheet|FakeCssStyleSheet
         * @description Objeto nativo del browser (CSSStyleSheet) o polyfill propio en entornos no-browser (FakeCssStyleSheet) para hacer (o fake-polifilear) la inyección de estilos en la página.
         * @description De este objeto, lo que se va a usar es el método `.replace(source:String)`.
         */
        this.entry = typeof CSSStyleSheet === "function" ? new CSSStyleSheet() : this.constructor.fakeCssStyleSheet();
        if (!this.entry.isFake) {
          document.adoptedStyleSheets.push(this.entry);
        }
      }
      /**
       * @name ModulerV5.CssModuler.prototype.assert
       * @type class method
       * @parameter condition:Boolean - Condición que se aserciona
       * @parameter message:String - Mensaje de error en caso de la aserción fallar
       * @description Método propio para hacer aserciones locales en algunos métodos.
       */
      assert(condition, message) {
        if (!condition) throw new Error("AssertionError in CssModuler: " + message);
      }
      /**
       * @name ModulerV5.CssModuler.prototype.add
       * @type class method
       * @parameter input1:String - Ruta al fichero css. Se usa el método `ModulerV5.prototype.fullpathOf` para normalizar.
       * @parameter eventToAdd:Object - Objeto del evento de añadir. Usa las propiedades oldSheets, newSheets y count.
       * @returns eventToAdd:Object - Objeto que representa el evento de añadir.
       * @sets eventToAdd.oldSheets - Va poniendo las sheets que ya se conocían en this.sheets, antes de iniciar el evento de añadir.
       * @sets eventToAdd.newSheets - Va poniendo las sheets que no se conocían en this.sheets antes de iniciar el evento de añadir.
       * @sets eventToAdd.count - Va incrementando el contador a medida que las va encontrando.
       * @description Añade recursivamente, llamando a this.add recursivamente y pasándole el mismo objeto del evento de añadir, las dependencias especificadas con comentarios css que cumplan el patrón: `/ *@requires:fichero.css* /`
       * @explanation Añade la hoja especificada, en old o new. Si está en old, no la analiza. Pero si entra en newSheets, analiza el contenido para extraer los `/ *@requires:fichero.css* /`, y los añade con `this.add` recursivamente.
       * @explanation Los objetos que representan a cada fichero css tienen las propiedades id:String, source:String, requires:`Array<String>`.
       * @explanation Otro dato importante es que en cada nuevo fichero/dependencia, crea un ModulerV5 diferente, con una ruta propia fijada al fichero css que se está incluyendo. De esta forma, el fichero css soporta rutas relativas, y puedes importar ficheros así: `/ *@requires:./fichero.css* /`
       */
      async add(input1 = null, eventToAdd = {
        newSheets: {},
        oldSheets: {},
        count: 0
      }) {
        this.assert(typeof input1 === "string", "on CssModuler.prototype.add: arguments[0] must be string");
        const id = this.moduler.fullpathOf(input1);
        if (id in this.sheets) {
          if (!(id in eventToAdd.oldSheets)) {
            eventToAdd.oldSheets = [];
          }
          eventToAdd.oldSheets[id].push(eventToAdd.count++);
        } else {
          const source = await this.moduler.readPath(id);
          const allRequires = source.match(this.constructor.symbols.REQUIRES_REGEX);
          const submoduler = this.moduler.cloneForFile(id);
          const requires = !allRequires ? [] : allRequires.map(match => {
            const subpath = match.substr("/*@requires:".length).trim().slice(0, -2).trim();
            return submoduler.fullpathOf(subpath);
          });
          const moduloCss = {
            id,
            source,
            requires
          };
          this.sheets[id] = moduloCss;
          eventToAdd.newSheets[id] = eventToAdd.count++;
          for (let index = 0; index < requires.length; index++) {
            const subid = requires[index];
            await this.add(subid, eventToAdd);
          }
        }
        return eventToAdd;
      }
      /**
       * @name ModulerV5.CssModuler.prototype._sortSheets
       * @type private method
       * @parameter eventToSync:Object - Se usarán las propiedades dependencies y counter
       * @returns void - Nada.
       * @description Método que ordena según la inter-dependencia de los ficheros css añadidos en la instancia, donde los que dependen van después de sus propias dependencias.
       * @sets eventToSync.dependencies - Especifíca en el objeto del evento de sincronización todas las dependencias acumuladas.
       * @sets eventToSync.counter - Especifíca también la cantidad de dependencias acumuladas (el length del anterior, vaya).
       */
      _sortSheets(eventToSync) {
        const dependencies = [];
        const visited = new Set();
        const visit = (sheetId) => {
          if (visited.has(sheetId)) {
            return;
          }
          visited.add(sheetId);
          const sheet = this.sheets[sheetId];
          if (!sheet) {
            return;
          }
          for (const dependencyId of sheet.requires) {
            visit(dependencyId);
          }
          dependencies.push(sheet);
        };
        for (const sheetId in this.sheets) {
          visit(sheetId);
        }
        eventToSync.dependencies = dependencies;
        eventToSync.counter = dependencies.length;
      }
      /**
       * @name ModulerV5.CssModuler.prototype._generateSource
       * @type private method
       * @parameter eventToSync:Object - Se usará su propiedad eventToSync.dependencies y eventToSync.source
       * @returns void - Nada.
       * @description Este método acumula el css de las dependencias especificadas y lo vuelva en eventToSync.source.
       * @explanation En el camino pone una cabecera para cada dependencia, para que en el resultado se pueda distinguir el fragmento de cada dependencia css.
       * @explanation Las cabeceras son: **!original** con la ruta del fichero y **!order** con el número ordinal de la dependencia.
       * @explanation También hace un reemplazo de los `@requires:fichero.css` por `!requires:fichero.css`, lo cual permite que cualquier css compilado, pueda usarse, sin problemas de recursividad, como dependencia de otro css que quiere ser compilado.
       */
      _generateSource(eventToSync) {
        let css = "";
        for (let index = 0; index < eventToSync.dependencies.length; index++) {
          const dependency = eventToSync.dependencies[index];
          css += `/*!original:${this.moduler.relpathOf(dependency.id)}*/\n`;
          css += `/*!order:${index+1}*/\n`;
          css += `${dependency.source.replace(this.constructor.symbols.REQUIRES_REGEX, match => "/*!" + match.substr(3))}\n\n`;
        }
        eventToSync.source = css;
      }
      /**
       * @name ModulerV5.CssModuler.prototype._synchronizeSource
       * @type private method
       * @parameter eventToSync:Object - Se usará la propiedad source:String
       * @returns `Promise<void>` - Nada
       * @description Sincroniza el CSS de la página con las hojas añadidas en la instancia. Se llama al método CSSStyleSheet.prototype.replace. En entornos no-navegador, usará el polifill propio, así no explote en ningún entorno.
       */
      async _synchronizeSource(eventToSync) {
        // @BROWSER pero polifileado:
        await this.entry.replace(eventToSync.source);
      }
      /**
       * @name ModulerV5.CssModuler.prototype._exportSource
       * @type private method
       * @parameter eventToSync:Object - Objeto del evento de sincronización. Se usará su propiedad source:String.
       * @parameter options:Object - Objeto de opciones de la sincronización. Se usará su propiedad outFile:String.
       * @returns `Promise<void>` - No devuelve nada concreto
       * @description Método que exporta el CSS acumulado en esta instancia, a un fichero. Lo que hace es que escribe en el fichero especificado en options.outFile el código acumulado en el eventToSync.source.
       */
      async _exportSource(eventToSync, options) {
        if (options.outFile) {
          await require("fs").promises.writeFile(this.moduler.fullpathOf(outFile), eventToSync.source, "utf8");
        }
      }
      /**
       * @name ModulerV5.CssModuler.prototype.add
       * @type class method
       * @parameter input1:String - Ruta del fichero css a eliminar. Se usa el método `ModulerV5.prototype.fullpathOf` para normalizar.
       * @returns this:ModulerV5.CssModuler - Devuelve la instancia propia por si se quiere hacer chaining.
       * @asserts id in this.sheets - Comprueba que el id existe en this.sheets o lanza un error de aserción.
       * @deletes this.sheets[id] - Elimina el fichero css del this.sheets
       * @description Elimina un fichero css añadido previamente del this.sheets. No hace recursión, se elimina la hoja suelta, y esto puede producir inconsistencias. Usar con coherencia con esto, o evitar de usarlo.
       */
      remove(input1) {
        const id = this.moduler.fullpathOf(input1);
        this.assert(id in this.sheets, "cannot remove sheet because it is not added: " + id);
        delete this.sheets[id];
        return this;
      }
      /**
       * @name ModulerV5.CssModuler.prototype.synchronize
       * @type class method
       * @parameter options:Object - Se usa la propiedad outFile:String|false, opcionalmente, si quieres exportar el css a un fichero.
       * @returns `Promise<eventToSync:Object>` - Devuelve el evento de sincronización.
       * @description Sincroniza el css de la página con el css de la instancia.
       * @calls this._sortSheets - Primero ordena los css
       * @calls this._generateSource - Segundo genera el css resultante, la resolución recursiva ya se ha hecho en el `this.add`, aquí solo se recoge lo ya descargado
       * @calls this._synchronizeSource - Tercero sincroniza el css de la página
       * @calls this._exportSource - Cuarto exporta el css al fichero indicado en options.outFile, si es que se especifica.
       */
      async synchronize(options = {
        outFile: false
      }) {
        const eventToSync = {
          counter: 0,
          dependencies: [],
        };
        await this._sortSheets(eventToSync, options);
        await this._generateSource(eventToSync, options);
        await this._synchronizeSource(eventToSync, options);
        await this._exportSource(eventToSync, options);
        return eventToSync;
      }
    };
    /**
     * @name ModulerV5.create
     * @type static method
     * @description Constructor que evita el `new`.
     */
    static create(...args) {
      return new this(...args);
    }
    /**
     * @name ModulerV5.constructor
     * @type class constructor
     * @parameter ...args:`Array` - Tiene varias firmas posibles.
     * @signature ...args:[] - Sin parámetros. Esto resulta en: basedir, rootdir, definitions y css, todos por defecto.
     * @signature ...args:[String|ModulerV5|null] - Con 1 parámetro tipo String u ModulerV5 o null. Si es String, especificas el basedir y el rootdir. Si es ModulerV5, especificas los mismos basedir, rootdir, definitions y css que la instancia que le pasas.
     * @signature ...args:[ModulerV5,String] - Con 2 parámetros, el primero tipo ModulerV5 y el segundo tipo String. Aquí heredas los basedir, rootdir, definitions y css del ModulerV5, y con el segundo como String sobreescribes el basedir. Útil para cuando quieres usar un ModulerV5 pero que capte rutas relativas a otro directorio.
     * @sets this.basedir:String - Ruta del directorio base. Se usa como base para resolver rutas relativas.
     * @sets this.rootdir:String - Ruta del directorio base original, el primer basedir de la cadena de herencia. Cuando heredas otro ModulerV5, esta propiedad se mantiene a través de toda la cadena de herencia. Útil para no perder el directorio raíz del proyecto a través de diferentes instancias ModulerV5.
     * @sets this.definitions:Object - Objeto con todas las referencias conocidas por el ModulerV5.
     * @sets this.css:CssModuler - Gestor de dependencias CSS. Una instancia de ModulerV5.CssModuler.
     * @sets this.isBrowser:Boolean - Sirve para saber rápidamente si estás en un navegador o no. Se saca de `typeof window !== "undefined"`.
     * @defaults this.basedir - Por defecto, en navegador es `window.location.origin + window.location.pathname` y en node.js es `process.cwd()`.
     * @defaults this.rootdir - Por defecto, es el this.basedir.
     * @defaults this.definitions - Por defecto, es un objeto vacío.
     * @defaults this.css - Por defecto, es una nueva instancia de CssModuler.
     * @description Método constructor de instancias de ModulerV5. El constructor de ModulerV5 tiene una lógica un poco extensa, porque:
     * @description Tiene que cubrir los casos donde se cambia el directorio base, y de esta forma puede ocuparse de las rutas relativas de forma más o menos eficiente, porque aunque es una instancia de modulador distinta:
     * @description El modulador de css es el mismo objeto (porque en la herencia se transmite el mismo objeto `css` y sus cambios afectan a toda la cadena de herencia igual)
     * @description El modulador de js es el mismo objeto (porque en la herencia se transmite el mismo objeto `definitions`, con lo que una nueva definición afecta también a toda la cadena de herencia)
     * @description Mientras que por otro lado permite usar rutas relativas tanto para módulos css como js
     * @note La herencia entre instancias ModulerV5 implica que **no es conveniente** retener instancias locales de `ModulerV5` para lógica de funciones.
     * @note Es mejor usar la instancia global para esto, y así evitar retener diferentes objetos.
     * @note El uso de las instancias locales se reduce a llamadas de primer nivel superficial, que te permitan usar rutas locales.
     * @note Esto último, en la modulación CSS es inevitable, así que no es problema.
     * @note En cuanto a JavaScript, lo que implica es que no conviene usar `LocalDictionary` dentro de funciones, porque vas a provocar retener diversas instancias ModulerV5 en la memoria del motor de V8, y aunque no sea muy crítico en principio, es una mala práctica que va a polucionar innecesariamente la memoria. De requerirlo, usar mejor la instancia global de `ModulerV5.Dictionary`, que es única en todo el programa, lo único que pierdes es la capacidad de especificar rutas relativas.
     */
    constructor(...args) {
      /**
       * @name ModulerV5.prototype.isBrowser
       * @type class prototype + Boolean
       * @description Flag que indica si se está funcionando en navegador o no. Se aclara por la expresión `typeof window !== "undefined"`.
       */
      this.isBrowser = typeof window !== "undefined";
      let input1 = null;
      let input2 = null;
      Step_1_Receive_arguments: {
        if (args.length === 0) {
          input1 = null;
          input2 = null;
        } else if (args.length === 1) {
          input1 = args[0] || null;
          input2 = null;
        } else if (args.length === 2) {
          input1 = args[0] || null;
          input2 = args[1];
        } else {
          throw new Error("on «ModulerV5.constructor»: parameter «arguments.length» must be between 0-2");
        }
      }
      let rootdir = null;
      let basedir = null;
      let definitions = null;
      let cloneRoot = null;
      Step_2_Fulfill_parameters: {
        if (input1 === null) {
          basedir = null;
          definitions = {};
        } else if (typeof input1 === "string") {
          basedir = input1;
          definitions = {};
        } else if (typeof input1 === "object" && input1 instanceof ModulerV5) {
          cloneRoot = input1;
          rootdir = input1.rootdir;
          basedir = input1.basedir;
          definitions = input1.definitions;
        } else {
          throw new Error("on «ModulerV5.constructor»: parameter «arguments[0]» must be undefined, string, null or instance of ModulerV5");
        }
        if (input2 === null) {
          // @OK: no extra file
        } else if (typeof input2 === "string") {
          this.assert(typeof input1 === "object" && input1 instanceof ModulerV5, "on «ModulerV5.constructor»: parameter «arguments[1]» can only be used when «arguments[0]» is instance of ModulerV5");
          basedir = input1.fullpathOf(input2);
        } else {
          throw new Error("on «ModulerV5.constructor»: parameter «arguments[1]» must be string, null or instance of ModulerV5");
        }
      }
      Step_3_Fix_default_values: {
        if (basedir === null) {
          if (this.isBrowser) {
            basedir = window.location.origin + window.location.pathname;
          } else {
            basedir = process.cwd();
          }
        }
      }
      Step_4_Validate_final_format: {
        this.assert(typeof basedir === "string", "on «ModulerV5.constructor»: variable «basedir» was not well formatted");
        this.assert(typeof definitions === "object", "on «ModulerV5.constructor»: variable «definitions» was not well formatted");
      }
      Step_5_Stablish_values: {
        /**
         * @name ModulerV5.prototype.rootdir
         * @type class property + String
         * @in-constructor
         * @not-prototype
         * @description Propiedad del ModulerV5 que indica el this.basedir del ModulerV5 más alto en la cadena de clonación. Por clonación se entienden las instancias creadas por los métodos cloneForFile y cloneForDirectory, o cualquier instancia que se haya creado pasándole otra instancia de ModulerV5 en los parámetros del constructor.
         */
        this.rootdir = rootdir ?? basedir;
        /**
         * @name ModulerV5.prototype.basedir
         * @type class property + String
         * @in-constructor
         * @not-prototype
         * @description Propiedad del ModulerV5 que indica el directorio base de la instancia. Se diferencia del rootdir porque no tiene por qué coincidir con el this.basedir del ModulerV5 más alto de la cadena de clones.
         */
        this.basedir = basedir;
        /**
         * @name ModulerV5.prototype.definitions
         * @type class property + `Object<String,any>`
         * @in-constructor
         * @not-prototype
         * @description Objeto con las definiciones retenidas por la instancia de ModulerV5.
         */
        this.definitions = definitions;
        /**
         * @name ModulerV5.prototype.css
         * @type class property + CssModuler
         * @in-constructor
         * @not-prototype
         * @description Instancia de ModulerV5.CssModuler asociada a este ModulerV5. En una misma cadena de clonación se comparte el mismo CssModuler. Esto implica que un cambio en el this.css desde cualquier punto de la cadena de clones, afecta igual y simultáneamente a toda la cadena.
         */
        this.css = cloneRoot ? cloneRoot.css : this.constructor.CssModuler.create(this);
      }
    }
    /**
     * @name ModulerV5.inspectToString
     * @type static method
     * @parameter args:`Array|Arguments` - Argumentos o array con lo que quieras inspeccionar.
     * @parameter debugLevel:Integer = 0 - Nivel de debugging. Por defecto 0. Tiene que ser entre 0, 1 y 2.
     * @returns String - Representación de la inspección de los valores.
     * @description Devuelve un string que explora mínimamente lo que se pasa. Da el número (L0), da el tipo (L1) o da el tipo y la stringificación (L2).
     */
    static inspectToString(args, debugLevel = 0) {
      if (debugLevel === 0) return `${[...args].length} args`;
      if (debugLevel === 1) return `${[...args].map((it, i) => i + ":" + typeof it).join(",")} args`;
      if (debugLevel === 2) return `${[...args].map((it, i) => i + ":" + typeof it + this.stringify(it)).join(",")} args`;
    }
    /**
     * @name ModulerV5.stringify
     * @type static method
     * @parameter it:any - Cualquier cosa que sea stringificable por el método mismo.
     * @returns String|any - Devuelve la stringificación, o si da error, el parámetro tal cual.
     * @description Actualmente solo llama a JSON.stringify, no hay un método más allá de stringificación.
     */
    static stringify(it) {
      try {
        return JSON.stringify(it);
      } catch (error) {
        return it;
      }
    }
    /**
     * @name ModulerV5.prototype.isTracing
     * @type class property + Boolean=false
     * @defaults false - Por defecto, el traceo está desactivado.
     * @description Flag para saber si se está traceando o no. Repercute a la instancia de ModulerV5.
     */
    isTracing = false;
    /**
     * @name ModulerV5.prototype.trace
     * @type class method
     * @parameter method:String - Método que estás traceando
     * @parameter args:Array|Arguments - Lista de valores que quieres inspeccionar al tracear. Se le pasarán al `ModulerV5.inspectToString`
     * @description Método de traceo. Consulta al this.isTracing para saber si debe imprimir o evitar.
     */
    trace(method, args = [], debugLevel = 0) {
      if (!this.isTracing) return;
      console.log(`[${method}] ${this.constructor.inspectToString(args, debugLevel)}`)
    }
    /**
     * @name ModulerV5.prototype.assert
     * @type class method
     * @parameter condition:Boolean - Condición a comprobar
     * @parameter message:String - Mensaje del error, lanzado si la condición no se cumple.
     * @description Método de aserción interno.
     */
    assert(condition, message) {
      if (!condition) throw new Error("AssertionError in ModulerV5: " + message);
    }
    /**
     * @name ModulerV5.prototype.normalizationOf
     * @parameter subpath:String - Subruta que se quiere normalizar.
     * @parameter debug:Boolean = false - Flag por si quieres debugar la ruta final antes de llamar al return.
     * @returns String - Ruta normalizada en su versión absoluta.
     * @supports Caso 1. Ruta protocolizada. Acepta `http://`, `https://`, `file://`, o cualquiera que contenga el patrón `://`. Se resuelve tal cual.
     * @supports Caso 2. Ruta relativa. Cuando empieza con `./`. Se resuelve prependizando el this.basedir.
     * @supports Caso 3. Ruta relativa al directorio superior. Cuando empieza con `../`. Se resuelve prependizando el this.basedir + "/..".
     * @supports Caso 4. Ruta relativa al directorio raíz. Cuando empieza con `@/`. Se resuelve prependizando el this.rootdir.
     * @supports Caso 5. Ruta absoluta estilo Linux. Cuando empieza con `/`. Se resuelve tal cual.
     * @supports Caso 6. Otros casos. Se resuelve prependizando this.basedir.
     * @description Devuelve la normalización de una ruta (relativa, relativa superior, protocolizada, etc) en su representación absoluta.
     * @description La idea es que el resultado de esta llamada da un identificador único para un recurso único, y siempre el mismo identificador único, de modo que si 2 rutas escritas de formas diferentes apuntan al mismo recurso, la normalización devuelve el mismo String en ambos casos.
     * @description Este método soporta mútliples casos.
     * @description Este método está un poco sobrecargado (lo cual no es bueno), para evitar casos raros y conductas poco predecibles.
     * @explanation El método sigue varios pasos:
     * @explanation 1. Discrimina el caso de uso, lo interpreta y obtiene las partes
     * @explanation 2. De las partes, elimina las vacías, corrige los saltos a directorios superiores (..) o actuales (.) y neutraliza repetición de separadores (no protocolarios)
     * @explanation 3. Vuelve a juntar las partes y elimina la barra final (a no ser que sea el root de Linux)
     * @explanation 4. Devuelve la ruta final, imprimiéndola si se ha pedido debugar.
     */
    normalizationOf = function(subpath, debug = false) {
      const parts = (() => {
        if (subpath.match(/^[A-Za-z0-9\_\-]+\:\/\//g)) {
          // Caso 1: ruta protocolizada. Acepta http:// https:// file:// o similares
          // Resolución: tal cual viene
          return subpath;
        } else if (subpath.startsWith("./")) {
          // Caso 2: ruta relativa
          // Resolución: se prependiza el this.basedir
          return [this.basedir.replace(/(?!\:\/)\/$/g, ""), subpath.substr(2)].join("/");
        } else if (subpath.startsWith("../")) {
          // Caso 3: ruta relativa a directorio superior
          // Resolución: se prependiza el this.basedir + /..
          return [this.basedir.replace(/(?!\:\/)\/$/g, "") + "/..", subpath.substr(3)].join("/");
        } else if (subpath.startsWith("@/")) {
          // Caso 4: ruta relativa al directorio raíz (no al directorio base)
          // Resolución: se prependiza el this.rootdir
          return [this.rootdir.replace(/(?!\/)\/$/g, ""), subpath.substr(2)].join("/");
        } else if (subpath.startsWith("/")) {
          // Caso 5: ruta absoluta estilo Linux (no hay soporte para Windows porque no puedo probar ahora mismo)
          // Resolución: tal cual viene
          return subpath;
        } else {
          // Caso 6: el resto de casos 
          // Resolución: se prependiza el this.basedir
          return [this.basedir.replace(/(?!\/)\/$/g, ""), subpath].join("/");
        }
      })().split(/(\/+)/g).filter(p => p !== "");
      //console.log(parts);
      const stack = [];
      Iterating_parts:
        for (const part of parts) {
          if (part === ".") {
            // @OK
          } else if (part === "..") {
            if (stack.length && stack[stack.length - 1] === "/") {
              stack.pop();
              stack.pop();
            } else if (stack.length && stack[stack.length - 1] === "//") {
              // @OK
            } else if (stack.length) {
              stack.pop();
            } else {
              // @OK
            }
          } else if (part === "/") {
            if (stack.length && stack[stack.length - 1] === "/") {
              // @OK
            } else if (stack.length && stack[stack.length - 1] === "//") {
              // @OK
            } else {
              stack.push(part);
            }
          } else {
            stack.push(part);
          }
        }
      let finalUrl = stack.join("");
      if (finalUrl.length !== 1) {
        finalUrl = finalUrl.replace(/\/$/g, "");
      }
      if (debug) {
        console.log(finalUrl);
      }
      return finalUrl;
    };
    /**
     * @name ModulerV5.prototype.fullpathOf
     * @parameter subpath:String - Subruta de la que se quiere extraer la ruta absoluta.
     * @returns String - Ruta absoluta.
     * @description Retorna la ruta absoluta de una ruta relativa al this.basedir.
     * @description En realidad, retorna una llamada a this.normalizationOf(subpath)
     */
    fullpathOf(subpath) {
      return this.normalizationOf(subpath);
    }
    /**
     * @name ModulerV5.prototype.relpath
     * @parameter subpath:String - Subruta o ruta. Será normalizada por this.fullpathOf.
     * @returns `String` - Representación de la ruta relativa al this.rootdir.
     * @description Devuelve la ruta relativa al this.rootdir.
     * @description La ruta devuelta siempre empieza por `@/` que es la representación del this.rootdir que usa este framework.
     */
    relpathOf(subpath) {
      if (this.isBrowser) {
        throw new Error("Must polyfill method «fullpathOf» to support browser environment");
      }
      return "@/" + this.fullpathOf(subpath).replace(this.rootdir, "").replace(/^\//g, "");
    }
    /**
     * @name ModulerV5.prototype.importModule
     * @type class method
     * @parameter subpath:String - Subruta a importar.
     * @parameter injection:Object = {} - Variables inyectadas en el script que se importa.
     * @returns `Promise<any>` - Lo devuelto por la llamada a la factoría del módulo especificado. Esto implica a `this.readPath` y a `this._callModuleFactory`. Por el camino se usan `this.cloneForFile` y `this.normalizationOf` con el `subpath`.
     * @description Este método es un wrapper de _callModuleFactory que usa this.readPath y el constructor de AsyncFunction.
     * @explanation Primero hace un this.readPath del subpath para extraer el código.
     * @explanation Segundo crea una función con el código extraído, usando el constructor AsyncFunction.
     * @explanation En este punto, entiende estas variables en los parámetros: `\`[${Object.keys(injection).join(",")}]\`, "module", "exports", "LocalDictionary", "__filename", "__dirname"`
     * @explanation Tercero, llama al this._callModuleFactory y retorna lo que esta devuelva.
     * @explanation En este punto, al this._callModuleFactory le pasa estas variables: `Object.values(injection), asyncFunction, this.cloneForFile(subpath), subpath, this.normalizationOf(subpath + "/..")`
     */
    importModule(subpath, injection = {}) {
      return this.readPath(subpath).then(source => {
        const asyncFunction = new(async function() {}).constructor(`[${Object.keys(injection).join(",")}]`, "module", "exports", "LocalDictionary", "__filename", "__dirname", source);
        // console.log(asyncFunction.toString())
        return this._callModuleFactory(Object.values(injection), asyncFunction, this.cloneForFile(subpath), subpath, this.normalizationOf(subpath + "/.."));
      });
    }
    /**
     * @name ModulerV5.prototype.readPath
     * @parameter file:String - Ruta. Puede ser relativa. Acepta fichero (en node.js) o URL (en browser).
     * @returns `Promise<String>` - El contenido utf8 del fichero o de la URL.
     * @description Devuelve el contenido de un fichero o URL, aceptando rutas relativas.
     */
    readPath(file) {
      return this.isBrowser ? this.readUrl(file) : this.readFile(file);
    }
    /**
     * @name ModulerV5.prototype.readUrl
     * @parameter url:String - URL. Puede ser relativa.
     * @returns `Promise<String>` - El contenido utf8 de la URL.
     * @description Devuelve el contenido de la URL, aceptando rutas relativas.
     */
    readUrl(url) {
      return fetch(this.fullpathOf(url)).then(response => response.text());
    }
    /**
     * @name ModulerV5.prototype.readFile
     * @parameter file:String - Ruta a fichero. Puede ser relativa porque será pasada por this.fullpathOf.
     * @returns `Promise<String>` - El contenido utf8 del fichero.
     * @description Devuelve el contenido de un fichero, aceptando rutas relativas.
     */
    readFile(file) {
      return require("fs").promises.readFile(this.fullpathOf(file), "utf8");
    }
    /**
     * @name ModulerV5.prototype.knows
     * @type class method
     * @parameter id:String - Ruta de un módulo en this.definitions.
     * @returns Boolean - Si se conoce el id o no por this.definitions.
     * @description Aclara si la instancia conoce una ruta de módulo o no. Se utiliza el método this.normalizationOf con el id para normalizar la ruta, por lo cual soporta rutas relativas.
     */
    knows(id) {
      // Comprueba si un id está en definitions
      Validate_parameters: {
        this.assert(typeof id === "string", "required «arguments[0]=id» as string to use «knows»");
      }
      Search_as_definition: {
        const normalizedId = this.normalizationOf(id);
        if (!(normalizedId in this.definitions)) {
          if (!(id in this.definitions)) {
            return false;
          }
        }
        return true;
      }
    }
    /**
     * @name ModulerV5.prototype.define
     * @parameter `...args:Array` - Soporta varias firmas
     * @signature `...args:[factory:Function]` - Solo 1 función, que se entiende como factoría.
     * @signature `...args:[dependencies:Array, factory:Function]` - Función factoría precedida por array de dependencias. Las dependencias pueden ser varias cosas.
     * @returns `Promise<any>` - Devuelve una promesa con lo que devuelve o exporta la factoría que se le pasa como parámetro.
     * @returns Devuelve lo que devolvería `this._callModuleFactory(dependencyPromises, factory)`.
     * @returns Teniendo en cuenta que dependencyPromises se construye mapeando `dependencies` a través de `this.mean(dependency)`.
     * @returns Pero hay que mirar el método `_callModuleFactory` para entender este método bien.
     * @returns Se mantiene separado porque ese método también se llama en el `this.mean`. 
     * @description Resuelve una factoría, inyectándole las dependencias especificadas.
     * @description Se puede dividir en 3 pasos:
     * @description 1. Validar parámetros. Se cerciora que los parámetros estén cumpliendo con alguna de las firmas antes especificadas.
     * @description 2. Resolver dependencias. Esto es que se llama al `this.mean(dependency)` y se construye `dependencyPromises` como un array de promesas.
     * @description 3. Resolver módulo. Esta parte consiste en llamar a `this._callModuleFactory(dependencyPromises, factory)`.
     * @description En este último paso, se entiende que se devuelve una Promise.
     * @description El método, sin embargo, se define como síncrono, para evitar sobrecargar de asincronicidad una función tan clave del framework.
     */
    define(...args) {
      let dependencies = [];
      let factory = undefined;
      Validate_parameters: {
        if (args.length === 1) {
          this.assert(typeof args[0] === "function", `using define: if args.length is 1 then args[0] must be factory function but «${typeof args[0]}» was found instead on «ModulerV5.prototype.define»`);
          factory = args[0];
        } else if (args.length === 2) {
          this.assert(Array.isArray(args[0]), `using define: if args.length is 2 then args[0] must be array of dependencies but «${typeof args[0]}» was found instead on «ModulerV5.prototype.define»`);
          this.assert(typeof args[1] === "function", `using define: if args.length is 2 then args[1] must be factory function but «${typeof args[1]}» was found instead on «ModulerV5.prototype.define»`);
          dependencies = args[0];
          factory = args[1];
        } else {
          throw new Error(`current arguments.length «${args.length}» is not supported`);
        }
      }
      let dependencyPromises = undefined;
      Resolve_dependencies: {
        dependencyPromises = dependencies.map(dependency => this.mean(dependency));
      }
      Resolve_module: {
        return this._callModuleFactory(dependencyPromises, factory);
      }
    }
    /**
     * @name ModulerV5.prototype.mean
     * @parameter ...args:Array - Acepta diferentes firmas.
     * @signature ...args:[id:String] - Acepta 1 identificador de dependencia
     * @signature ...args:[factory:Function] - Acepta 1 función factoría
     * @signature ...args:[dependencies:Array] - Acepta 1 array de dependencias. En este caso, devuelve las dependencias resueltas directamente, en formato `Promise<Array<?>>`.
     * @signature ...args:[dependencies:Array,factory:Function] - Acepta 1 array de dependencias seguido de 1 función factoría
     * @returns `Promise<any>` - Devuelve o la resolución final de la factoría, o la resolución final de la dependencia, o la lista de resoluciones de dependencias, según el caso de los parámetros de entrada.
     * @description Este método permite resolver dependencias y/o factorías de módulos al vuelo, de forma asíncrona.
     * @description Sin embargo, el método de define como síncrono, para no sobrecargar de asincronía un método tan clave en el framework.
     * @explanation Los pasos que sigue son:
     * @explanation 1. Validación y formateo de parámetros. Aquí encaja los argumentos. En el caso de la firma `dependencies:Array`, retorna, ya en este paso, las promesas construidas con el mapeo de la lista de dependencies mediante this.mean(dependency).
     * @explanation 2. Si hay una factoría, crea la `dependencyPromises` con el `this.mean(dependency)` y devuelve la llamada a `this._callModuleFactory(dependencyPromises, factory)`.
     * @explanation 3. Si hay un id, devuelve la definition de este de haberla, y de no haberla devuelve la llamada a `this.importModule(id)`, habiendo normalizado el id con `this.normalizationOf`.
     * @explanation En el último paso, lanza un error, porque llegados a aquí, ya se han resuelto todas las posibilidades, y la función ya debería haber hecho su return antes.
     */
    mean(...args) {
      let id = undefined;
      let dependencies = [];
      let factory = undefined;
      Validate_and_format_parameters: {
        if (args.length === 1) {
          if (typeof args[0] === "function") {
            factory = args[0];
          } else if (Array.isArray(args[0])) {
            return Promise.all(args[0].map(dependency => this.mean(dependency)));
          } else {
            this.assert(typeof args[0] === "string", `using mean: if args.length is 1 then args[0] must be dependencies:array, id:string or factory:function but «${typeof args[0]}» was found instead on «ModulerV5.prototype.mean»`);
            id = args[0];
          }
        } else if (args.length === 2) {
          this.assert(Array.isArray(args[0]), `using mean: if args.length is 2 then args[0] must be dependencies array but «${typeof args[0]}» was found instead on «ModulerV5.prototype.mean»`);
          this.assert(typeof args[1] === "function", `using mean: if args.length is 2 then args[1] must be factory function but «${typeof args[1]}» was found instead on «ModulerV5.prototype.mean»`);
          dependencies = args[0];
          factory = args[1];
        } else {
          throw new Error(`using mean: args.length must be between 1 and 2 but «${args.length}» was found instead on «ModulerV5.prototype.mean»`);
        }
      }
      if (typeof factory === "function") {
        Resolve_as_factory: {
          const dependencyPromises = dependencies.map(dependency => this.mean(dependency));
          return this._callModuleFactory(dependencyPromises, factory);
        }
      }
      else if (typeof id === "string") {
        Resolve_as_id: {
          id = this.fullpathOf(id);
          if (id in this.definitions) {
            return this.definitions[id];
          }
          return this.importModule(id);
        }
      }
      throw new Error("No, aquí no debería entrar, esta condición ya ha sido filtrada antes");
    }
    /**
     * @name ModulerV5.prototype.cloneForFile
     * @type class method
     * @parameter file:String - Fichero base para la nueva instancia de ModulerV5. Interesa su directorio, pero se facilita el no tener que extraerlo.
     * @returns ModulerV5 - Una nueva instancia de ModulerV5, que hereda de la actual, el this.
     * @description Básicamente hace: `return ModulerV5.create(this, file + "/..")`. Puedes ir al constructor de ModulerV5 para entender qué sucede al hacer esto.
     */
    cloneForFile(file) {
      return ModulerV5.create(this, file + "/..");
    }
    /**
     * @name ModulerV5.prototype.cloneForDirectory
     * @type class method
     * @parameter directory:String - Directorio base para la nueva instancia de ModulerV5.
     * @returns ModulerV5 - Una nueva instancia de ModulerV5, que hereda de la actual, el this.
     * @description Básicamente hace: `return ModulerV5.create(this, directory)`. Puedes ir al constructor de ModulerV5 para entender qué sucede al hacer esto.
     */
    cloneForDirectory(directory) {
      return ModulerV5.create(this, directory);
    }
    /**
     * @name ModulerV5.prototype._callModuleFactory
     * @type private method
     * @parameter `dependencyPromises:Array<Promise>` - Dependencias a inyectar en el factory.
     * @parameter `factory:Function` - Función factoría. A continuación se explicará la firma que sigue.
     * @parameter `submoduler:ModulerV5=null` - Instancia de ModulerV5 que quieres inyectar en la factoría. Puede ser distinta de la instancia actual, para conseguir una resolución de rutas relativas personalizada en el caso concreto.
     * @parameter `filename:String=null` - Fichero de la llamada. Se inyecta por conveniencia.
     * @parameter `dirname:String=null` - Directorio de la llamada. Se inyecta por conveniencia.
     * @returns `Promise<any>` - Devuelve lo que la factoría devuelve al llamarse, en este orden:
     * @returns 1. Si el filename termina con `.css`, devuelve lo que devuelve `this.css.add(filename)`.
     * @returns 2. Lo que devuelve la factoría con `return`, si no es `undefined`.
     * @returns 3. Lo que exporta la factoría con `module.exports` o con `export.<prop>`, si con `return` no devuelve nada o `undefined`.
     * @description Método que permite resolver módulos JavaScript y CSS.
     * @description Se utiliza para resolver cualquiera de los 2 tipos de módulos.
     * @description Es de uso interno, pero hay que saber cómo funciona para usar correctamente los métodos `define` y `mean`.
     * @description El método se define como síncrono aunque se entiende que devuelve una Promise.
     * @description Se hace así para evitar sobrecargar de asincronicidad una función tan clave en el framework.
     */
    _callModuleFactory(dependencyPromises, factory, submoduler = null, filename = null, dirname = null) {
      if (typeof filename === "string" && filename.endsWith(".css")) {
        return this.css.add(filename);
      }
      const initialState = {};
      const modulo = {
        exports: initialState
      };
      return Promise.all(dependencyPromises).then(async resolvedDependencies => {
        const output = await factory(resolvedDependencies, modulo, modulo.exports, submoduler ?? this, filename, dirname);
        const returnsUndefined = typeof output === "undefined";
        const isNotInitialState = modulo.exports !== initialState;
        const hasNewProperties = 0 !== Object.keys(modulo.exports).length;
        return modulo.exports = (returnsUndefined && (isNotInitialState || hasNewProperties) ? modulo.exports : output);
      });
    }
  };

  /**
   * @name ModulerV5.Dictionary
   * @type ModulerV5
   * @description Instancia global de ModulerV5. Tienes una referencia global para todo el programa aquí, así evitas duplicidades y otros inconvenientes.
   * @description Utiliza los parámetros por defecto. Por lo cual, es instancia original, no clonada.
   */
  ModulerV5.Dictionary = new ModulerV5();

  /**
   * @name Promise.fromObject
   * @type static method
   * @parameter obj:Object - Objeto con las Promise.
   * @description Hace lo mismo que Promise.all pero en lugar de usar y devolver un Array, usa y devuelve un Object. Es un polyfill.
   */
  Promise.fromObject = function(obj) {
    const allKeys = Object.keys(obj);
    return Promise.all(Object.values(Object.values(obj))).then(output => {
      let toObject = {};
      for (let index = 0; index < output.length; index++) {
        const item = output[index];
        toObject[allKeys[index]] = item;
      }
      return toObject;
    })
  };

  return ModulerV5;

}.call());