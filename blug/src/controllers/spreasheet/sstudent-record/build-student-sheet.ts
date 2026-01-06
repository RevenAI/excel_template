import ExcelJS from "exceljs";

/**
 * Rating item structure as defined by the server
 */
export interface IRating {
  rate: string | number; // allowed choice for teacher
  value: string | number | null; // actual filled value
}

export interface IRatingItem {
  label: string;
  rating: IRating[];
  remark?: string | null;
}

export interface ISubjectScore {
  name: string;
  value: number;
  maxValue: number;
}

export interface ISubjectRecord {
  subjectName: string;
  scores: ISubjectScore[];
  totalScore: number;
  grade: string;
  remark: string;
}

export interface ICommentsAndSignatures {
  teacherComment?: string;
  headTeacherComment?: string;
}

export interface IStudentRecord {
  id: string;
  name: string;
  class: string;
  subjectRecords: ISubjectRecord[];
  affectiveDomain?: IAffectiveDomain;
  psychomotorSkills?: IPsychomotorSkills;
  commentsAndSignatures?: ICommentsAndSignatures;
}

export interface IAffectiveDomain {
  items: IRatingItem[];
}

export interface IPsychomotorSkills {
  items: IRatingItem[];
}

export type StudentGrades =
  | "A1"
  | "B2"
  | "B3"
  | "C4"
  | "C5"
  | "D6"
  | "E7"
  | "F9";


/**
 * Builds a fully formatted student record worksheet.
 * - Supports editable and read-only modes
 * - Enforces validation rules for scores and ratings
 * - Locks computed and identity fields
 */
