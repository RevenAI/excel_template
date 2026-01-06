import { loadEnvFile } from "node:process";
import http from "node:http";
import url from "node:url";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ================= REGISTRATION (CORRECT DOMAIN) =================
import { generateStudentRegistrationTemplate } from "./controllers/spreasheet/student-reg/generator.js";
import {
  fetchStudentRegistrationsFromDB,
} from "./controllers/spreasheet/student-reg/mock-api.js";

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
  // SERVE STATIC HTML (TEST UI)
  // ==================================================
  if (pathname === "/" || pathname === "/index.html") {
    const filePath = path.join(__dirname, "view", "reg.html");

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error loading page");
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
    return;
  }

  // ==================================================
  // DOWNLOAD STUDENT REGISTRATION EXCEL TEMPLATE
  // ==================================================
  if (pathname === "/download-student-reg-form" && req.method === "GET") {
    try {
      // Fetch prefilled registration data (MOCK API)
      const registrations = await fetchStudentRegistrationsFromDB();

      // Generate Excel template (editable by default)
      const buffer = await generateStudentRegistrationTemplate(
        registrations,
        false // readOnly = false (teachers can edit)
      );

      res.writeHead(200, {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          'attachment; filename="student_registration_template.xlsx"',
        "Content-Length": buffer.byteLength,
      });

      res.end(buffer);
    } catch (err) {
      console.error("Excel generation failed:", err);

      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Failed to generate student registration Excel template");
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
