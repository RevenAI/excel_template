import ExcelJS from "exceljs";

/* ============================================================
 * RATING & DOMAIN TYPES
 * ============================================================ */

/**
 * Single rating option for affective/psychomotor traits
 */
export interface IRating {
  rate: string | number; // allowed choice
  value: string | number | null; // actual filled value
}

/**
 * Rating item (trait) with selectable ratings
 */
export interface IRatingItem {
  label: string;
  rating: IRating[];
  remark?: string | null;
}

/* ============================================================
 * SUBJECT & SCORE TYPES
 * ============================================================ */

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

/* ============================================================
 * COMMENTS
 * ============================================================ */

export interface ICommentsAndSignatures {
  teacherComment?: string;
  headTeacherComment?: string;
}

/* ============================================================
 * CORE STUDENT RECORD
 * ============================================================ */

export interface IStudentRecord {
  /** Record document ID */
  _id: string;

  /** Student reference (populated) */
  studentId: {
    _id: string;
    fullName: string;
    studentId: string; // ID-card value
  };

  /** Class/section reference (populated) */
  classSection: {
    _id: string;
    sectionName: string;
  };

  /** Business / school ID */
  business: string;

  /** Academic term */
  academicTerm: string;

  /** Core academic records */
  subjectRecords: ISubjectRecord[];

  /** Optional domains */
  affectiveDomain?: IAffectiveDomain;
  psychomotorSkills?: IPsychomotorSkills;

  /** Optional comments */
  commentsAndSignatures?: ICommentsAndSignatures;
}

export interface IAffectiveDomain {
  items: IRatingItem[];
}

export interface IPsychomotorSkills {
  items: IRatingItem[];
}

/* ============================================================
 * GRADES
 * ============================================================ */

export type StudentGrades =
  | "A1"
  | "B2"
  | "B3"
  | "C4"
  | "C5"
  | "D6"
  | "E7"
  | "F9";

/* ============================================================
 * WORKSHEET BUILDER
 * ============================================================ */

/**
 * Builds a fully formatted Excel worksheet for a **single student record**.
 *
 * Features:
 * - Hidden immutable system fields (IDs, business, term)
 * - Editable score cells with validation
 * - Computed totals & grades (locked)
 * - Optional read-only enforcement
 *
 * @param workbook ExcelJS workbook
 * @param studentRecord Fully populated student record
 * @param readOnly Whether the sheet should be fully locked
 */
