import ExcelJS from "exceljs";
import { buildStudentSheet, IStudentRecord } from "./build-student-sheet.js";


// ----------------------
// Interfaces (simplified for context)
//export type StudentGrades = "A1" | "B2" | "B3" | "C4" | "C5" | "D6" | "E7" | "F9";

// export interface IScoreEntry {
//   name: string;
//   value: number;
//   maxValue: number;
//   weight: number;
// }

// export interface ISubjectRecord {
//   subjectName: string;
//   scores: IScoreEntry[];
//   totalScore: number;
//   grade: StudentGrades;
//   remark?: string;
// }

// interface IRatingItem {
//   label: string;
//   rating: {
//     rate: string | number;
//     value: string | number | null;
//   }[];
//   weight?: number;
//   remark?: string | null;
// }

// interface IAffectiveDomain {
//   items: IRatingItem[];
// }

// interface IPsychomotorSkills {
//   items: IRatingItem[];
// }

// export interface ICommentAndSignature {
//   teacherComment?: string;
//   headTeacherComment?: string;
// }

// export interface IStudentRecord {
//   id: string;
//   name: string;
//   class: string;
//   subjectRecords: ISubjectRecord[];
//   affectiveDomain?: IAffectiveDomain;
//   psychomotorSkills?: IPsychomotorSkills;
//   commentsAndSignatures?: ICommentAndSignature;
// }

// ----------------------
// Reusable method to build Excel for all students

