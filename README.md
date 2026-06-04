# moduler-v5-and-dev-toolkit

ModulerV5 es un modulador en runtime de JS y DevToolkit es un kit de herramientas de desarrollo para JS.

## Índice

- [moduler-v5-and-dev-toolkit](#moduler-v5-and-dev-toolkit)
  - [Índice](#índice)
  - [Estado](#estado)
  - [Composición](#composición)
  - [Especificaciones](#especificaciones)
  - [API](#api)
    - [Partes más críticas](#partes-más-críticas)
  - [Dominios de ModulerV5 y DevToolkit](#dominios-de-modulerv5-y-devtoolkit)
  - [Motivación](#motivación)


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

## API

{{ API aquí }}

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