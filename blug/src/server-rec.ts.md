import { loadEnvFile } from "node:process";
import http from "node:http";
import url from "node:url";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateStudentRecordsExcel } from "./controllers/spreasheet/sstudent-record/build-student-sheet.js"; 
import { fetchStudentsFromDB } from "./controllers/spreasheet/sstudent-record/record.js";
import { IStudentRecord } from "./controllers/spreasheet/sstudent-record/build-student-sheet.js";
import { parseStudentExcelFile } from "./controllers/spreasheet/sstudent-record/parse-record.js";
import { parseMultipartForm, UploadedFile } from "./utils/form-data-parser.js";

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


// ---------------- Upload Student Records ----------------
if (pathname === "/upload-files" && req.method === "POST") {
  try {

    // Step 1: Parse multipart/form-data (Busboy MUST be first consumer)
    const { fields, files } = await parseMultipartForm(req, {
      fileSizeLimit: 5 * 1024 * 1024, // 5MB per file
      filesLimit: 5,
      fieldsLimit: 20,
    });

    console.log("[BUSBOY DATA] FORM DATA", { fields, files });

    //FIX: frontend uses `formData.append("file", file)`
    const uploadedFiles: UploadedFile[] | undefined = files["file"];

    if (!uploadedFiles || uploadedFiles.length === 0) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "No file uploaded under 'file'" }));
      return;
    }

    const excelFile = uploadedFiles[0];

    // Step 3: Read uploaded file as buffer
    const fileBuffer = await fs.promises.readFile(excelFile.filepath);

    console.log("[BUSBOY DATA] FILE BUFFER SIZE:", fileBuffer.length);

    // Step 4: Parse Excel
    const students: IStudentRecord[] =
      await parseStudentExcelFile(fileBuffer);

    console.log("[PARSED STUDENTS]", students.length);

    console.log("[BUSBOY DATA] STUDENT DATA NOT SERIALISED:", students);
    // Step 5: Respond
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ students }));

    // Step 6: Cleanup temp file (non-blocking)
    fs.unlink(excelFile.filepath, (err) => {
      if (err) {
        console.error("Failed to delete temp file:", excelFile.filepath, err);
      }
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: (err as Error).message }));
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


