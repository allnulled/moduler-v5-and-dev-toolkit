# La especificación de DevToolkit

Esta especificación intenta dar un overview, pero la API de DevToolkit todavía está siendo ampliada, y en principio no está completamente documentada aquí, porque son varias APIs juntas, se usará la sección de `Referencia` del README original del proyecto.

## Índice

- [La especificación de DevToolkit](#la-especificación-de-devtoolkit)
  - [Índice](#índice)
  - [Cláusulas](#cláusulas)
    - [C.1. Hay una API estática y otra dinámica](#c1-hay-una-api-estática-y-otra-dinámica)
    - [C.2. La principal diferencia entre la API estática y dinámica](#c2-la-principal-diferencia-entre-la-api-estática-y-dinámica)

## Cláusulas

Las cláusulas de la especificación.

### C.1. Hay una API estática y otra dinámica

La API de DevToolkit principalmente expone 2 ramas mezcladas:

- La rama de la API estática:
   - las clases y sus métodos estáticos:
      - `DevToolkit.FileSystem`
      - `DevToolkit.Testing`
      - `DevToolkit.Templating`
      - etc.
- La rama de la API dinámica:
   - sus métodos son los métodos prototipo de las clases anteriores
   - las instancias y sus métodos prototipo:
      - `DevToolkit.prototype.fileSystem`
      - `DevToolkit.prototype.testing`
      - `DevToolkit.prototype.templating`
      - etc.

### C.2. La principal diferencia entre la API estática y dinámica

La principal diferencia es que los métodos de la API dinámica:

- sí conocen la ruta del `DevToolkit`:
   - por lo cual los métodos prototipo sí entienden las rutas relativas: `./ruta` y `../ruta`
- sí conocen a una instancia de `DevToolkit`:
   - en todas las clases puedes alcanzarla con `this.toolkit`

Los métodos estáticos es una capa más abstracta, pero reaprovechable igual.