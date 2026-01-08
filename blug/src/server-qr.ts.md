import { loadEnvFile } from "node:process";
import http from "node:http";
import url from "node:url";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { testQR, StudentQrData } from "./controllers/qr/test.js" 

// --------------------------------------------------
loadEnvFile("./src/.env");

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT) || 3501;

// --------------------------------------------------
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url || "", true);
  const pathname = parsedUrl.pathname || "/";
  const query = url.parse(req.url || "", true).query;

  // ==================================================
  // SERVE STATIC HTML (TEST UI)
  // ==================================================
  if (pathname === "/" || pathname === "/index.html") {
    try {
      const filePath = path.join(__dirname, "view", "qr.html");
      let html = await fs.promises.readFile(filePath, "utf-8");

      // Check for query params
      const student: StudentQrData = {
        _id: query._id as string || "stu123",
        email: query.email as string || "test@example.com",
      };

      const { qrDataUrl } = await testQR(student);

      // Inject QR and data into HTML
      html = html.replace("{{QR_IMAGE}}", qrDataUrl);
      html = html.replace("{{STUDENT_ID}}", student._id);
      html = html.replace("{{STUDENT_EMAIL}}", student.email);

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    } catch (err) {
      console.error("QR Page Error:", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error loading page");
    }
    return;
  }

  // ==================================================
  // NOT FOUND
  // ==================================================
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
});

// --------------------------------------------------
server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
