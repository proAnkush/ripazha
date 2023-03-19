const Middleware = require("./Middleware");
const Request = require("./Request");
const Response = require("./Response");
const path = require("path");

const middlewares = [];
function Middlewares(basePath) {
  this.basePath = basePath;
}
module.exports = Middlewares;


Middlewares.prototype.updateBasePath = function (newBasePath) {
  this.basePath = newBasePath;
};

Middlewares.prototype.executeAll = async function executeAll(req, res) {
  const tempStack = [
    ...middlewares,
    ...this.getRequestMiddlewares(req),
    this.requestHandler,
  ]; // copy middlewares, so as to not import app level middlewares on subsequent requests
  await execute(tempStack, req, res);
};

Middlewares.prototype.addAppLevelMiddleware = function addAppLevelMiddleware(
  fn
) {
  const middleware = new Middleware(fn);
  middlewares.push(middleware);
  return true;
};
/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 * @param {*} err
 */
Middlewares.prototype.getRequestMiddlewares = function getRequestMiddlewares(
  req
) {
  const dir = req.path; // will need to create req.path which takes into account dir offsset and url offset
  const method = req.method;
  const requestMiddlewares =
    require(path.join(this.basePath, dir))[
      method.toLowerCase() + "Middlewares"
    ] || [];
  /** @type {Array} */
  return requestMiddlewares.map((item) => {
    return new Middleware(item);
  });
};

/**
 *
 * @param {Array<Middleware>} arr
 * @param {*} req
 * @param {*} res
 */
async function execute(arr, req, res) {
  next();
  /** @param {Error} err */
  function next(err) {
    if (err) {
      throw err;
    }
    setImmediate(() => {
      let fn = arr.shift();
      if (!fn) return;
      fn.handle(req, res, next);
    });
  }
}

Middlewares.prototype.registerTerminal = function registerTerminal(fn) {
  this.requestHandler = new Middleware(fn);
  return true;
};
