const http = require("http");
const send = require("send")

var Response = Object.create(http.ServerResponse.prototype);

Response.json = function (data) {
  this.set("content-type", "application/json");
  this.write(JSON.stringify(data));
  this.end();
};

Response.send = function (data) {
  if (typeof data === "object") {
    this.json(data);
    return;
  }
  if (typeof data === "number") {
    this.status(data);
    return; 
  }
  this.write(data);
  this.end();
};

Response.status = function (statusCode) {
  this.statusCode = statusCode;
  return this;
};

Response.get = function (key) {
  return this.getHeader(key);
};

Response.set = Response.header = function header(key, value) {
  this.setHeader(key.toLowerCase(), value);
  return this;
};

Response.redirect = function (url, statusCode = 301) {
  this.status(statusCode);
  this.set("location", url);
  this.end();
};

Response.sendFile = function (filePath) {
  const p = send(this.request, encodeURI(filePath), {});
  p.pipe(this);
};

module.exports = Response;