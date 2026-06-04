static evalAsync(source, injection = {}) {
  return (new (async function() {}.constructor)(...Object.keys(injection), source))(...Object.values(injection));
}