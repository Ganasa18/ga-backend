exports.onlySpaces = (str) => {
  return str.trim().length === 0;
};
exports.ltrim = (str) => {
  if (!str) return str;
  return str.replace(/^\s+/g, "");
};

exports.multipleSpace = (str) => {
  return str.replace(/\s+/g, " ").trim();
};
