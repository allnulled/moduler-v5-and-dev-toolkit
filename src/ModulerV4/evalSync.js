static evalSync(file, injection = {}) {
  return (new (function() {}.constructor)(...Object.keys(injection), source))(...Object.values(injection));
}