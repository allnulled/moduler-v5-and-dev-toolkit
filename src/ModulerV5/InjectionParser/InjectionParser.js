class InjectionParser {
  static TOKENS = [
    "/* @inject.source(",
    "/* @inject.source.string(",
    "/* @inject.template(",
    "/* @inject.template.string(",
    "/* @inject.module(",
    "// @inject.source(",
    "// @inject.source.string(",
    "// @inject.template(",
    "// @inject.template.string(",
    "// @inject.module(",
    "inject.source(",
    "inject.source.string(",
    "inject.template(",
    "inject.template.string(",
    "inject.module(",
  ];
  static create(code) {
    return new this(code);
  }
  constructor(code) {
    this.code = code;
    this.i = 0;
  }
  parse() {
    const results = [];
    this.i = 0;
    while (!this.eof()) {
      const tokenInfo = this.findNextToken();
      if (!tokenInfo) {
        break;
      }
      const {
        token,
        start
      } = tokenInfo;
      this.i = start + token.length;
      const tokenStart = start;
      this.skipSpaces();
      const path = this.parseString();
      this.skipSpaces();
      let options = null;
      if (this.peek() === ",") {
        this.next();
        this.skipSpaces();
        options = this.parseBalanced();
      }
      this.skipSpaces();
      if (this.peek() === ")") {
        this.next();
      }
      // cerrar comentario multilinea
      this.skipSpaces();
      if (
        token.startsWith("/*") &&
        this.code.slice(this.i, this.i + 2) === "*/"
      ) {
        this.i += 2;
        Linter_bypassers: {
          if (this.code.slice(this.i, this.i + 1) === "0") {
            this.i += 1;
          }
          if (this.code.slice(this.i, this.i + 1) === "nulo") {
            this.i += 4;
          }
        }
      }
      const tokenEnd = this.i;
      const raw = this.code.slice(tokenStart, tokenEnd);
      const cleanStart = raw.replace(/^((\/\/)|(\/\*))( )*(\@)?/g, "");
      results.push({
        path,
        options,
        method: cleanStart.substr(0, cleanStart.indexOf("(")),
        start: tokenStart,
        end: tokenEnd,
        raw: raw,
      });
    }
    return results;
  }
  // =====================================================
  // TOKEN SEARCH
  // =====================================================
  findNextToken() {
    let bestIndex = Infinity;
    let bestToken = null;
    for (const token of this.constructor.TOKENS) {
      const idx = this.code.indexOf(token, this.i);
      if (idx !== -1 && idx < bestIndex) {
        bestIndex = idx;
        bestToken = token;
      }
    }
    if (bestToken === null) {
      return null;
    }
    return {
      token: bestToken,
      start: bestIndex
    };
  }
  // =====================================================
  // CORE
  // =====================================================
  eof() {
    return this.i >= this.code.length;
  }
  peek(offset = 0) {
    return this.code[this.i + offset];
  }
  next() {
    return this.code[this.i++];
  }
  skipSpaces() {
    while (
      !this.eof() &&
      /\s/.test(this.peek())
    ) {
      this.i++;
    }
  }
  // =====================================================
  // STRING
  // =====================================================
  parseString() {
    const quote = this.peek();
    if (
      quote !== '"' &&
      quote !== "'" &&
      quote !== "`"
    ) {
      throw new Error(`Expected string at ${this.i}`);
    }
    this.next();
    let result = "";
    while (!this.eof()) {
      const c = this.next();
      // escape
      if (c === "\\") {
        result += c;
        if (!this.eof()) {
          result += this.next();
        }
        continue;
      }
      // close
      if (c === quote) {
        return result;
      }
      result += c;
    }
    throw new Error("Unexpected EOF while parsing string");
  }
  // =====================================================
  // BALANCED
  // =====================================================
  parseBalanced() {
    const start = this.peek();
    if (!"([{".includes(start)) {
      throw new Error(`Expected balanced structure at ${this.i}`);
    }
    const stack = [start];
    let result = this.next();
    while (!this.eof()) {
      const c = this.next();
      result += c;
      // ==========================================
      // STRING MODE
      // ==========================================
      if (
        c === '"' ||
        c === "'" ||
        c === "`"
      ) {
        result += this.consumeString(c);
        continue;
      }
      // ==========================================
      // OPEN
      // ==========================================
      if (
        c === "(" ||
        c === "[" ||
        c === "{"
      ) {
        stack.push(c);
        continue;
      }
      // ==========================================
      // CLOSE
      // ==========================================
      if (
        c === ")" ||
        c === "]" ||
        c === "}"
      ) {
        const last =
          stack[stack.length - 1];
        if (!this.matches(last, c)) {
          throw new Error(`Unexpected closing token "${c}" at ${this.i}`);
        }
        stack.pop();
        if (stack.length === 0) {
          return result;
        }
      }
    }
    throw new Error("Unexpected EOF while parsing balanced structure");
  }
  consumeString(quote) {
    let result = "";
    while (!this.eof()) {
      const c = this.next();
      result += c;
      if (c === "\\") {
        if (!this.eof()) {
          result += this.next();
        }
        continue;
      }
      if (c === quote) {
        return result;
      }
    }
    throw new Error("Unexpected EOF inside string");
  }
  matches(open, close) {
    return (
      (open === "(" && close === ")") ||
      (open === "[" && close === "]") || (open === "{" && close === "}"));
  }
}