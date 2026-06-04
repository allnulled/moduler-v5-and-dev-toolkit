static stringify(it) {
  try {
    return JSON.stringify(it);
  } catch (error) {
    return it;
  }
}