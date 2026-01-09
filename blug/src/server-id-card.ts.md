import { loadEnvFile } from "node:process";
import http, { IncomingMessage, ServerResponse } from "node:http";
import url from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateStudentIDCard } from "./controllers/pdf/pdf.tool.js";
import fs from "node:fs"

// --------------------------------------------------
loadEnvFile("./src/.env");

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT) || 3501;

function serveHtml(res: ServerResponse, filePath: string) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error loading page");
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    });

    res.end(data);
  });
}


// --------------------------------------------------
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url || "", true);
  const pathname = parsedUrl.pathname || "/";

  // ==================================================
  // SERVE STATIC HTML (TEST UI)
  // ==================================================
if (pathname === "/" || pathname === "/index.html") {
  serveHtml(res, path.join(__dirname, "view", "student-idcard.html"));
  return;
}
if (pathname === "/" || pathname === "/bus1.html") {
  serveHtml(res, path.join(__dirname, "view", "business/bus1.html"));
  return;
}
if (pathname === "/" || pathname === "/bus2.html") {
  serveHtml(res, path.join(__dirname, "view", "business/bus2.html"));
  return;
}


  // ==================================================
// DOWNLOAD STUDENT ID CARD (PDF)
// ==================================================
if (pathname === "/download-student-id-card" && req.method === "GET") {
  try {
    const { pdfBuffer, idCardService } = await generateStudentIDCard();

    // Always close Puppeteer resources
    await idCardService.close();

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="student-id-card.pdf"',
      "Content-Length": pdfBuffer.byteLength,
    });

    res.end(pdfBuffer);
  } catch (err) {
    console.error("ID card generation failed:", err);

    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Failed to generate student ID card");
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
