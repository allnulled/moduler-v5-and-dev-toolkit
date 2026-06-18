🟢🟡⛔️

🟡 Todos los comandos iniciales de la API de CommandLine con tests en v4:
  🟡 build js
    🟡 con tree propagation: espera que sea o busca arriba un .entry.js
    🟡 fabrica el dist si es .entry.js
    🟡 fabrica el test/unit si es .entry.js
    🟡 llama al onTouch.js si lo hay
      🟡 devuelve un objeto, no un callback solamente
    🟡 y aquí vuelve a empezar
  🟡 build css
    🟡 con tree propagation: busca arriba un .entry.css
    🟡 con match en onTouch.js
  🟡 build ts ya lo haremos, ahora no
  🟡 build doc próximamente
  🟡 test js
    🟡 carga el fichero y llama a la función
  🟡 loop
    🟡 empieza el desarrollo
  🟡 export
    🟡 customizable, no hace nada en principio