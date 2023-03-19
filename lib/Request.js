const http = require("http");
const path = require("path");
const createProperty = require("./utility").createProperty;
var Request = Object.create(http.IncomingMessage.prototype);

Request.param = function () {
  return { 0: this.url };
};
Request.setOffset  = function (offset) {
  this.offset = offset;
};
Request.getQuery = function () {
  return this.query
};
Request.getBody = function () {
  return this.body;
};
Request.getPath = function () {
  const p = this.url.substring(1).split('?')[0];
  return p.split('/').slice(this.offset).join("/")
};

createProperty(Request, "params", Request.param);
createProperty(Request, "path", Request.getPath);

module.exports = Request;

