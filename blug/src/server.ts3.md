// server.ts
import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { loadEnvFile } from "node:process";

import { generateStudentRecordsExcel, IStudentRecord } from "./controllers/spreasheet/sstudent-record/build-student-sheet.js";
import { fetchStudentsFromDB, fetchStudentFromDB, saveStudentGrades } from "./controllers/spreasheet/sstudent-record/record.js";

// Load environment variables
loadEnvFile("./src/.env");

// Fix __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT) || 3501;

// Create Express app
const app = express();

// Middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing URL-encoded data

// Serve static assets (CSS, JS, images)
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/controllers", express.static(path.join(__dirname, "controllers")));
app.use("/view", express.static(path.join(__dirname, "view")));

// -----------------------------
// Routes
// -----------------------------

// Serve index.html
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "view", "index.html"));
});

app.get("/index.html", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "view", "index.html"));
});

// Excel download route
app.get("/download-student-records", async (req: Request, res: Response) => {
  try {
    const students: IStudentRecord[] = await fetchStudentsFromDB();
    const buffer = await generateStudentRecordsExcel(students);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="student_records.xlsx"`
    );
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to generate student records Excel");
  }
});

// Fetch a single student by ID
app.get("/api/student", async (req: Request, res: Response) => {
  const studentId = req.query.id as string;
  if (!studentId) {
    return res.status(400).json({ error: "Missing student ID" });
  }

  try {
    const student = await fetchStudentFromDB(studentId);
    res.json(student);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// Save updated student grades
app.post("/api/save-grades", async (req: Request, res: Response) => {
  try {
    const data = req.body;
    await saveStudentGrades(data);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 404 fallback
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
