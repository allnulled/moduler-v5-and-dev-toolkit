/**
 * @name ModulerV5.stringify
 * @type static method
 * @parameter it:any - Cualquier cosa que sea stringificable por el método mismo.
 * @returns String|any - Devuelve la stringificación, o si da error, el parámetro tal cual.
 * @description Actualmente solo llama a JSON.stringify, no hay un método más allá de stringificación.
 */
static stringify(it) {
  try {
    return JSON.stringify(it);
  } catch (error) {
    return it;
  }
}