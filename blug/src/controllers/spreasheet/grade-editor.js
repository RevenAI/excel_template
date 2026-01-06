// import { buildStudentSheet } from "./student-sheet.js";

// // Injected by backend
// const student = window.__STUDENT_RECORD__;

// // Build Luckysheet JSON
// const sheets = buildStudentSheet(student);

// // Initialize Luckysheet
// luckysheet.create({
//   container: 'sheet',
//   lang: 'en',
//   data: sheets,
//   allowEdit: true,
//   showToolbar: true
// });

// // Save button
// document.getElementById("save").onclick = async () => {
//   const data = luckysheet.getAllSheets(); // all sheets as JSON
//   try {
//     const resp = await fetch("/api/save-grades", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     if (!resp.ok) throw new Error("Server error");
//     alert("Saved successfully!");
//   } catch(err) {
//     console.error(err);
//     alert("Failed to save grades.");
//   }
// };



/* // grade-editor.js


import { buildStudentSheet } from "./student-sheet.js";

const { Univer, LocaleType } = window.UniverCore;

const univer = new Univer({
  locale: LocaleType.EN_US,
  locales: { [LocaleType.EN_US]: window.UniverLocaleEN },
});

const workbook = univer.createUnit(
  UniverCore.UniverInstanceType.UNIVER_SHEET,
  { container: document.getElementById("sheet") }
);

// Injected by backend
const student = window.__STUDENT_RECORD__;

buildStudentSheet(workbook, student);

document.getElementById("save").onclick = async () => {
  try {
    const sheet = workbook.getActiveSheet();
    const data = sheet.getSnapshot();

    const resp = await fetch("/api/save-grades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!resp.ok) throw new Error("Server error");

    alert("Saved successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to save grades.");
  }
};
 */

/* 
public/
├── univer/
│   ├── univer.full.min.js
│   ├── univer.css
│   └── locale-en-US.js
└── js/
    └── grade-editor.js

*/