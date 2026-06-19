# moduler-v5-and-dev-toolkit

ModulerV5 es un modulador en runtime de JS/CSS y DevToolkit es un kit de herramientas de desarrollo para JS.

## Índice

{{ Table Of Contents }}

## Estado

⚠️ En construcción.

## Ejemplos de uso

⚠️ En proceso.

## Composición general

- La API, en general, son clases e instancias de clase anidadas.
- `DevToolkit` y `ModulerV5` son las globales principales que se sobreescriben
- `DevToolkit.Moduler` es `ModulerV5` embedido, porque:
   - DevToolkit es código para el compilation-time
      - Tiene todo lo necesario para la modulación/compilación en el compilation-time
      - Principalmente, se incluyó a ModulerV5 para poder compilar el CSS en el compilation-time
         - Pero el CssModuler requiere de ModulerV5
         - Así que al final, he decidido incluir todo el ModulerV5 en el DevToolkit y ya está
   - ModulerV5 es código para el run-time
      - Se encarga de la modulación del JS y el CSS en run-time
      - Tiene lo mínimo necesario para la modulación en el run-time
      - Se separa de DevToolkit para contaminar lo menos posible el run-time

## Ficheros, hooks globales y librerías de terceros embedidas

Los ficheros son:

- `dist/moduler-v5/moduler-v5.dist.js`
- `dist/dev-toolkit/dev-toolkit.dist.js` 
   - recuerda que `DevToolkit.Moduler` es la clase `ModulerV5` embedida

Estos los hooks globales que se escriben en `window` y `global` separados:

- `ModulerV5` (clase)
   - `ModulerV5.Dictionary` (instancia global de `ModulerV5`)
   - `ModulerV5.CssModuler` (clase)
      - `ModulerV5.css` (instancia global de `CssModuler`)
- `DevToolkit` (clase)
   - `DevToolkit.Moduler`: es la clase `ModulerV5`
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
      - `js-beautify: ^1.15.4` es opcional pero recomendable

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

{{ API }}

## Reflexión

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