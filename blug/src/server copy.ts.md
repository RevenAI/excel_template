import { loadEnvFile } from "node:process";
import http from "node:http";
import url from "node:url";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateStudentRecordsExcel } from "./controllers/spreasheet/sstudent-record/build-student-sheet.js"; 
import { fetchStudentsFromDB } from "./controllers/spreasheet/sstudent-record/record.js";
import { IStudentRecord } from "./controllers/spreasheet/sstudent-record/build-student-sheet.js";

loadEnvFile("./src/.env");

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT) || 3501;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url || "", true);
  const pathname = parsedUrl.pathname || "/";

  // Serve HTML page
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
    return; //important!
  }

  // Excel download route
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

  // Default response
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
});

server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});


