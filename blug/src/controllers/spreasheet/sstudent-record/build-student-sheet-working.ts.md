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
 * Builds a student record worksheet in the given workbook.
 */
export function buildStudentSheet(
  workbook: ExcelJS.Workbook,
  student: IStudentRecord
): ExcelJS.Worksheet {
  const sheet = workbook.addWorksheet(student.name, {
    properties: { tabColor: { argb: "FF00B050" } },
  });

  /** Add vertical space */
  const addSpacer = (lines = 1) => {
    for (let i = 0; i < lines; i++) {
      sheet.addRow([]);
    }
  };

  /** Compact section title (FIXED) */
  const addSectionTitle = (title: string) => {
    addSpacer(1);

    const row = sheet.addRow([title]);
    row.height = 20;
    row.getCell(1).font = { bold: true, size: 13 };
    row.getCell(1).alignment = {
      horizontal: "left",
      vertical: "middle",
      wrapText: false,
    };
    row.getCell(1).border = {
      bottom: { style: "thin" },
    };

    addSpacer(1);
  };

  // --------------------------
  // SECTION 1: BASIC INFO
  // --------------------------
  addSectionTitle("SECTION 1: BASIC INFO");

  [
    ["Student Name", student.name],
    ["Class", student.class],
    ["Student ID", student.id],
  ].forEach(([label, value]) => {
    const row = sheet.addRow([label, value]);
    row.height = 22;
    row.getCell(1).font = { bold: true, color: { argb: "FF006400" } };
    row.getCell(2).protection = { locked: true };
    row.alignment = { horizontal: "left", wrapText: true };
  });

  // --------------------------
  // SECTION 2: SUBJECT RECORDS
  // --------------------------
  addSectionTitle("SECTION 2: SUBJECT RECORDS");

  const subjectHeader = ["Subject"];
  student.subjectRecords[0].scores.forEach((s) =>
    subjectHeader.push(s.name)
  );
  subjectHeader.push("Total Score", "Grade", "Remark");

  const headerRow = sheet.addRow(subjectHeader);
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: "left" };

  student.subjectRecords.forEach((subject) => {
    const rowData: (string | number)[] = [subject.subjectName];

    subject.scores.forEach((s) => rowData.push(s.value));
    rowData.push(subject.totalScore, subject.grade, subject.remark);

    const row = sheet.addRow(rowData);
    row.height = 22;
    row.getCell(1).font = { bold: true, color: { argb: "FF006400" } };
    row.alignment = { horizontal: "left", wrapText: true };

    const scoreStartCol = 2;

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

  // --------------------------
  // DOMAIN SECTIONS (CHECKBOX STYLE)
  // --------------------------
const addDomainSection = (title: string, items: IRatingItem[]) => {
  addSectionTitle(title);

  const maxRatings = Math.max(...items.map((i) => i.rating.length));
  const header = ["Trait"];
  for (let i = 0; i < maxRatings; i++) header.push(`Rating ${i + 1}`);
  header.push("Remark");

  const headerRow = sheet.addRow(header);
  headerRow.font = { bold: true };

  items.forEach((item) => {
    const rowData: (string | boolean)[] = [item.label];

    // Default FALSE, selected value = TRUE
    item.rating.forEach((r) => {
      rowData.push(r.value === r.rate);
    });

    rowData.push(item.remark ?? "");

    const row = sheet.addRow(rowData);
    row.height = 22;
    row.getCell(1).font = { bold: true, color: { argb: "FF006400" } };
    row.alignment = { horizontal: "left", wrapText: true };

    // Checkbox validation
    item.rating.forEach((_, i) => {
      const cell = row.getCell(2 + i);
      cell.protection = { locked: false };
      cell.dataValidation = {
        type: "list",
        formulae: ['"TRUE,FALSE"'],
        allowBlank: false,
      };
    });

    row.getCell(2 + item.rating.length).protection = { locked: true };
  });
};

  if (student.affectiveDomain?.items?.length) {
    addDomainSection(
      "SECTION 3: AFFECTIVE DOMAIN",
      student.affectiveDomain.items
    );
  }

  if (student.psychomotorSkills?.items?.length) {
    addDomainSection(
      "SECTION 4: PSYCHOMOTOR SKILLS",
      student.psychomotorSkills.items
    );
  }

  // --------------------------
  // SECTION 5: COMMENTS
  // --------------------------
  addSectionTitle("SECTION 5: COMMENTS & SIGNATURES");

  [
    ["Teacher Comment", student.commentsAndSignatures?.teacherComment ?? ""],
    ["Head Teacher Comment", student.commentsAndSignatures?.headTeacherComment ?? ""],
  ].forEach(([label, value]) => {
    const row = sheet.addRow([label, value]);
    row.height = 26;
    row.getCell(1).font = { bold: true, color: { argb: "FF006400" } };
    row.getCell(2).protection = { locked: false };
    row.alignment = { horizontal: "left", wrapText: true };
  });

  // --------------------------
  // FINAL FORMATTING
  // --------------------------
  sheet.columns.forEach((c) => (c.width = 28));
  sheet.eachRow((r) => {
    r.alignment = { horizontal: "left", vertical: "top", wrapText: true };
  });

  sheet.protect("", { selectLockedCells: true, selectUnlockedCells: true });

  return sheet;
}
