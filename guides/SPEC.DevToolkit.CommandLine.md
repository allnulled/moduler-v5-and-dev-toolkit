# La especificación de la API de CommandLine de DevToolkit

La API de `DevToolkit.CommandLine` se encarga del soporte de las herramientas más básicas entorno a la línea de comandos de DevToolkit.

## Índice

- [La especificación de la API de CommandLine de DevToolkit](#la-especificación-de-la-api-de-commandline-de-devtoolkit)
  - [Índice](#índice)
  - [Cláusulas](#cláusulas)
    - [C.1. La API de colores de consola](#c1-la-api-de-colores-de-consola)
    - [C.2. Método printError](#c2-método-printerror)
    - [C.3. Método tool](#c3-método-tool)
    - [C.4. Métodos de herramientas de desarrollo](#c4-métodos-de-herramientas-de-desarrollo)
    - [C.5. La variable baseProject](#c5-la-variable-baseproject)

## Cláusulas

Las cláusulas de esta API.

### C.1. La API de colores de consola

- En `DevToolkit.CommandLine.Colors` tienes la API de colores por consola
- Se coge del `refrescador`
- No está documentada
   - porque en verdad mejor evitar entretenerse con los coloritos
   - pero es fácil, principalmente te interesan:
      - método `.style("red,bgBlack,bold,italic,underline").text("whatever")`
      - método `.box("red,bgBlack,bold,italic,underline")`
      - alguno más
   - pero no conviene distraerse con esta API

### C.2. Método printError

- Este usa los coloritos para pintar un error llamativo por consola

### C.3. Método tool

- Este método es el pivote de las herramientas del *command line interface* final de `DevToolkit`, que es `dev`.
   - acepta parámetros tipo `process.argv`: `Array<String>`
   - busca la herramienta que se le pase en los parámetros posicionales
      - que van hasta encontrarse un `--algo` o `-a`

Uso:

```bash
dev build js --file fichero.js
```

Llama a:

```js
devToolkit.tool(["build", "js", "--file", "fichero.js"]);
```

Que buscará a:

```
dev/cli/tool/build/js/build.js.js
```

### C.4. Métodos de herramientas de desarrollo

- Estos métodos están programados directamente en el proyecto que generas desde 0
   - Esto se hace para que esta parte de la API:
      - quede totalmente al descubierto
      - quede uniformizada con la API de desarrollo propia del caso
      - y poder extender fácilmente la API del CLI de forma personalizada por proyecto
      - pero manteniendo todas las utilidades que `DevToolkit` quiere usar para facilitar y acelerar el desarrollo
         - pero personalizables, hookeables a nivel de código sin misterios ni hooks siquiera
- Estos métodos conectan la API de `DevToolkit.CommandLine` con la carpeta de `dev/cli/tool`
   - que es donde tienes que ir para ampliar los comandos de `dev x`
- Estos métodos base que quiere usar `DevToolkit` incluyen:
   -`

### C.5. La variable baseProject

- La variable `DevToolkit.CommandLine.baseProject:Object` es un poco especial
   - es la semilla que usa `createProject` para fabricar un proyecto desde 0
   - es un objeto que representa un árbol de ficheros
      - los objetos son directorios, los strings son ficheros
      - se ignora el `dev-toolkit.dist.js` para evitar recursividad en la generación
      - pero el `createProject` lo inyecta cuando se le requiere usando `__filename` y `fs.promises.readFile`
   - los métodos de herramientas de desarrollo están aquí y no en el código propio
      - este objeto se está fabricando desde otro proyecto
      - todo esto es temporal, pero ahora mismo está así
   - esto es muy feo, pero todos estos desarrollos primarios son un poco así
   - esto se está haciendo así porque en el proyecto creado:
      - que es el starter
      - no interesa tener estas APIs desgranadas
      - podría ponerlo dentro de este? Creo que sí, ah, pero el node_modules no quería entrometerlo.
      - supongo que sí
      - de hecho, mínimo, tengo que cambiar el nombre del proyecto a moduler-v5-and-dev-toolkit
      - a ver si podemos.