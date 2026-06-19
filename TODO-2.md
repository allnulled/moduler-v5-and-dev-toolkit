🔴🟠🟩🔵

🔴=Pendiente 🟠=Activo 🟩=Hecho 🔵=Trámite 







🟠 Sintaxis de injection para await include camuflado:
  🟠 Que permita pasarle parámetros igual
  🟠 Con test propio
  🟠 Y aquí haces EXAMPLES.md
    🟠 Con el ejemplo directamente usando injection
    🟠 Y en el del run-time, el define
    🟠 Y en el del css ya veremos porque tiene que ver con el environment y el método que llames
      🟠 No cómo lo escribas
      🟠 E igual eso no tiene que ser así
        🟠 requires & injects quizá como hablando a diferentes entornos a la vez, a diferentes times
        🟠 Esto hay que hacerlo
        🟠 Y dejarlo testeado
        🟠 Esto afecta al buildCss del cli y al ModulerV5.CssModuler
🟠 Ahora sí, hay que usar npm link y:
  🟠 Tiene que poderse hacer:
    🟠 execSync("devtk", { cwd: "cualquier/punto/del/proyecto" })
    🟠 execSync("devtk build docs", { cwd: "cualquier/punto/del/proyecto" })
    🟠 execSync("devtk build js --file src/whatever.js", { cwd: "cualquier/punto/del/proyecto" })
    🟠 execSync("devtk build css --file src/whatever.css", { cwd: "cualquier/punto/del/proyecto" })
    🟠 execSync("devtk test --file src/whatever.js", { cwd: "cualquier/punto/del/proyecto" })
    🟠 execSync("devtk help", { cwd: "cualquier/punto/del/proyecto" })
🟠 Otras cosas que tienes que ir teniendo en cuenta son:
  🟠 Eventos de propagación, obvio:
    🟠 build css
    🟠 build dist/*
    🟠 build and run test/unit/*
    🟠 build docs in different guides/{path/to/entry}.md
      🟠 Then inject them from README.tpl through {{ Table Of Guides }}
      🟠 Esto afecta al buildDocs
      🟠 Y debería haber algún método en la del Documentator que ya hiciera esto directamente
  🟠 Carpeta de src/pattern
  🟠 Carpeta de src/project
  🟠 Estructuras de src/project/{name}:
    🟠 entry/api.js     | La API común de browser y node
    🟠 entry/browser.js | La API de browser solamente
    🟠 entry/os.js      | La API del os/nodejs solamente
    🟠 entry/bin.js     | El binario para línea de comandos
    🟠 entry/client.js  | La API común del socket.io-client (browser y server)
    🟠 entry/server.js  | La API del socket.io server solamente
    🟠 entry/web.js     | La API de gráficos web
  🟠 Fichero de src/main.js
    🟠 Que preferiblemente use inject
    🟠 Y así puedes pivotar la entrada del proyecto












---------------------------------------------------------------

🔴 «dev tool create project»
   🔴 crea un proyecto desde 0
   🔴 la opción --install-dependencies llama a `npm install` pero por defecto no
   🔴 lo usaremos para hacer tests
🔴 «dev» tiene que poder encontrar el directorio que tenga un `dev.config.js`
🔴 tests para usar «dev» contra proyectos inventados en runtime para probar:
   🔴 el proceso de eventos del loop: dev tool loop

---------------------------------------------------------------

🔴 «dev loop»: the devtoolkit loop
   🔴 sería el «dev loop»
   🔴 flujo de touch js, touch css, touch html, touch ts
   🔴 flujo js y css:
      🔴 si es .entry.js fabricar el .dist.js
      🔴 si es .entry.js fabricar el .test.js (en css nada)
         🔴 ejecutar el test
      🔴 buscar el .entry.js/css superior y hacerle touch
         🔴 el touch va con el flag de bypassSemaphore en true
      🔴 al acabar, desactivar el semáforo
   🔴 flujo de ts:
      🔴 fabricar el .js
      🔴 hacerle touch al .js
       🔴 on bypassSemaphore en true
      🔴 tests
🔴 devtoolkit docs
   🔴 recuperar el concatenador a json/md
   🔴 empezar proyecto (sin cli, con un dev.sh)
   🔴 src, dist, test/unit, dev/touch.js, guide

---------------------------------------------------------------


