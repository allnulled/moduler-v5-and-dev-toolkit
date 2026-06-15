/**
 * @name ModulerV5.CssModuler.prototype._sortSheets
 * @type private method
 * @parameter eventToSync:Object - Se usarán las propiedades dependencies y counter
 * @returns void - Nada.
 * @description Método que ordena según la inter-dependencia de los ficheros css añadidos en la instancia, donde los que dependen van después de sus propias dependencias.
 * @sets eventToSync.dependencies - Especifíca en el objeto del evento de sincronización todas las dependencias acumuladas.
 * @sets eventToSync.counter - Especifíca también la cantidad de dependencias acumuladas (el length del anterior, vaya).
 */
_sortSheets(eventToSync) {
  const dependencies = [];
  const visited = new Set();
  const visit = (sheetId) => {
    if (visited.has(sheetId)) {
      return;
    }
    visited.add(sheetId);
    const sheet = this.sheets[sheetId];
    if (!sheet) {
      return;
    }
    for (const dependencyId of sheet.requires) {
      visit(dependencyId);
    }
    dependencies.push(sheet);
  };
  for (const sheetId in this.sheets) {
    visit(sheetId);
  }
  eventToSync.dependencies = dependencies;
  eventToSync.counter = dependencies.length;
}