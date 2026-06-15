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
normalizationOf = function (subpath, debug = false) {
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
  if(finalUrl.length !== 1) {
    finalUrl = finalUrl.replace(/\/$/g, "");
  }
  if (debug) {
    console.log(finalUrl);
  }
  return finalUrl;
};