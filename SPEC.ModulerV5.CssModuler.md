# La especificación del CssModuler de ModulerV5

La especificación del CssModuler de ModulerV5 intenta explicar cómo se espera usar el modulador de CSS del ModulerV5.

## Índice

- [La especificación del CssModuler de ModulerV5](#la-especificación-del-cssmoduler-de-modulerv5)
  - [Índice](#índice)
  - [Cláusulas](#cláusulas)
    - [C.1. Hay una clase que recibe una instancia de ModulerV5 y la expone](#c1-hay-una-clase-que-recibe-una-instancia-de-modulerv5-y-la-expone)
    - [C.2. Hay un método para registrar hojas css](#c2-hay-un-método-para-registrar-hojas-css)
    - [C.3. Hay un método para desregistrar hojas css](#c3-hay-un-método-para-desregistrar-hojas-css)
    - [C.4. Hay un método para sincronizar](#c4-hay-un-método-para-sincronizar)
    - [C.5. Funcionamiento interno](#c5-funcionamiento-interno)
    - [C.6. Sintaxis de los requires del css](#c6-sintaxis-de-los-requires-del-css)

## Cláusulas

Conjunto de cláusulas de la especificación.

### C.1. Hay una clase que recibe una instancia de ModulerV5 y la expone

- La clase `ModulerV5.CssModuler`
- La instancia `ModulerV5.prototype.css`
   - accede a la instancia `ModulerV5` padre con `ModulerV5.prototype.css.moduler`

### C.2. Hay un método para registrar hojas css

- El método `ModulerV5.prototype.css.add(subpath:String):Promise<Object>` permite:
   - registrar una hoja css
   - registrar las hoja css incluidas por esa hoja css con la sintaxis `/*@requires:x.css*/`
   - registrar las hoja css incluidas por esas incluidas, y así recursivamente, hasta resolver todos los módulos.
   - implica que esa hoja quiere ser insertada
   - si usa el mismo `subpath` que otro anterior, se usa el cacheado
   - finalmente, cuando se llame a `ModulerV5.prototype.css.synchronize()`, se asegurará que esa hoja css sea sincronizada por el navegador
      - en node.js solo generará el css final de todas las hojas de la instancia, pero no se inyecta porque no está la API de webkit

### C.3. Hay un método para desregistrar hojas css

- El método `ModulerV5.prototype.css.remove(subpath:String):Promise<Object>` permite:
   - desregistrar una hoja css
   - finalmente, cuando se llame a `ModulerV5.prototype.css.synchronize()`, se asegurará que esa hoja css no aparezca en el css final

### C.4. Hay un método para sincronizar

- El método `ModulerV5.prototype.css.synchronize():Promise<Object>` permite:
   - refrescar las hojas css actualmente cargadas por el navegador a través de esa instancia `CssModuler`.
   - lo que sucede es que:
      - `synchronize()` genera una hoja css final con los módulos cargados y ordenados por orden de dependencia
      - ese css final lo inyecta con la API de `CSSSheet` mediante el método [`replace`](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/replace).

### C.5. Funcionamiento interno

- Con `add` y `remove` controlas las hojas css que quieres incluir
   - La carga recursiva se produce en el `add`, no en el `synchronize`
   - Se buscan los `/*@requires:x.css*/` y se van resolviendo
- Con `synchronize` controlas que el navegador se actualice con las hojas que tienes incluidas
   - Previamente hay un paso de ordenación de los `/*@requires:x.css*/`
      - donde los css que se necesitan siempre están detrás de los que los necesitan
   - Pero la carga recursiva ya se ha hecho en el `add`

### C.6. Sintaxis de los requires del css

Los `/*@requires:x.css*/` sirven para decir que ese `x.css` debe cargarse antes que la hoja actual.

Esto es lo que se supone que debería soportar la especificación:

- Permiten rutas absolutas: `/*@requires:http://loquesea.com/ruta/a/fichero.css*/`
- Permiten rutas absolutas de Windows: `/*@requires:C:/ruta/a/fichero.css*/` (no testeado todavía)
- Permiten rutas absolutas de Linux: `/*@requires:/ruta/a/fichero.css*/`
- Permiten rutas relativas al fichero css actual: `/*@requires:./file.css*/`
- Permiten rutas relativas superiores al fichero css actual: `/*@requires:../file.css*/` (no testeado todavía)
- Permiten rutas relativas a la raíz del modulador padre: `/*@requires:@/ruta/a/fichero.css*/` (no testeado todavía)