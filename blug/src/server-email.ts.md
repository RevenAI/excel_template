import { loadEnvFile } from "node:process";
import http from "node:http";
import url from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { serveHtml } from "./utils/http.js";
import reportCardService from "./controllers/pdf/report-card/report-card.service.js";

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

  // ==================================================
  // SERVE REPORT CARD HTML (PREVIEW / DESIGN TEST)
  // ==================================================
  if (pathname === "/" || pathname === "/index.html") {
    serveHtml(res, path.join(__dirname, "view", "report", "r1.html"));
    return;
  }

  // ==================================================
  // DOWNLOAD REPORT CARD (PDF)
  // ==================================================
  const pdfPath = "src/controllers/student-idcard/student_id_card.pdf";
  if (pathname === "/download-report-card" && req.method === "GET") {

    const data = await reportCardService.getDummyReportCardData()
    try {
      
      
      const pdfBuffer =
        await reportCardService.generateReportCard(data, pdfPath);

      // Always release Puppeteer resources
      await reportCardService.close();

      res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'attachment; filename="student-report-card.pdf"',
        "Content-Length": pdfBuffer.byteLength,
      });

      res.end(pdfBuffer);
    } catch (err) {
      console.error("Report card generation failed:", err);

      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Failed to generate report card");
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
