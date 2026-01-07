// import ExcelJS from "exceljs";
// import { buildStudentRegistrationSheet } from "./build-reg-sheet.js";
// import { IStudentRegistrationRow } from "./type.js";

// export async function generateStudentRegistrationTemplate(
//   students: IStudentRegistrationRow[],
//   readOnly = false
// ): Promise<Buffer> {
//   const workbook = new ExcelJS.Workbook();

//   students.forEach((student) => {
//     buildStudentRegistrationSheet(workbook, student, readOnly);
//   });

//   return workbook.xlsx.writeBuffer();
// }



// // import ExcelJS from "exceljs";

// // import { buildStudentRegistrationSheet } from "./build-reg-sheet.js";
// // import { IStudentRegistrationRow } from "./type.js";

// // export async function generateStudentRegistrationTemplate(
// //   prefilledData: IStudentRegistrationRow[],
// //   readOnly = false
// // ): Promise<Buffer> {
// //   const workbook = new ExcelJS.Workbook();

// //   buildStudentRegistrationSheet(workbook, prefilledData, readOnly);

// //   return workbook.xlsx.writeBuffer();
// // }