export function buildStudentSheet(
  workbook: ExcelJS.Workbook,
  studentRecord: IStudentRecord,
  readOnly = false
): ExcelJS.Worksheet {
  /* ------------------------------------------------------------
   * Worksheet creation
   * ------------------------------------------------------------ */
  const sheet = workbook.addWorksheet(
    studentRecord.studentId.fullName,
    { properties: { tabColor: { argb: "FF00B050" } } }
  );

  /* ------------------------------------------------------------
   * Hidden system metadata (used for upsert/update)
   * ------------------------------------------------------------ */
  const addHiddenSystemFields = () => {
    const systemFields: [string, string][] = [
      ["__recordId", studentRecord._id],
      ["__studentId", studentRecord.studentId._id],
      ["__classSectionId", studentRecord.classSection._id],
      ["__business", studentRecord.business],
      ["__academicTerm", studentRecord.academicTerm],
    ];

    systemFields.forEach(([key, value]) => {
      const row = sheet.addRow([key, value]);
      row.hidden = true;
      row.eachCell((cell) => {
        cell.protection = { locked: true };
      });
    });

    const spacer = sheet.addRow([]);
    spacer.hidden = true;
  };

  addHiddenSystemFields();

  /* ------------------------------------------------------------
   * Layout helpers
   * ------------------------------------------------------------ */
  const addSpacer = (lines = 1) => {
    for (let i = 0; i < lines; i++) sheet.addRow([]);
  };

  const addSectionTitle = (title: string) => {
    addSpacer(1);
    const row = sheet.addRow([title]);
    row.height = 20;
    row.getCell(1).font = { bold: true, size: 13 };
    row.getCell(1).border = { bottom: { style: "thin" } };
    addSpacer(1);
  };

  /* ------------------------------------------------------------
   * SECTION 1: BASIC INFO (READ-ONLY)
   * ------------------------------------------------------------ */
  addSectionTitle("SECTION 1: BASIC INFO");

  [
    ["Student Name", studentRecord.studentId.fullName],
    ["Class", studentRecord.classSection.sectionName],
    ["Student ID", studentRecord.studentId.studentId],
  ].forEach(([label, value]) => {
    const row = sheet.addRow([label, value]);
    row.height = 22;
    row.getCell(1).font = { bold: true, color: { argb: "FF006400" } };
    row.getCell(2).protection = { locked: true };
  });

  /* ------------------------------------------------------------
   * SECTION 2: SUBJECT RECORDS
   * ------------------------------------------------------------ */
  addSectionTitle("SECTION 2: SUBJECT RECORDS");

  const subjectHeader = ["Subject"];
  studentRecord.subjectRecords[0].scores.forEach((s) =>
    subjectHeader.push(s.name)
  );
  subjectHeader.push("Total Score", "Grade", "Remark");

  sheet.addRow(subjectHeader).font = { bold: true };

  studentRecord.subjectRecords.forEach((subject) => {
    const rowData: (string | number)[] = [subject.subjectName];

    subject.scores.forEach((s) => rowData.push(s.value));
    rowData.push(subject.totalScore, subject.grade, subject.remark);

    const row = sheet.addRow(rowData);
    row.height = 22;
    row.getCell(1).font = { bold: true, color: { argb: "FF006400" } };

    const scoreStartCol = 2;

    subject.scores.forEach((score, i) => {
      const cell = row.getCell(scoreStartCol + i);
      cell.protection = { locked: false };
      cell.dataValidation = {
        type: "decimal",
        operator: "between",
        formulae: [0, score.maxValue],
        error: `Value must be between 0 and ${score.maxValue}`,
      };
    });

    const totalCol = scoreStartCol + subject.scores.length;
    const scoreCells = subject.scores.map(
      (_, i) => row.getCell(scoreStartCol + i).address
    );

    row.getCell(totalCol).value = {
      formula: `SUM(${scoreCells.join(",")})`,
      result: subject.totalScore,
    };

    row.getCell(totalCol).protection = { locked: true };
    row.getCell(totalCol + 1).protection = { locked: true };
    row.getCell(totalCol + 2).protection = { locked: false };
  });

  /* ------------------------------------------------------------
   * DOMAIN SECTIONS
   * ------------------------------------------------------------ */
  const addDomainSection = (title: string, items: IRatingItem[]) => {
    addSectionTitle(title);

    const maxRatings = Math.max(...items.map((i) => i.rating.length));
    const header = ["Trait"];
    for (let i = 0; i < maxRatings; i++) header.push(`Rating ${i + 1}`);
    header.push("Remark");

    sheet.addRow(header).font = { bold: true };

    items.forEach((item) => {
      const rowData: (string | boolean)[] = [item.label];
      item.rating.forEach((r) => rowData.push(r.value === r.rate));
      rowData.push(item.remark ?? "");

      const row = sheet.addRow(rowData);
      row.getCell(1).font = { bold: true, color: { argb: "FF006400" } };

      item.rating.forEach((_, i) => {
        const cell = row.getCell(2 + i);
        cell.protection = { locked: false };
        cell.dataValidation = {
          type: "list",
          formulae: ['"TRUE,FALSE"'],
        };
      });

      row.getCell(2 + item.rating.length).protection = { locked: true };
    });
  };

  if (studentRecord.affectiveDomain?.items?.length) {
    addDomainSection(
      "SECTION 3: AFFECTIVE DOMAIN",
      studentRecord.affectiveDomain.items
    );
  }

  if (studentRecord.psychomotorSkills?.items?.length) {
    addDomainSection(
      "SECTION 4: PSYCHOMOTOR SKILLS",
      studentRecord.psychomotorSkills.items
    );
  }

  /* ------------------------------------------------------------
   * COMMENTS
   * ------------------------------------------------------------ */
  addSectionTitle("SECTION 5: COMMENTS & SIGNATURES");

  [
    ["Teacher Comment", studentRecord.commentsAndSignatures?.teacherComment ?? ""],
    ["Head Teacher Comment", studentRecord.commentsAndSignatures?.headTeacherComment ?? ""],
  ].forEach(([label, value]) => {
    const row = sheet.addRow([label, value]);
    row.getCell(1).font = { bold: true, color: { argb: "FF006400" } };
    row.getCell(2).protection = { locked: false };
  });

  /* ------------------------------------------------------------
   * FINAL FORMATTING
   * ------------------------------------------------------------ */
  sheet.columns.forEach((c) => (c.width = 28));
  sheet.eachRow((r) => {
    r.alignment = { horizontal: "left", vertical: "top", wrapText: true };
  });

  if (readOnly) {
    sheet.eachRow((row) =>
      row.eachCell((cell) => (cell.protection = { locked: true }))
    );
    sheet.protect("", { selectLockedCells: false });
  } else {
    sheet.protect("", { selectLockedCells: true });
  }

  return sheet;
}

/* ============================================================
 * WORKBOOK GENERATOR
 * ============================================================ */

/**
 * Generates a multi-sheet Excel workbook containing
 * student academic records.
 *
 * @param studentRecords Array of student records
 * @returns Excel file buffer
 */
export async function generateStudentRecordsExcel(
  studentRecords: IStudentRecord[]
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();

  studentRecords.forEach((studentRecord) => {
    buildStudentSheet(workbook, studentRecord, true);
  });

  // --------------------------------------------------
// 🔒 Protect workbook structure (Excel-native)
// --------------------------------------------------
// Prevents:
// - Adding worksheets
// - Deleting worksheets
// - Renaming worksheets
// - Reordering worksheets
//
// NOTE:
// - This does NOT encrypt the file
// - This is enforced by Excel UI, not security
// - File must still be validated on upload
// (workbook as any).workbookProtection = {
//   lockStructure: true,
// };

  return workbook.xlsx.writeBuffer();
}
