exports.parseRequestParams = (url) => {
  return {0: url}
}
exports.parseRequestQuery = (url) => {
  return {}
}
exports.errorResponder = (statusCode) => {
  return function (req, res) {
    res.status(statusCode);
    res.send("internal error");
  };
};
exports.createProperty = (targetObject, propertyName, getter) => {
  Object.defineProperty(targetObject, propertyName, {
    get: getter,
    configurable: true,
    enumerable: true,
  });
};

exports.queryParse = (url) => {
  if (!url) return;
  let map = {};
  let queryString = url.split("?")[1];
  if (!queryString) return;
  let queryParams = queryString.split("&");
  queryParams.forEach((queryParam) => {
    let [key, value] = queryParam.split("=");
    if (value.toLowerCase() in ["true", "false"]) {
      map[key] = Boolean(value);
      return;
    }
    map[key] = value;
  });
  return map;
};