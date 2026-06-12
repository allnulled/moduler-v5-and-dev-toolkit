_extractOnelineMatch(text, position, patterns) {
  let index = position;
  while (
    index < text.length &&
    text.charCodeAt(index) !== 10 && // \n
    text.charCodeAt(index) !== 13    // \r
  ) {
    index++;
  }
  return text.slice(position, index);
}