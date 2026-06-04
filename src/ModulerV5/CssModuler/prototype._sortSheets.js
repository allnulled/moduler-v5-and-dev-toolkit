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