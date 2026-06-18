🟡 Separar las propiedades de clase en ficheros aparte para poder ver la API desde los mismos ficheros
  🟡 Si son propiedades que se establecen en el constructor, pues exactamente igual
  🟡 Lo importante es tener la representación del árbol en ficheros que se pueda ver a simple vista

🟡 El CommandLine compartirá algunos métodos con comandos del cli:
  🟡 buildJs: dev build js --file f.js
  🟡 buildCss: dev build css --file f.css
  🟡 testJs: dev test js --file f.js
  🟡 loop: dev loop
  🟡 up: dev up --message whatever (git add+commit+push)
🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡

Cosas que tiene que tener la command line:

1. Funcionar desde cualquier directorio, pero actuar igual desde el root del proyecto:
   - Se consigue con el método findProjectRoot
   - Se basa en el fichero package.json por defecto

2. Dar soporte a varios comandos:

dev build js
dev build css
dev build docs
dev test js
dev loop
dev up
dev help
dev new project

3. ok.