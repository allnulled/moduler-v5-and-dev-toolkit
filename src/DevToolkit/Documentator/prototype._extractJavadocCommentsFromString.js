_extractJavadocCommentsFromString(text) {
  this.trace("_extractJavadocCommentsFromString", arguments);
  const matches = text.match(this.constructor.symbols.REGEX_JAVADOC_COMMENT);
  if (!matches) return [];
  const javadocComments = [];
  for (let index = 0; index < matches.length; index++) {
    const matchedComment = matches[index];
    let matchedContent = matchedComment;
    Eliminar_los_asteriscos_necesarios_y_espacios_implicados: {
      matchedContent = matchedContent.replace(this.constructor.symbols.REGEX_JAVADOC_BLOCK_START, "");
      matchedContent = matchedContent.replace(this.constructor.symbols.REGEX_JAVADOC_BLOCK_END, "");
      matchedContent = matchedContent.replace(this.constructor.symbols.REGEX_JAVADOC_LINE_START, "");
      matchedContent = matchedContent.replace(this.constructor.symbols.REGEX_JAVADOC_NEXT_LINES_START, "\n");
    }
    const javadocComment = { "<notag>": [] };
    const matchedLines = matchedContent.split("\n");
    let currentTag = "<notag>";
    Rejuntar_por_lineas:
    for (let index = 0; index < matchedLines.length; index++) {
      let matchedLine = matchedLines[index];
      let isNewTag = false;
      if (matchedLine.startsWith("@")) {
        isNewTag = true;
        matchedLine = matchedLine.replace(this.constructor.symbols.REGEX_JAVADOC_TAG, match => {
          currentTag = match;
          return "";
        }).trimLeft();
      }
      if (!(currentTag in javadocComment)) {
        javadocComment[currentTag] = [];
      }
      if (isNewTag) {
        javadocComment[currentTag].push(matchedLine);
      } else {
        javadocComment[currentTag][javadocComment[currentTag].length - 1] += "\n" + matchedLine;
      }
    }
    if (!javadocComment["<notag>"].length) {
      delete javadocComment["<notag>"];
    }
    javadocComments.push(javadocComment);
  }
  return javadocComments;
}