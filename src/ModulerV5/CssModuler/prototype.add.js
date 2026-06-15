/**
 * @name ModulerV5.CssModuler.prototype.add
 * @type class method
 * @parameter input1:String - Ruta al fichero css. Se usa el método `ModulerV5.prototype.fullpathOf` para normalizar.
 * @parameter eventToAdd:Object - Objeto del evento de añadir. Usa las propiedades oldSheets, newSheets y count.
 * @returns eventToAdd:Object - Objeto que representa el evento de añadir.
 * @sets eventToAdd.oldSheets - Va poniendo las sheets que ya se conocían en this.sheets, antes de iniciar el evento de añadir.
 * @sets eventToAdd.newSheets - Va poniendo las sheets que no se conocían en this.sheets antes de iniciar el evento de añadir.
 * @sets eventToAdd.count - Va incrementando el contador a medida que las va encontrando.
 * @description Añade recursivamente, llamando a this.add recursivamente y pasándole el mismo objeto del evento de añadir, las dependencias especificadas con comentarios css que cumplan el patrón: `/ *@requires:fichero.css* /`
 * @explanation Añade la hoja especificada, en old o new. Si está en old, no la analiza. Pero si entra en newSheets, analiza el contenido para extraer los `/ *@requires:fichero.css* /`, y los añade con `this.add` recursivamente.
 * @explanation Los objetos que representan a cada fichero css tienen las propiedades id:String, source:String, requires:`Array<String>`.
 * @explanation Otro dato importante es que en cada nuevo fichero/dependencia, crea un ModulerV5 diferente, con una ruta propia fijada al fichero css que se está incluyendo. De esta forma, el fichero css soporta rutas relativas, y puedes importar ficheros así: `/ *@requires:./fichero.css* /`
 */
async add(input1 = null, eventToAdd = { newSheets: {}, oldSheets: {}, count: 0 }) {
  this.assert(typeof input1 === "string", "on CssModuler.prototype.add: arguments[0] must be string");
  const id = this.moduler.fullpathOf(input1);
  if (id in this.sheets) {
    if (!(id in eventToAdd.oldSheets)) {
      eventToAdd.oldSheets = [];
    }
    eventToAdd.oldSheets[id].push(eventToAdd.count++);
  } else {
    const source = await this.moduler.readPath(id);
    const allRequires = source.match(this.constructor.symbols.REQUIRES_REGEX);
    const submoduler = this.moduler.cloneForFile(id);
    const requires = !allRequires ? [] : allRequires.map(match => {
      const subpath = match.substr("/*@requires:".length).trim().slice(0, -2).trim();
      return submoduler.fullpathOf(subpath);
    });
    const moduloCss = { id, source, requires };
    this.sheets[id] = moduloCss;
    eventToAdd.newSheets[id] = eventToAdd.count++;
    for (let index = 0; index < requires.length; index++) {
      const subid = requires[index];
      await this.add(subid, eventToAdd);
    }
  }
  return eventToAdd;
}