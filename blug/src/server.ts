import http from "node:http";
import url from "node:url";
import emailTemplateService from "./controllers/pdf/report-card/email-template.service.js"; 
import { loadEnvFile } from "node:process";

loadEnvFile();

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT) || 3501;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url || "", true);
  const pathname = parsedUrl.pathname || "/";

  // =========================================
  // EMAIL PREVIEW ROUTE
  // =========================================
  if (pathname === "/" && req.method === "GET") {
    try {
      const dummyData = await emailTemplateService.getDummyEmailData();
      const html = await emailTemplateService.renderPreview(dummyData);

      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
      });

      res.end(html);
    } catch (err) {
      console.error("Email preview failed:", err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Failed to render email preview");
    }
    return;
  }

  // =========================================
  // NOT FOUND
  // =========================================
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Route not found");
});

server.listen(PORT, HOST, () => {
  console.log(`Email preview running at http://${HOST}:${PORT}`);
});
