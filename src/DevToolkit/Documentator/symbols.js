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