const http = require("http");
const path = require("path");
const mixin = require("merge-descriptors");
const UTILITY = require("./utility");
const Middleware = require("./Middleware");
const Middlewares = require("./Middlewares");
const Request = require("./Request");

class App {
  server;
  #urlOffset = 0;
  #baseDir = path.join(__dirname, "..", "..", "..");
  // #baseDir = path.join(__dirname, "..");
  #middlewares;
  constructor(PORT, cb) {
    // create http server
    this.#middlewares = new Middlewares(this.#baseDir);
    this.server = http.createServer(async (req, res) => {
      // decorate request and response objects
      const { feedableRequest, feedableResponse } =
        this.#feedableRequestResponseFactory(req, res);
      const requestHandler = await this.#findHandler(
        feedableRequest.path,
        feedableRequest.method
      );
      this.#middlewares.registerTerminal(requestHandler);
      this.#middlewares.executeAll(feedableRequest, feedableResponse);
    });

    this.server.listen(PORT, cb);
    // cb()
  }
  setUrlOffset(offset) {
    this.#urlOffset = offset;
    Request.setOffset(offset);
  }
  getUrlOffset() {
    return this.#urlOffset;
  }

  /**
   *
   * @param {import("fs").PathLike} path
   */
  setApiBaseDir(dir) {
    if (path.isAbsolute(dir)) {
      this.#baseDir = path.resolve(dir);
      this.#middlewares.updateBasePath(path.resolve(dir));
      return;
    }
    this.#middlewares.updateBasePath(
      path.join(__dirname, "..", "..", "..", dir)
    );
    this.#baseDir = path.join(__dirname, "..", "..", "..", dir);
  }

  /**
   * find request handler function
   * @param {String} url
   * @param {String} method
   * @returns {Function}
   */
  #findHandler(url, method) {
    try {
      const handlerFile = require(path.join(this.#baseDir, url));
      const handlerFunction = handlerFile[method.toLowerCase()];
      if (!handlerFunction) {
        throw new Error(
          `'${method.toUpperCase()}' is not a valid http method for '${url}'`
        );
      }
      return handlerFunction;
    } catch (error) {
      console.error(error.message);
    }
    return UTILITY.errorResponder(400);
  }

  registerAppMiddleware(fn) {
    if (typeof fn === "function") {
      this.#middlewares.addAppLevelMiddleware(fn);
      return true;
    }
    console.warn(
      "argument to registerAppMiddleware should be of type function"
    );
    return false;
  }

  /**
   *
   * @param {http.IncomingMessage} httpRequest
   * @param {http.ServerResponse} httpResponse
   * @returns {{feedableRequest: Request, feedableResponse: Response}}
   */
  #feedableRequestResponseFactory(httpRequest, httpResponse) {
    // acquire custom prototype
    const Request = require("./Request");
    const Response = require("./Response");
    // apply custom prototypes
    httpRequest = mixin(httpRequest, Request, false);
    httpRequest.query = UTILITY.queryParse(httpRequest.url);
    httpResponse = mixin(httpResponse, Response, false);
    httpRequest.response = httpResponse;
    httpResponse.request = httpRequest;
    return { feedableRequest: httpRequest, feedableResponse: httpResponse };
  }
}

// export custom prototypes
exports.Request = this.Request;
exports.Response = this.Response;

module.exports = App;
