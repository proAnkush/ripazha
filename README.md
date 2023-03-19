# ripazha
A file based routing framework for creating javascript backends.
* **File Based**: ripazha doesn't have explicit api routes, rather the request handler to be loaded is inferred automatically by ripazha based on request's path and request's http verb.

* **HTTP based**: Based on the javascript's default [http module](https://nodejs.org/api/http.html#:~:text=http.setMaxIdleHTTPParsers(max)-,HTTP,-%23).

## Installation
> npm install ripazha

## Usage
1. In your project directory create an `index.js` file, with following content:
```js
const ripazha = require("ripazha");
const PORT = 3000;

const app = new openpress(PORT, () => {
  console.log("server running on PORT ", PORT);
});
```
2. Create a folder at the same location as index.js, say `/users`
3. Create a file called `user.js` in `/users`
4. From  `user.js` export a function called `get`, such as:
```js
exports.get = (req, res) => {
  res.send("Hello, from ripazha!")
}
```
5. Your api is ready. Start your `ripazha` app with *`node index.js`* and send a `GET` request to `/users/user`  .