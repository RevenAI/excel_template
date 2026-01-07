import ExcelJS from "exceljs";
import { IStudentRecord, ISubjectRecord, IRatingItem, IRating } from "./build-student-sheet.js";


export async function parseStudentExcelFile(buffer: Buffer): Promise<IStudentRecord[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const students: IStudentRecord[] = [];

  workbook.worksheets.forEach((sheet) => {
    const studentName = sheet.name;

    // -------------------------------------------------
    // SECTION 1: Basic Info (row parsing)
    // -------------------------------------------------
    const basicInfo: Partial<IStudentRecord> = {};
    for (let row of sheet.getRows(1, sheet.rowCount) || []) {
      const label = row.getCell(1).text.trim();
      const value = row.getCell(2).text.trim();

      if (label === "Student Name") basicInfo.name = value;
      if (label === "Class") basicInfo.class = value;
      if (label === "Student ID") basicInfo.id = value;

      if (label.startsWith("SECTION")) break; // stop after Section 1
    }

    // -------------------------------------------------
    // SECTION 2: SUBJECT RECORDS
    // -------------------------------------------------
    const subjectRecords: ISubjectRecord[] = [];
    // Find header row for subjects
    let headerRowIndex = 0;
    sheet.eachRow((row, idx) => {
      if (row.getCell(1).text === "Subject") headerRowIndex = idx;
    });

    if (headerRowIndex > 0) {
      const headerRow = sheet.getRow(headerRowIndex);
      const scoreNames = headerRow.values.slice(2, -3) as string[];

      for (let i = headerRowIndex + 1; i <= sheet.rowCount; i++) {
        const row = sheet.getRow(i);
        const subjectName = row.getCell(1).text.trim();
        if (!subjectName) continue;

        const scores: ISubjectRecord["scores"] = [];
        scoreNames.forEach((scoreName, idx) => {
          const cellValue = Number(row.getCell(2 + idx).value);
          scores.push({ name: scoreName, value: cellValue, maxValue: 100 }); //maxValue placeholder
        });

        const totalScore = Number(row.getCell(2 + scores.length).value) || 0;
        const grade = row.getCell(3 + scores.length).text.trim();
        const remark = row.getCell(4 + scores.length).text.trim();

        subjectRecords.push({ subjectName, scores, totalScore, grade, remark });
      }
    }

    // -------------------------------------------------
    // SECTION 3/4: Domains (Affective / Psychomotor)
    // -------------------------------------------------
    const parseDomain = (startLabel: string): IRatingItem[] => {
      const items: IRatingItem[] = [];
      let startRow = 0;
      sheet.eachRow((row, idx) => {
        if (row.getCell(1).text.trim() === startLabel) startRow = idx + 2;
      });
      if (startRow === 0) return items;

      for (let i = startRow; i <= sheet.rowCount; i++) {
        const row = sheet.getRow(i);
        if (!row.getCell(1).text) break; // empty row means end
        const label = row.getCell(1).text;
        const ratings: IRating[] = [];
        for (let j = 2; j <= row.cellCount - 1; j++) {
          const value = row.getCell(j).value;
          ratings.push({ rate: true, value: value === true });
        }
        const remark = row.getCell(row.cellCount).text || null;
        items.push({ label, rating: ratings, remark });
      }
      return items;
    };

    const affectiveDomain = parseDomain("SECTION 3: AFFECTIVE DOMAIN");
    const psychomotorSkills = parseDomain("SECTION 4: PSYCHOMOTOR SKILLS");

    // -------------------------------------------------
    // SECTION 5: Comments
    // -------------------------------------------------
    let comments: { teacherComment?: string; headTeacherComment?: string } = {};
    sheet.eachRow((row) => {
      const label = row.getCell(1).text.trim();
      const value = row.getCell(2).text.trim();
      if (label === "Teacher Comment") comments.teacherComment = value;
      if (label === "Head Teacher Comment") comments.headTeacherComment = value;
    });

    students.push({
      ...basicInfo,
      subjectRecords,
      affectiveDomain: affectiveDomain.length ? { items: affectiveDomain } : undefined,
      psychomotorSkills: psychomotorSkills.length ? { items: psychomotorSkills } : undefined,
      commentsAndSignatures: comments,
    } as IStudentRecord);
  });

  return students;
}
