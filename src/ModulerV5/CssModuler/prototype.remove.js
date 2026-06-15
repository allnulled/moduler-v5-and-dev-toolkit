/**
 * @name ModulerV5.CssModuler.prototype.add
 * @type class method
 * @parameter input1:String - Ruta del fichero css a eliminar. Se usa el método `ModulerV5.prototype.fullpathOf` para normalizar.
 * @returns this:ModulerV5.CssModuler - Devuelve la instancia propia por si se quiere hacer chaining.
 * @asserts id in this.sheets - Comprueba que el id existe en this.sheets o lanza un error de aserción.
 * @deletes this.sheets[id] - Elimina el fichero css del this.sheets
 * @description Elimina un fichero css añadido previamente del this.sheets. No hace recursión, se elimina la hoja suelta, y esto puede producir inconsistencias. Usar con coherencia con esto, o evitar de usarlo.
 */
remove(input1) {
  const id = this.moduler.fullpathOf(input1);
  this.assert(id in this.sheets, "cannot remove sheet because it is not added: " + id);
  delete this.sheets[id];
  return this;
}