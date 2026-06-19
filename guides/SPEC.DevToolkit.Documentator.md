# La especificación de la API de Documentator de DevToolkit

La API de `DevToolkit.Documentator` se encarga de generar la documentación desde comentarios en el código.

## Índice

- [La especificación de la API de Documentator de DevToolkit](#la-especificación-de-la-api-de-documentator-de-devtoolkit)
  - [Índice](#índice)
  - [Cláusulas](#cláusulas)
    - [C.1. Tipo de comentarios para documentación](#c1-tipo-de-comentarios-para-documentación)
    - [C.2. Poder extraer el texto de los comentarios](#c2-poder-extraer-el-texto-de-los-comentarios)
    - [C.3. Poder extraer el JSON de los comentarios](#c3-poder-extraer-el-json-de-los-comentarios)

## Cláusulas

Las cláusulas de esta API.

### C.1. Tipo de comentarios para documentación

Los tipos de comentarios para documentación son los típicos del Javadoc clásico.

No hay tags específicos, todos valen.

### C.2. Poder extraer el texto de los comentarios

Uno de los métodos permite extraer todo el texto de los comentarios javadoc.

Este método es el `extractJavadocTextFromDirectory(dir:String):`Promise<String>``.

### C.3. Poder extraer el JSON de los comentarios

Otro de los métodos permite extraer los comentarios javadoc por cada fichero que contenga alguno, en formato JSON.

Este método es el `extractJavadocCommentsFromDirectory(dir:String):`Promise<Array<Object>>``.