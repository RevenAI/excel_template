import { loadEnvFile } from "node:process";
import http from "node:http";
import url from "node:url";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateStudentRecordsExcel } from "./controllers/spreasheet/sstudent-record/build-student-sheet.js";
import { fetchStudentsFromDB, fetchStudentFromDB, saveStudentGrades } from "./controllers/spreasheet/sstudent-record/record.js";
import { IStudentRecord } from "./controllers/spreasheet/sstudent-record/build-student-sheet.js";

loadEnvFile("./src/.env");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT) || 3501;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url || "", true);
  const pathname = parsedUrl.pathname || "/";

  // --------------------------
  // 1. Serve old index/download page
  // --------------------------
  if (pathname === "/" || pathname === "/index.html") {
    const filePath = path.join(__dirname, "view", "download.html");
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

  // --------------------------
  // 2. Excel download route
  // --------------------------
  if (pathname === "/download-student-records" && req.method === "GET") {
    try {
      const students: IStudentRecord[] = await fetchStudentsFromDB();
      const buffer = await generateStudentRecordsExcel(students);

      res.writeHead(200, {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="student_records.xlsx"`,
        "Content-Length": buffer.byteLength,
      });
      res.end(buffer);
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Failed to generate student records Excel");
    }
    return;
  }

  // --------------------------
  // 3. Serve Univer HTML editor
  // --------------------------
 // if (pathname.startsWith("/grade-editor")) {
  if (pathname.startsWith("/grade-editor")) {
    try {
      const parts = pathname.split("/");
      const studentId = parts[2];

      if (!studentId) throw new Error("Student ID missing");

      const student = await fetchStudentFromDB(studentId);

      const filePath = path.join(__dirname, "view", "sheet.html");
      console.log('[<<DEBUGGING ROUTE>>>]', filePath)
      let html = fs.readFileSync(filePath, "utf8");

      // Inject student JSON
      html = html.replace(
        "</body>",
        `<script>window.__STUDENT_RECORD__ = ${JSON.stringify(student)};</script></body>`
      );

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Failed to load grade editor");
    }
    return;
  }

  // --------------------------
  // 4. Serve static Univer assets
  // --------------------------
  if (pathname.startsWith("/univer/")) {
    const filePath = path.join(__dirname, "public", pathname);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("File not found");
        return;
      }

      let contentType = "application/javascript";
      if (filePath.endsWith(".css")) contentType = "text/css";
      if (filePath.endsWith(".js")) contentType = "application/javascript";

      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    });
    return;
  }

  // --------------------------
  // 5. GET student JSON API (optional)
  // --------------------------
  if (pathname.startsWith("/api/student/") && req.method === "GET") {
    const studentId = pathname.split("/")[3];
    if (!studentId) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Student ID required" }));
      return;
    }
    try {
      const student = await fetchStudentFromDB(studentId);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(student));
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Failed to fetch student" }));
    }
    return;
  }

  // --------------------------
  // 6. POST save edited grades
  // --------------------------
  if (pathname === "/api/save-grades" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        await saveStudentGrades(data); // Implement in your controller
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Grades saved" }));
      } catch (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Failed to save grades" }));
      }
    });
    return;
  }

  // --------------------------
  // 7. Default 404
  // --------------------------
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
});

server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
