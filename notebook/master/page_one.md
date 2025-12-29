

## 🧠 1. The Core Idea

Node.js gives you access to built-in modules that let you:

* Create a web server (`http`)
* Read/write files (`fs`)
* Parse URLs (`url`)
* Work with file paths (`path`)
* Emit/listen for events (`events`)
* Use streams and buffers for I/O (`stream`, `buffer`)

Everything Express or Nest does is ultimately built on these.

---

## ⚙️ 2. Create a Basic HTTP Server

```js
// server.js
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from Node core!\n");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
```

Run:

```bash
node server.js
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🧩 3. Routing (Manual)

No `express.Router()`, just a few `if` or `switch` statements:

```js
const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;

  if (path === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Home Page</h1>");
  } else if (path === "/about") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>About Page</h1>");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(3000, () => console.log("Listening on port 3000"));
```

---

## 📄 4. Serving Static Files

```js
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, "public", req.url === "/" ? "index.html" : req.url);
  const ext = path.extname(filePath);
  const contentType = ext === ".html" ? "text/html" : "text/plain";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("File not found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

server.listen(3000, () => console.log("Server running on http://localhost:3000"));
```

---

## 🔄 5. Handling JSON / POST Requests

```js
const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/data") {
    let body = "";
    req.on("data", chunk => (body += chunk.toString()));
    req.on("end", () => {
      const data = JSON.parse(body);
      console.log("Received:", data);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, received: data }));
    });
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Send a POST request to /data");
  }
});

server.listen(3000);
```

---

## ⚡ 6. File System CRUD (API Example)

A simple API to save and read a JSON file:

```js
const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  if (req.url === "/save" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => (body += chunk.toString()));
    req.on("end", () => {
      fs.writeFileSync("data.json", body);
      res.writeHead(201);
      res.end("Data saved!");
    });
  } else if (req.url === "/read" && req.method === "GET") {
    const data = fs.readFileSync("data.json", "utf8");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(3000, () => console.log("API running on port 3000"));
```

---

## 🧠 7. Extras You Should Revise

| Concept                               | Core Module                                          |
| ------------------------------------- | ---------------------------------------------------- |
| Environment variables                 | `process.env`                                        |
| Event-driven architecture             | `events`                                             |
| File paths & directories              | `path`, `fs`                                         |
| Streams (reading/writing large files) | `stream`, `fs.createReadStream()`                    |
| Async patterns                        | callbacks → Promises → async/await                   |
| Error handling                        | try/catch, `uncaughtException`, `process.on('exit')` |

---

## 🧰 8. Small Utilities to Know

* `crypto` → hashing passwords, tokens
* `os` → system info
* `child_process` → running CLI commands
* `cluster` → multi-core load balancing

---

## ✅ 9. Practice Ideas

1. Build a tiny REST API using only `http` and `fs`.
2. Serve a small frontend (HTML, CSS, JS) using static file logic.
3. Implement a simple router class (like a mini-Express).
4. Add logging, environment config, and error handling.

