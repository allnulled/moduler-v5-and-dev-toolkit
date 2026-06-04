🟩 Acabado en: 16:42pm 03/06/2026
   🟩 «dev»: the devtoolkit cli
      🟩 await devToolkit.cli.tool(["dev", "tool", "touch", "--file", "some/file.js"])
      🟩 En los ficheros desde el root:
         🟩 /dev/cli/tool/touch/touch.js sería dev touch --file tal.js o alternativamente ./dev touch
         🟩 /dev/cli/tool/loop/loop.js sería dev loop o alternativamente ./dev loop
            🟩 Este comando ya presupone la estructura base del proyecto y la lógica de los touch de:
               🟩 ficheros html
               🟩 ficheros css
               🟩 ficheros js
      🟩 /dev/cli.js sería la entrada con el shebang pero sería la encargada de llamar a los /dev/cli/tool/**/* e importaría a:
      🟩 /dev/api.js sería la entrada de la API de desarrollo e importaría a, entre otros si se quiere:
      🟩 /dev/lib/dev-toolkit/dev-toolkit.js que tendría la carpeta reservada para los ficheros del dev-toolkit
🟩 Iniciado en: 19:28pm 01/06/2026
   🟩 soporte a html con rutas relativas
      🟩 dejar un ejemplo de cómo inyectar una plantilla html con tjs
      🟩 en dev-toolkit.templating.test.js
      🟩 se puede usar stringifyFile y stringifyFileSync dentro de los ficheros importados por `DevToolkit.templating.tjs.renderFile`
      🟩 se han añadido también pasteFile y pasteFileSync
      🟩 tests
      🟩 Acabado en: 20:37pm 01/05/2026
🟩 rutas relativas al rootdir (no al basedir) con @/
   🟩 integrar en moduler-v5
      🟩 por el ModulerV5.prototype.normalizationOf (el fullpathOf pasa al normalization igual)
   🟩 css ahora integra los comentarios con @requires desactivados con !requires
      🟩 para que cada bundle final no líe al compilador
   🟩 centralizar llamada a evalscript
      🟩 estaba en define, mean y importModule
   🟩 poder usar define y mean contra extensión .css
      🟩 que solo afecte al ModulerV5.prototype.css (instancia de CssModuler)
      🟩 pero que funcione con el css el define y el mean también
      🟩 test en moduler-v5.css-dependency.test.js
   🟩 tests
🟩 Iniciado en: 11:00am 30/05/2026
  🟩 Inyectar `$dictionary` que tenga el `basedir` del fichero
    🟩 Que pueda usarse para llamar al `define` y al `mean` usando rutas relativas al fichero
    🟩 Usando `normalizationOf`
    🟩 Dejar unos tests
    🟩 Acabado en: 12:44pm 30/05/2026
🟩 Iniciado: 30/05/2026 00:39am
  🟩 Tests para comprobar que los parámetros son correctos en todas las firmas
  🟩 Normalización de urls y paths con normalizationOf
    🟩 Acabado: 30/05/2026 02:06am
🟩 Acabado: 30/05/2026 00:39am
  🟩 Cumplir con las firmas de la especificación de moduler-v5
    🟩 define(dependencies:Array, factory:Function)
    🟩 define(factory:Function)
    🟩 mean(dependencies:Array, factory:Function)
    🟩 mean(dependencies:Array)
    🟩 mean(id:String)
    🟩 mean(factory:Function)
🟩 Iniciado: 29/05/2026 09:00am
🟩 Iniciado 28/05/2026 11:37am
  🟩 Eventos:
    🟩 Que al tocar con `touch()` un fichero:
      🟩 Se propague la compilación de:
        🟩 los on-touch.js 
          🟩 Acabado: 28/05/2026 17:54am
        🟩 los `<dir>/*.entry.js`
        🟩 los on-test.js 
          🟩 Acabado: 29/05/2026 08:55am
🟩 Acabado: 28/05/2026 11:37am
  🟩 Semáforos:
    🟩 que se bloquee si está cerrado
    🟩 un test confirmando
🟩 Acabado: 28/05/2026 23:54pm
  🟩 ModulerV4
    🟩 Una implementación mínima similar al estándar AMD
    🟩 Con soporte para estatizar valores prometidos
    🟩 Ya está, no tiene nada más