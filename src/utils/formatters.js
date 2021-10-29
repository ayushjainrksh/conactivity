const removeQueryParamsFromUrl = (url) => {
  return url.split("?")[0];
};

module.exports = {
  removeQueryParamsFromUrl,
};