export function buildStudentSheet(
  workbook: ExcelJS.Workbook,
  student: IStudentRecord,
  readOnly = false
): ExcelJS.Worksheet {
  // Create a worksheet named after the student
  const sheet = workbook.addWorksheet(student.name, {
    properties: { tabColor: { argb: "FF00B050" } },
  });

  // Inserts empty rows to visually separate sections
  const addSpacer = (lines = 1) => {
    for (let i = 0; i < lines; i++) sheet.addRow([]);
  };

  // Renders a consistent section title with underline styling
  const addSectionTitle = (title: string) => {
    addSpacer(1);

    const row = sheet.addRow([title]);
    row.height = 20;
    row.getCell(1).font = { bold: true, size: 13 };
    row.getCell(1).alignment = {
      horizontal: "left",
      vertical: "middle",
    };
    row.getCell(1).border = { bottom: { style: "thin" } };

    addSpacer(1);
  };

  // ------------------------------------------------------------------
  // SECTION 1: BASIC STUDENT INFORMATION (ALL READ-ONLY)
  // ------------------------------------------------------------------
  addSectionTitle("SECTION 1: BASIC INFO");

  [
    ["Student Name", student.name],
    ["Class", student.class],
    ["Student ID", student.id],
  ].forEach(([label, value]) => {
    const row = sheet.addRow([label, value]);
    row.height = 22;

    // Labels are bold and visually emphasized
    row.getCell(1).font = { bold: true, color: { argb: "FF006400" } };

    // Identity fields must never be editable
    row.getCell(2).protection = { locked: true };
  });

  // ------------------------------------------------------------------
  // SECTION 2: SUBJECT RECORDS
  // - Scores are editable (within validation limits)
  // - Totals and grades are computed / locked
  // ------------------------------------------------------------------
  addSectionTitle("SECTION 2: SUBJECT RECORDS");

  // Build table header dynamically from score definitions
  const subjectHeader = ["Subject"];
  student.subjectRecords[0].scores.forEach((s) =>
    subjectHeader.push(s.name)
  );
  subjectHeader.push("Total Score", "Grade", "Remark");

  const headerRow = sheet.addRow(subjectHeader);
  headerRow.font = { bold: true };

  student.subjectRecords.forEach((subject) => {
    // Initial row values (raw scores + precomputed values)
    const rowData: (string | number)[] = [subject.subjectName];

    subject.scores.forEach((s) => rowData.push(s.value));
    rowData.push(subject.totalScore, subject.grade, subject.remark);

    const row = sheet.addRow(rowData);
    row.height = 22;
    row.getCell(1).font = { bold: true, color: { argb: "FF006400" } };

    const scoreStartCol = 2;

    // Allow score entry but enforce numeric bounds
    subject.scores.forEach((score, i) => {
      const cell = row.getCell(scoreStartCol + i);
      cell.protection = { locked: false };
      cell.dataValidation = {
        type: "decimal",
        operator: "between",
        formulae: [0, score.maxValue],
        showErrorMessage: true,
        error: `Value must be between 0 and ${score.maxValue}`,
      };
    });

    // Auto-calculate total score from editable score cells
    const totalCol = scoreStartCol + subject.scores.length;
    const scoreCells = subject.scores.map(
      (_, i) => row.getCell(scoreStartCol + i).address
    );

    row.getCell(totalCol).value = {
      formula: `SUM(${scoreCells.join(",")})`,
      result: subject.totalScore,
    };

    // Computed and system-generated fields are locked
    row.getCell(totalCol).protection = { locked: true };       // Total
    row.getCell(totalCol + 1).protection = { locked: true };  // Grade
    row.getCell(totalCol + 2).protection = { locked: false }; // Remark
  });

  // ------------------------------------------------------------------
  // DOMAIN SECTIONS (Affective / Psychomotor)
  // - Boolean TRUE/FALSE dropdowns
  // - Default all FALSE except selected value
  // ------------------------------------------------------------------
  const addDomainSection = (title: string, items: IRatingItem[]) => {
    addSectionTitle(title);

    // Ensure consistent column count across all traits
    const maxRatings = Math.max(...items.map((i) => i.rating.length));

    const header = ["Trait"];
    for (let i = 0; i < maxRatings; i++) header.push(`Rating ${i + 1}`);
    header.push("Remark");

    const headerRow = sheet.addRow(header);
    headerRow.font = { bold: true };

    items.forEach((item) => {
      const rowData: (string | boolean)[] = [item.label];

      // Only the selected rating is TRUE; others default to FALSE
      item.rating.forEach((r) => {
        rowData.push(r.value === r.rate);
      });

      rowData.push(item.remark ?? "");

      const row = sheet.addRow(rowData);
      row.height = 22;
      row.getCell(1).font = { bold: true, color: { argb: "FF006400" } };

      // Ratings are editable via TRUE/FALSE dropdowns
      item.rating.forEach((_, i) => {
        const cell = row.getCell(2 + i);
        cell.protection = { locked: false };
        cell.dataValidation = {
          type: "list",
          formulae: ['"TRUE,FALSE"'],
          allowBlank: false,
        };
      });

      // Remarks are locked (system-controlled)
      row.getCell(2 + item.rating.length).protection = { locked: true };
    });
  };

  // Render affective domain if present
  if (student.affectiveDomain?.items?.length) {
    addDomainSection(
      "SECTION 3: AFFECTIVE DOMAIN",
      student.affectiveDomain.items
    );
  }

  // Render psychomotor skills if present
  if (student.psychomotorSkills?.items?.length) {
    addDomainSection(
      "SECTION 4: PSYCHOMOTOR SKILLS",
      student.psychomotorSkills.items
    );
  }

  // ------------------------------------------------------------------
  // SECTION 5: COMMENTS & SIGNATURES
  // ------------------------------------------------------------------
  addSectionTitle("SECTION 5: COMMENTS & SIGNATURES");

  [
    ["Teacher Comment", student.commentsAndSignatures?.teacherComment ?? ""],
    ["Head Teacher Comment", student.commentsAndSignatures?.headTeacherComment ?? ""],
  ].forEach(([label, value]) => {
    const row = sheet.addRow([label, value]);
    row.height = 26;
    row.getCell(1).font = { bold: true, color: { argb: "FF006400" } };

    // Comments are editable unless sheet is globally read-only
    row.getCell(2).protection = { locked: false };
  });

  // ------------------------------------------------------------------
  // FINAL FORMATTING (GLOBAL)
  // ------------------------------------------------------------------
  sheet.columns.forEach((c) => (c.width = 28));
  sheet.eachRow((r) => {
    r.alignment = { horizontal: "left", vertical: "top", wrapText: true };
  });

  // ------------------------------------------------------------------
  // READ-ONLY MODE ENFORCEMENT
  // - Overrides all per-cell permissions
  // ------------------------------------------------------------------
  if (readOnly) {
    // Force-lock every cell regardless of previous configuration
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.protection = { locked: true };
      });
    });

    // Fully locked sheet (no selection, no edits)
    sheet.protect("", {
      selectLockedCells: false,
      selectUnlockedCells: false,
    });
  } else {
    // Normal mode: respects per-cell locking rules
    sheet.protect("", {
      selectLockedCells: true,
      selectUnlockedCells: true,
    });
  }

  return sheet;
}

export async function generateStudentRecordsExcel(
  students: IStudentRecord[]
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();

  // Loop through students, each gets its own sheet
  students.forEach((student) => {
    buildStudentSheet(workbook, student, true);
  });

  // Generate file as buffer (works for API response)
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

