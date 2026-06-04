# La especificación de ModulerV5

La especificación ModulerV5 intenta explicar cómo tiene que ser el framework y por qué así.

## Índice

- [La especificación de ModulerV5](#la-especificación-de-modulerv5)
  - [Índice](#índice)
  - [Cláusulas](#cláusulas)
    - [C.1. El identificador principal es el path](#c1-el-identificador-principal-es-el-path)
    - [C.2. Un path puede exportar 1 valor pero definir múltiples valores](#c2-un-path-puede-exportar-1-valor-pero-definir-múltiples-valores)
    - [C.3. Usa module.exports y exports.prop pero no return](#c3-usa-moduleexports-y-exportsprop-pero-no-return)
    - [C.4. Firmas de los métodos](#c4-firmas-de-los-métodos)
      - [C.5. Firma de la función factory](#c5-firma-de-la-función-factory)
      - [C.6. Variables fantasma en los scripts de dependencias](#c6-variables-fantasma-en-los-scripts-de-dependencias)
      - [C.7. Particularidades de la variable fantasma $dictionary](#c7-particularidades-de-la-variable-fantasma-dictionary)
      - [C.8. Particularidades de la variable global Dictionary](#c8-particularidades-de-la-variable-global-dictionary)
  - [Ejemplos](#ejemplos)
    - [E.1. Ejemplo de módulo](#e1-ejemplo-de-módulo)

## Cláusulas

Conjunto de cláusulas de la especificación.

### C.1. El identificador principal es el path

- De momento se empieza sin un id personalizable
   - Esto es para no redundar en identificadores, sabiendo que el path ya es un identificador único
   - Más adelante se añadirá

### C.2. Un path puede exportar 1 valor pero definir múltiples valores

- En 1 fichero puedes exportar solamente 1 módulo, pero puedes definir varios.
- En último lugar, siempre puedes exportar la misma colección que defines en el fichero.
- Esto es para evitar la confusión, exportar varios módulos

### C.3. Usa module.exports y exports.prop pero no return

- Los ficheros usan la sintaxis de node.js:
   - `module.exports` para exportar de golpe todo el módulo
   - `exports.<prop>` para exportar en tiempo real partes del módulo
   - puede usarse `return` también (que sobreescribe si no es `undefined`) solo que es bloqueante, interrumpe el script

### C.4. Firmas de los métodos

- El `define` permite:
   - `define(dependencies:Array, factory:Function):Promise`: factory con dependencias
   - `define(factory:Function):Promise`: factory sin dependencias
- El `mean` permite:
   - `mean(dependencies:Array, factory:Function):Promise`: factory con dependencias
   - `mean(dependencies:Array):Promise` (exclusiva de `mean`): dependencias sin factory
   - `mean(id:String):Promise` (exclusiva de `mean`): dependencia única
   - `mean(factory:Function):Promise`: factory sin dependencias

#### C.5. Firma de la función factory

- El `factory:Function` recibe:
   - `...dependencies:Array<any>`: dependencias resultas en el orden proporcionado
   - `module:Object`: la fórmula de node.js para usar `module.exports`
   - `exports:Object`: la fórmula de node.js para usar `exports.<prop>`
   - `$dictionary:ModulerV5`: instancia de `ModulerV5` que ha hecho la llamada a `define` o `mean`
      - esto permite usar las firmas `$dictionary.define`, `$dictionary.mean`, etc. para referirse a la instancia local de cada caso
   - `__filename:String`: ruta completa del fichero actual
   - `__dirname:String`: ruta completa de la carpeta actual


Su uso quedaría así:

```js
$dictionary.define(["./a.js", "./b.js"], function(a, b, module, exports, $dictionary, __filename, __dirname) {
    //...
});
$dictionary.mean(["./a.js", "./b.js"], function(a, b, module, exports, $dictionary, __filename, __dirname) {
    //...
});
```

#### C.6. Variables fantasma en los scripts de dependencias

- Esto es en el contexto de scripts importados por `dependencies` en las firmas:
   - `Dictionary.define([...dependencies], factory)`
   - `Dictionary.mean([...dependencies], factory?)`
- Las variables fantasma son las mismas que las de la función `factory:Function` pero sin dependencias inyectadas y con los nombres prestablecidos:
   - `module:Object`
   - `exports:Object`
   - `$dictionary:ModulerV5`
   - `__filename:String`
   - `__dirname:String`

#### C.7. Particularidades de la variable fantasma $dictionary

- Tanto en los scripts importados por `define` y `mean` como en las funciones `factory`, se inyecta la variable `$dictionary`.
- La variable `$dictionary` es una instancia de la clase `ModulerV5`
   - Es una distancia distinta a la original, vía `ModulerV5.prototype.cloneForFile` se hace un duplicado
   - La única diferencia con la instancia original es que:
      - En el clon, el `basedir` apunta al directorio del fichero que es importado
      - En el original, el `basedir` apunta al directorio del fichero que llama a importar a otro (con `define` o `mean`)
      - El `rootdir` es común en ambos ficheros, por eso, y apunta al `basedir` de la instancia original de toda la rama de clones
         - Porque en cada clonación, al clon se le pasa el `rootdir` intacto
- Esto es lo que permite rutas relativas por cada fichero
   - Porque `$dictionary.basedir` va cambiando
- Pero cuidado: esto significa que si retienes los `$dictionary` semánticamente:
   - El Garbage Collector puede no borrar nunca las instancias `$dictionary`
      - Porque una función tiene previsto usarlo, sería el caso más habitual
   - El uso de `$dictionary` en cada script debería ser:
      - síncrono: el primer nivel del script, sin `await`s intermedios
      - conciso: el uso del `$dictionary` es cargar cosas, y cachear
      - esporádico: no hacer grandes planes con esta variable en los scripts
         - si quieres usar reflection de módulos, es mejor usar directamente `Dictionary`
      - inmediato: en el primer nivel, no dentro de funciones
      - no retener a `$dictionary` dentro de funciones para hacer magia porque puedes crear basura en memoria

#### C.8. Particularidades de la variable global Dictionary

- La variable global `Dictionary` está originalmente en `ModulerV5.Dictionary`
- Es una instancia de `ModulerV5` de acceso global
- Es la forma normal: cargar las cosas en 1 mismo modulador globalmente
- Su `rootdir` y su `basedir` siempre coinciden, porque no es un clon
- Se contrapone a la variable `$dictionary` en que:
   - `$dictionary` tiene el `basedir` del directorio del script en sí
      - es decir, igual que la variable inyectada `__dirname`
   - `$dictionary` tiene el `rootdir` del `basedir` del modulador original (no clon)
      - y no tiene por qué coincidir con el del `Dictionary`
      - porque `$dictionary` aparecerá en cualquier script importado de cualquier instancia de modulador, no solo de `Dictionary`

----

## Ejemplos

----

### E.1. Ejemplo de módulo

A continuación se explican 2 formas de hacer módulos que se parecen pero no son lo mismo.

----

En el main empiezas el hilo:

```js
// main.js
const lib = await $dictionary.define("./lib.js");
```

Y ahora las 2 opciones. Nótese que no resultan en lo mismo: una devuelve una promesa (b) y la otra un objeto con 2 promesas (a).

----

Opción a, sería la más optimizada - porque los vas exponiendo a medida que los defines, cuando tienes muchas definiciones juntas y hay prisa por otros módulos:

```js
// lib.js
export.ab = $dictionary.define(["./lib/a.js","./lib/b.js"], function(a, b) {
    return { a, b };
});
export.cd = $dictionary.define(["./lib/c.js","./lib/d.js"], function(c, d) {
    return { c, d };
});
```

Que se usaría así:

```js
Opcion_a: {
    await lib.ab;
    console.log(lib.ab.a);
    console.log(lib.ab.b);
    await lib.cd;
    console.log(lib.cd.c);
    console.log(lib.cd.d);
}
```

----

Opción b, sería la clásica - es más compacta y fácil de gestionar luego porque solo tienes que hacer `await` en el punto de salida:

```js
// lib.js
module.exports = $dictionary.define(["./lib/a.js","./lib/b.js","./lib/c.js","./lib/d.js"], function(a,b,c,d) {
    return {
        ab: { a, b },
        cd: { c, d },
    };
});
```

Que se usaría así:

```js
Opcion_b: {
    console.log(lib.ab.a);
    console.log(lib.ab.b);
    console.log(lib.cd.c);
    console.log(lib.cd.d);
}
```

Son diferentes técnicas, que pueden interesar en diferentes contextos. Por mi experiencia, yo uso la opción b, pero la a es más óptima.