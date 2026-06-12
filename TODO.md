🟢 Puede crear proyectos desde 0 
  🟢 Con DevToolkit.CommandLine.createProject
  🟢 Se basa en moduler-v5-and-dev-toolkit-starter
  🟢 Se utiliza un JSON intermedio para no depender de directorios
  🟢 El JSON se está exportando desde moduler-v5-starter a aquí
🟢 Que se pueda replicar un proyecto en blanco con createProject
  🟢 Que no incurra en expansión infinita
    🟢 el dev-toolkit.dist.js se ignora en la jsonificación inicial
    🟢 el dev-toolkit.dist.js se inyecta en el último momento
    🟢 el dev-toolkit.dist.js no se hace grande infinito y consigue replicar todo el proyecto
🟢 Documentador
  🟢 Primera versión con lo normal de javadoc
    🟢 Saca un JSON
    🟢 Separa por ficheros/tags/menciones del mismo tag
      🟢 Separa si un tag es usado múltiples veces
    🟢 Junta las líneas pero respetando el salto de línea
🟡 El CommandLine compartirá algunos métodos con comandos del cli:
  🟡 buildJs: dev build js --file f.js
  🟡 buildCss: dev build css --file f.css
  🟡 buildTs: dev build ts --file f.ts
  🟡 testJs: dev test js --file f.js
  🟡 loop: dev loop
  🟡 up: dev up --message whatever (git push)
⛔️ Aclarar los comandos iniciales de cualquier proyecto
  ⛔️ Esto va en el moduler-v5
  ⛔️ Pero afecta a este proyecto por el baseProject del CommandLine