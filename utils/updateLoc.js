exports.editValue = (data, key, status) => {
  return data.map((item) => {
    var temp = Object.assign({}, item);
    if (temp.key === key) {
      temp.newLoc = status;
    }
    return temp;
  });
};
