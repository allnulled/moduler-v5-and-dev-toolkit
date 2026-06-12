_extractCommentsFromString(text, file, root) {
  const allComments = [];
  let index = 0;
  const onelineIntroducer = "// @docs.";
  Iterating_text:
  while(index < text.length) {
    if(this._isMatchingAt(text, index, onelineIntroducer)) {
      const match = this._extractOnelineMatch(text, index);
      const subtype = (() => {
        const offset1 = index + onelineIntroducer.length;
        const spacePos = text.substr(offset1, match.length - offset1).indexOf(" ");
        if(spacePos === -1) {
          return match.replace(onelineIntroducer, "");
        }
        return text.substr(offset1, spacePos);
      })();
      if(!this._matchablePatterns.includes(subtype)) {
        console.warn(`Unknown documentation comment subtype «${subtype}»`);
        index++;
        continue Iterating_text;
      }
      allComments.push({
        match: match,
        subtype: subtype,
        size: match.length,
        from: index,
        to: index + match.length
      });
      index += match.length;
    } else if(this._isMatchingAt(text, index, "/**")) {
      const match = this._extractMultilineMatch(text, index);
      allComments.push({
        match: match,
        subtype: "multiline",
        size: match.length,
        from: index,
        to: index + match.length
      });
      index += match.length;
    } else {
      index++;
    }
  }
  return allComments;
}