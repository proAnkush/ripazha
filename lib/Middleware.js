const http = require("http");

function Middleware(fn) {
  if (typeof fn === "function") {
    this.middleware = fn;
  }
}

Middleware.prototype.handle = function executeMiddleware(req, res, next) {
  try {
    this.middleware(req, res, next);
  } catch (error) {
    next(error);
  }
};

Middleware.prototype.handle_error = function errorMiddleware(
  req,
  res,
  next,
  error
) {
  next(error);
};

module.exports = Middleware;

