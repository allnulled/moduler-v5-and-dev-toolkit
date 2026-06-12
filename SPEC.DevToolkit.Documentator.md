# La especificación de la API de Documentator de DevToolkit

La API de `DevToolkit.Documentator` se encarga de generar la documentación desde comentarios en el código.

## Índice


## Cláusulas

Las cláusulas de esta API.

### C.1. Los comentarios especiales

A continuación se listan los comentarios especiales que tomará el documentador para generar la documentación en ficheros json, markdown y/o html.

- `// @docs.set`
   - acepta un objeto JSON con:
      - `file`: nombre del fichero al que va la documentación que sigue
      - `section`: array de nombres de la sección del fichero
      - `order`: dentro de la sección, el orden de prioridad que tendría
- `// @docs.in`
   - no acepta parámetros
   - indica que tanto código como comentarios se tienen que meter dentro de la documentación
- `// @docs.out`
   - no acepta parámetros
   - indica que no hay que coger código a partir de aquí