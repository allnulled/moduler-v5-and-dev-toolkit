_extractMultilineMatch(text, position, patterns) {
  let index = position + 3; // saltamos "/**"
  while (
    index < text.length &&
    !this._isMatchingAt(text, index, "*/")
  ) {
    index++;
  }
  if (index >= text.length) {
    throw new Error("Unclosed multiline comment");
  }
  return text.slice(position, index + 2);
}