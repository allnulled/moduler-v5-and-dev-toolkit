
🔴=Pendiente 🟠=Activo 🟩=Hecho 🔵=Trámite 

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

opcional:

🔴 inject parser
   🔴 para meter plantillas html
   🔴 en todas las formas legacy posibles
   🔴 sin cachear strings innecesariamente
   🔴 por eso no van al modulerv5 sino al devtoolkit
   🔴 tests

---------------------------------------------------------------