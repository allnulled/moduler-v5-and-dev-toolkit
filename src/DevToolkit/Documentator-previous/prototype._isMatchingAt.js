_isMatchingAt(text, position, pattern) {
  const size = pattern.length;
  if (position + size > text.length) {
    return false;
  }
  for (let index = 0; index < size; index++) {
    if (text.charCodeAt(position + index) !== pattern.charCodeAt(index)) {
      return false;
    }
  }
  return true;
}