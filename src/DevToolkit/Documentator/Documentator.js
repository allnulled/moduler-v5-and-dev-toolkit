class Documentator {
  constructor(toolkit) {
    this.trace = Tracer.createTracer("DevToolkit.Events", "constructor");
    this.toolkit = toolkit;
  }
  static symbols = {
    REGEX_JAVADOC_COMMENT: new RegExp(""
      + "(\\/\\*\\*)(\\n)"
      + "("
      + "((?!(\\t| )*\\*\\/).)*"
      + "(\\n)"
      + ")*"
      + "((\\t| )*\\*\\/)"
      , "g"
    ),
    REGEX_JAVADOC_LINE_START: new RegExp("^(\\t| )*\\*(\\t| )*", "g"),
    REGEX_JAVADOC_NEXT_LINES_START: new RegExp("(\n)(\\t| )*\\*(\\t| )*", "g"),
    REGEX_JAVADOC_BLOCK_START: new RegExp("^(\\/\\*\\*)(\\n)", "g"),
    REGEX_JAVADOC_BLOCK_END: new RegExp("((\\t| )*\\*\\/)$", "g"),
    REGEX_JAVADOC_TAG: new RegExp("^(\@((?! |\\:).)+)", "g"),
  }
  _findFiles(globPattern = "**/*.js", options = {}) {
    return require("glob").glob(globPattern, {
      // 1. Changeable options:
      cwd: this.toolkit.basedir,
      // 2. User options:
      ...options,
      // 3. Fixed options:
      absolute: true,
      ignore: [
        "node_modules",
        ...(typeof options.ignore === "undefined" ? [] : options.ignore),
      ],
    });
  }
  async extractJavadocCommentsFromDirectory(dir = this.toolkit.basedir) {
    this.trace("extractJavadocCommentsFromDirectory", arguments);
    const inputFiles = await this._findFiles(require("path").resolve(dir, "**/*.js"));
    const allJavadocComments = {};
    for(let index=0; index<inputFiles.length; index++) {
      const file = inputFiles[index];
      const content = await require("fs").promises.readFile(file, "utf8");
      const comments = this.extractJavadocCommentsFromString(content);
      if(comments.length) {
        allJavadocComments[file] = comments;
      }
    }
    return allJavadocComments;
  }
  extractJavadocCommentsFromString(text) {
    const matches = text.match(this.constructor.symbols.REGEX_JAVADOC_COMMENT);
    if(!matches) return [];
    const javadocComments = [];
    for(let index=0; index<matches.length; index++) {
      const matchedComment = matches[index];
      let matchedContent = matchedComment;
      Eliminar_los_asteriscos_necesarios_y_espacios_implicados: {
        matchedContent = matchedContent.replace(this.constructor.symbols.REGEX_JAVADOC_BLOCK_START, "");
        matchedContent = matchedContent.replace(this.constructor.symbols.REGEX_JAVADOC_BLOCK_END, "");
        matchedContent = matchedContent.replace(this.constructor.symbols.REGEX_JAVADOC_LINE_START, "");
        matchedContent = matchedContent.replace(this.constructor.symbols.REGEX_JAVADOC_NEXT_LINES_START, "\n");
      }
      const javadocComment = {"<notag>":[]};
      const matchedLines = matchedContent.split("\n");
      let currentTag = "<notag>";
      Rejuntar_por_lineas:
      for(let index=0; index<matchedLines.length; index++) {
        let matchedLine = matchedLines[index];
        let isNewTag = false;
        if(matchedLine.startsWith("@")) {
          isNewTag = true;
          matchedLine = matchedLine.replace(this.constructor.symbols.REGEX_JAVADOC_TAG, match => {
            currentTag = match;
            return "";
          }).trimLeft();
        }
        if(!(currentTag in javadocComment)) {
          javadocComment[currentTag] = [];
        }
        if(isNewTag) {
          javadocComment[currentTag].push(matchedLine);
        } else {
          javadocComment[currentTag][javadocComment[currentTag].length-1] += "\n" + matchedLine;
        }
      }
      if(!javadocComment["<notag>"].length) {
        delete javadocComment["<notag>"];
      }
      javadocComments.push(javadocComment);
    }
    return javadocComments;
  }
}