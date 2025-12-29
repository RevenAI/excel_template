

```js
const http = require("http");
const server = http.createServer((req, res) => { ... });
```

---

# 🧩 1️⃣ The `http` Module

The built-in **`http`** module is Node’s native HTTP server and client implementation.
It lets you:

* Create servers → `http.createServer()`
* Make requests → `http.request()` or `http.get()`

So:

```js
const http = require("http");
```

gives you an object with functions and classes like:

| Property / Method                          | Description                                              |
| ------------------------------------------ | -------------------------------------------------------- |
| `createServer([options], requestListener)` | Creates an HTTP server                                   |
| `request(options[, callback])`             | Make an HTTP request (client-side)                       |
| `get(options[, callback])`                 | Same as `request` but auto-calls `.end()`                |
| `Server`                                   | The constructor class for HTTP servers                   |
| `IncomingMessage`                          | The class for the `req` object                           |
| `ServerResponse`                           | The class for the `res` object                           |
| `globalAgent`                              | Used internally for managing keep-alive HTTP connections |

---

# 🏗️ 2️⃣ The Server Object

When you do:

```js
const server = http.createServer((req, res) => { ... });
```

you get back an instance of `http.Server` (which extends `net.Server`).

This `server` object has properties and methods you can use.

## ✅ Common Server Properties & Methods

| Property / Method                             | Description / Usage                                       |
| --------------------------------------------- | --------------------------------------------------------- |
| `server.listen(port, [hostname], [callback])` | Start the server listening                                |
| `server.close([callback])`                    | Stop the server                                           |
| `server.address()`                            | Get info about where it’s listening (port, address)       |
| `server.on(event, listener)`                  | Listen to events (`request`, `connection`, `close`, etc.) |
| `server.maxHeadersCount`                      | Limits number of headers allowed per request              |
| `server.keepAliveTimeout`                     | Time (ms) to keep connections alive                       |
| `server.headersTimeout`                       | Timeout before closing an idle socket                     |
| `server.timeout`                              | Default socket timeout in ms (e.g. 2 min)                 |

### 🧠 Common `server` Events:

| Event          | Fired When                                                  |
| -------------- | ----------------------------------------------------------- |
| `'request'`    | Every incoming request (same as callback in `createServer`) |
| `'connection'` | When a new TCP connection is made                           |
| `'close'`      | When server is closed                                       |
| `'error'`      | When an error occurs                                        |
| `'listening'`  | When server starts listening                                |

**Example:**

```js
server.on("listening", () => console.log("Server ready!"));
server.on("error", err => console.error(err));
```

---

# 📩 3️⃣ The `req` Object (IncomingMessage)

Inside your request handler `(req, res) => { ... }`,
`req` is an instance of **`http.IncomingMessage`**, representing the **incoming HTTP request**.

### Common Properties on `req`

| Property          | Example                           | Description                      |
| ----------------- | --------------------------------- | -------------------------------- |
| `req.url`         | `/about?name=ibrahim`             | Path and query string            |
| `req.method`      | `GET`, `POST`, `PUT`              | HTTP method                      |
| `req.headers`     | `{ host: 'localhost:3000', ... }` | All request headers              |
| `req.httpVersion` | `'1.1'`                           | HTTP version                     |
| `req.socket`      | TCP socket                        | Access low-level connection info |
| `req.rawHeaders`  | Array of header key-value pairs   | Raw header list                  |

### Common Methods

| Method                        | Use                                                |
| ----------------------------- | -------------------------------------------------- |
| `req.on('data', chunk => {})` | Collect body data (for POST/PUT)                   |
| `req.on('end', () => {})`     | Fired when all data is received                    |
| `req.pipe(stream)`            | Pipe the request body into another writable stream |

**Example (reading POST body):**

```js
let body = '';
req.on('data', chunk => body += chunk);
req.on('end', () => {
  console.log('Body:', body);
});
```

---

# 📤 4️⃣ The `res` Object (ServerResponse)

`res` is an instance of **`http.ServerResponse`** — it represents the **response you send back** to the client.

### Common Properties on `res`

| Property            | Example        | Description                            |
| ------------------- | -------------- | -------------------------------------- |
| `res.statusCode`    | `200`          | Set the HTTP status code               |
| `res.statusMessage` | `'OK'`         | Optional custom message                |
| `res.headersSent`   | `true / false` | Whether headers have already been sent |
| `res.writableEnded` | `true / false` | Whether response has ended             |

---

### Common Methods on `res`

| Method                                 | What it Does                                       |
| -------------------------------------- | -------------------------------------------------- |
| `res.writeHead(statusCode[, headers])` | Set status and headers at once                     |
| `res.setHeader(name, value)`           | Add/modify one response header                     |
| `res.getHeader(name)`                  | Retrieve a response header                         |
| `res.removeHeader(name)`               | Delete a header before sending                     |
| `res.write(data)`                      | Write data (can be multiple times)                 |
| `res.end([data])`                      | Finish response and send to client                 |
| `res.writeContinue()`                  | Send `100 Continue` interim response (rarely used) |
| `res.writeHead()`                      | Usually called once before writing body            |

**Example:**

```js
res.statusCode = 200;
res.setHeader("Content-Type", "application/json");
res.write(JSON.stringify({ message: "Hello!" }));
res.end();
```

Or shorthand:

```js
res.writeHead(200, { "Content-Type": "text/plain" });
res.end("Hello World");
```

---

# ⚡ 5️⃣ Full Example (Everything in Action)

```js
const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);

  if (req.url === "/json" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "This is JSON" }));
  } 
  else if (req.url === "/data" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      console.log("Received:", body);
      res.writeHead(201, { "Content-Type": "text/plain" });
      res.end("Data received!");
    });
  } 
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, () => console.log("Listening on port 3000"));
```

---

# 🧠 6️⃣ Summary Cheat Sheet

| Object   | Type                   | Key Props                                 | Key Methods                                          |
| -------- | ---------------------- | ----------------------------------------- | ---------------------------------------------------- |
| `http`   | Module                 | `.createServer()`, `.request()`, `.get()` | Used to build HTTP server or make requests           |
| `server` | `http.Server`          | `.listen()`, `.close()`, `.address()`     | `.on('request')`, `.on('error')`                     |
| `req`    | `http.IncomingMessage` | `.url`, `.method`, `.headers`, `.socket`  | `.on('data')`, `.on('end')`                          |
| `res`    | `http.ServerResponse`  | `.statusCode`, `.headersSent`             | `.writeHead()`, `.setHeader()`, `.write()`, `.end()` |

