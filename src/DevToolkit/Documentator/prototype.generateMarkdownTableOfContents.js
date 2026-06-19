/**
 * @name DevToolkit.Documentator.prototype.generateMarkdownTableOfContents
 * @type class method
 * @parameter md:String - Código en markdown
 * @parameter autoinjectInto:String|false|undefined="{{ Table Of Contents }} - String donde se tiene que autoinyectar la tabla en el primer parámetro md:String.
 * @returns `Promise<String>` - El contenido inicial con la tabla de contenidos inyectada, de haberla, o el contenido de la tabla de contenidos directamente en su defecto.
 * @description Genera una tabla de contenidos y se autoinyecta en el documento inicial si puede, o la devuelve directamente si no.
 */
generateMarkdownTableOfContents(md, autoinjectInto = "{{ Table Of Contents }}") {
  let toc = "";
  for (const [, hashes, title] of md.matchAll(/^(#{1,6})\s+(.+)$/gm)) {
    toc += `\n${"   ".repeat(hashes.length-1)}- [${title}](#${
      title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') 
      .replace(/[^\w\s-]/g, '')        
      .replace(/\s+/g, '-')            
      .replace(/-+/g, '-')
    })`;
  }
  if(autoinjectInto && md.includes(autoinjectInto)) {
    toc = md.replace(autoinjectInto, toc);
  }
  return toc;
}