import { loadEnvFile } from "node:process";
import http, { IncomingMessage, ServerResponse } from "node:http";
import url from "node:url";
import fs from "fs/promises"
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serveHtml } from "./utils/http.js";
import { imageService } from "./controllers/image/image-service.js"

loadEnvFile("./src/.env");

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT) || 3501;

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const parsedUrl = url.parse(req.url || "", true);
  const pathname = parsedUrl.pathname || "/";

  // ---------------- Serve HTML Page ----------------
  if (pathname === "/" || pathname === "/index.html") {
    await serveHtml(res, path.join(__dirname, "view", "image-page.html"));
    return;
  }

  // ---------------- Upload Images ----------------
  if (pathname === "/upload-files" && req.method === "POST") {
    try {

      const { fields, images } = await imageService.uploadFromRequest(req, {
        tenant: 'nexalearn',
        category: 'passport',
        stableKey: 'abidemi_ademola'
      });

       console.log('the image and the fields:', {
        fields,
        images,
       })

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ fields, images }));
      return;
    } catch (err) {
      console.log('error from image upload:', err)
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: (err as Error).message }));
      return;
    }
  }

  // ---------------- Rename Image ----------------
  if (pathname === "/rename-image" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const { tenant, category, oldName, newName } = JSON.parse(body);
        const success = await imageService.renameImage(tenant, category, oldName, newName);
        res.writeHead(success ? 200 : 500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: (err as Error).message }));
      }
    });
    return;
  }

  // ---------------- Delete Image ----------------
  if (pathname === "/delete-image" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const { tenant, category, fileName } = JSON.parse(body);
        const success = await imageService.deleteImage(tenant, category, fileName);
        res.writeHead(success ? 200 : 500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success }));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: (err as Error).message }));
      }
    });
    return;
  }

  // ---------------- List Images ----------------
  if (pathname === "/list-images" && req.method === "GET") {
    const tenant = parsedUrl.query.tenant as string;
    const category = parsedUrl.query.category as string;

    try {
      const images = await imageService.listImages(tenant, category);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(images));
    } catch {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify([]));
    }
    return;
  }

  // ---------------- Serve uploaded images ----------------
  // This allows browser to fetch images at /uploads/tenant/category/filename
  if (pathname?.startsWith("/uploads/") && req.method === "GET") {
    const filePath = path.join(process.cwd(), pathname);
    try {
      const data = await fs.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      let contentType = "application/octet-stream";
      if (ext === ".webp") contentType = "image/webp";
      else if (ext === ".png") contentType = "image/png";
      else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("File not found");
    }
    return;
  }

  // ---------------- Default 404 ----------------
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
});

server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
