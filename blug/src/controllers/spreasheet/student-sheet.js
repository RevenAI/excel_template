// export function buildStudentSheet(student) {
//   const rows = [];

//   let row = 0;
//   const addRow = (arr) => { rows[row++] = arr; };

//   const section = (title) => {
//     addRow([title]);
//     addRow([]);
//   };

//   // SECTION 1: Basic info
//   section("SECTION 1: BASIC INFO");
//   addRow(["Student Name", student.name]);
//   addRow(["Class", student.class]);
//   addRow(["Student ID", student.id]);

//   // SECTION 2: Subjects
//   section("SECTION 2: SUBJECT RECORDS");
//   const subjectHeader = ["Subject", ...student.subjectRecords[0].scores.map(s => s.name), "Total", "Grade", "Remark"];
//   addRow(subjectHeader);

//   student.subjectRecords.forEach(subject => {
//     const rowData = [
//       subject.subjectName,
//       ...subject.scores.map(s => s.value),
//       subject.totalScore,
//       subject.grade,
//       subject.remark
//     ];
//     addRow(rowData);
//   });

//   // SECTION 3 & 4: Domains
//   const domainSection = (title, items) => {
//     section(title);
//     const maxRating = Math.max(...items.map(i => i.rating.length));
//     addRow(["Trait", ...Array.from({ length: maxRating }, (_, i) => `Rating ${i+1}`), "Remark"]);

//     items.forEach(item => {
//       const rowData = [
//         item.label,
//         ...item.rating.map(r => r.value === r.rate ? true : false),
//         item.remark
//       ];
//       addRow(rowData);
//     });
//   };

//   if(student.affectiveDomain?.items)
//     domainSection("SECTION 3: AFFECTIVE DOMAIN", student.affectiveDomain.items);

//   if(student.psychomotorSkills?.items)
//     domainSection("SECTION 4: PSYCHOMOTOR SKILLS", student.psychomotorSkills.items);

//   // SECTION 5: Comments
//   section("SECTION 5: COMMENTS & SIGNATURES");
//   addRow(["Teacher Comment", student.commentsAndSignatures?.teacherComment ?? ""]);
//   addRow(["Head Teacher Comment", student.commentsAndSignatures?.headTeacherComment ?? ""]);

//   return [{
//     name: student.name,
//     data: rows
//   }];
// }




/* // student-sheet.js
export function buildStudentSheet(workbook, student) {
  const sheet = workbook.createSheet(student.name);
  let row = 0;

  const set = (r, c, v, locked = true) => {
    sheet.setCellValue(r, c, v);
    sheet.setCellProtection(r, c, locked);
  };

  const spacer = (n = 1) => row += n;

  const section = (title) => {
    spacer();
    set(row, 0, title);
    sheet.setRowHeight(row, 24);
    sheet.setRowBold(row, true);
    spacer();
  };

  // --------------------------------------------------
  // SECTION 1: BASIC INFO (READ ONLY)
  // --------------------------------------------------
  section("SECTION 1: BASIC INFO");

  [
    ["Student Name", student.name],
    ["Class", student.class],
    ["Student ID", student.id],
  ].forEach(([l, v]) => {
    set(row, 0, l);
    set(row, 1, v, true);
    row++;
  });

  // --------------------------------------------------
  // SECTION 2: SUBJECT RECORDS
  // --------------------------------------------------
  section("SECTION 2: SUBJECT RECORDS");

  set(row, 0, "Subject");
  student.subjectRecords[0].scores.forEach((s, i) =>
    set(row, i + 1, s.name)
  );
  set(row, student.subjectRecords[0].scores.length + 1, "Total");
  set(row, student.subjectRecords[0].scores.length + 2, "Grade");
  set(row, student.subjectRecords[0].scores.length + 3, "Remark");
  row++;

  student.subjectRecords.forEach(subject => {
    set(row, 0, subject.subjectName);

    subject.scores.forEach((score, i) => {
      set(row, i + 1, score.value, false);
      sheet.setDataValidation(row, i + 1, {
        type: "number",
        min: 0,
        max: score.maxValue,
      });
    });

    const startCol = 1;
    const endCol = subject.scores.length;
    sheet.setFormula(
      row,
      endCol + 1,
      `SUM(${String.fromCharCode(66)}${row + 1}:${String.fromCharCode(66 + endCol - 1)}${row + 1})`
    );

    set(row, endCol + 2, subject.grade);
    set(row, endCol + 3, subject.remark, false);
    row++;
  });

  // --------------------------------------------------
  // DOMAIN SECTIONS
  // --------------------------------------------------
  const domain = (title, items) => {
    section(title);

    set(row, 0, "Trait");
    const max = Math.max(...items.map(i => i.rating.length));
    for (let i = 0; i < max; i++) set(row, i + 1, `Rating ${i + 1}`);
    set(row, max + 1, "Remark");
    row++;

    items.forEach(item => {
      set(row, 0, item.label);

      item.rating.forEach((r, i) => {
        const val = r.value === r.rate;
        set(row, i + 1, val, false);

        sheet.setDataValidation(row, i + 1, {
          type: "list",
          values: [true, false],
        });

        // ✅ enforce ONLY ONE TRUE (auto-adjust)
        sheet.onCellValueChange((r2, c2, v) => {
          if (r2 === row && c2 === i + 1 && v === true) {
            item.rating.forEach((_, j) => {
              if (j !== i) sheet.setCellValue(row, j + 1, false);
            });
          }
        });
      });

      row++;
    });
  };

  if (student.affectiveDomain?.items)
    domain("SECTION 3: AFFECTIVE DOMAIN", student.affectiveDomain.items);

  if (student.psychomotorSkills?.items)
    domain("SECTION 4: PSYCHOMOTOR SKILLS", student.psychomotorSkills.items);

  // --------------------------------------------------
  // COMMENTS
  // --------------------------------------------------
  section("SECTION 5: COMMENTS & SIGNATURES");

  set(row, 0, "Teacher Comment");
  set(row, 1, student.commentsAndSignatures?.teacherComment ?? "", false);
  row++;

  set(row, 0, "Head Teacher Comment");
  set(row, 1, student.commentsAndSignatures?.headTeacherComment ?? "", false);

  sheet.setDefaultColumnWidth(28);
}
 */