Promise.fromObject = function (obj) {
  const allKeys = Object.keys(obj);
  return Promise.all(Object.values(Object.values(obj))).then(output => {
    let toObject = {};
    for (let index = 0; index < output.length; index++) {
      const item = output[index];
      toObject[allKeys[index]] = item;
    }
    return toObject;
  })
};