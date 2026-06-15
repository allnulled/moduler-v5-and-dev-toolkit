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
    if(input2 === null) {
      // @OK: no extra file
    } else if(typeof input2 === "string") {
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
    this.rootdir = rootdir ?? basedir;
    this.basedir = basedir;
    this.definitions = definitions;
    this.css = cloneRoot ? cloneRoot.css : this.constructor.CssModuler.create(this);
  }
}