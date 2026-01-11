
export type StudentGrades =
  | "A1"
  | "B2"
  | "B3"
  | "C4"
  | "C5"
  | "D6"
  | "E7"
  | "F9";

export interface IAffectiveDomain {
  items: IRatingItem[];
}

export interface IPsychomotorSkills {
  items: IRatingItem[];
}

export interface ICommentsAndSignatures {
  teacherComment: string;
  headTeacherComment: string;
  parentOrGuardianComment: string
}

export interface IRating {
  rate: string | number; // allowed choice
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

export interface IGradeBand {
  grade: StudentGrades | string;  // e.g., "A", A1", "B2", "B+", "PASS"
  minPercentage: number;          // 0–100
  maxPercentage: number;          // 0–100
  remark?: string;                // e.g., "Excellent"
  gpaPoints?: number | null;      // e.g., 4.0, 3.0
  colorCode?: string;             // HEX color like "#FF0000"
}

export interface FinalReportCard {
    //school info
    schoolName: string
    schoolAdrees: string
    //reportTitle: string
    schoolMotto: string
    reportTerm: string
    reportSession: string

    //student info
    studentName: string
    class: string
    sex: string

    //attendance
    numOfTimeSchoolOpenned: number
    numOfTimeStudentPresent: number
    numOfTimeStudentAbsent: number
    firstTermStudentAttendancePercentage: number
    secondTermStudentAttendancePercentage: number
    thirdTermStudentAttendancePercentage: number

    //subjects and scores
    subjects: ISubjectRecord[]

    totolMarkObtainable: number
    totalMarkObtained: number
    percentage: number

    affectiveDomain: IAffectiveDomain
    psychomotorSkills: IPsychomotorSkills
    commentsAndSignatures: ICommentsAndSignatures

    //grading - note that this is for
    //grading guar do understand the student score grading
    //it usually comes from grading config
    gradeInterpretation: IGradeBand[]
    

}


  // private async getDummyLogo() {
  //   return imageService.readImageDataUrl(
  //     "nexalearn",
  //     "logo",
  //     "nexalearn-logo-thumb.webp"
  //   );
  // }

  // private async getDummySignature() {
  //   return imageService.readImageDataUrl(
  //     "nexalearn",
  //     "signature",
  //     "signature-thumb.webp"
  //   );
  // }

export const dummyFinalReportCard: FinalReportCard = {
  // =========================
  // School Information
  // =========================
  schoolName: "NexaLearn College",
  schoolAdrees: "25 Knowledge Avenue, Ibadan, Oyo State",

  //reportTitle: "End of Term Academic Report",
  schoolMotto: "Knowledge is Light",
  reportTerm: "Second Term",
  reportSession: "2024 / 2025 Academic Session",

  // =========================
  // Student Information
  // =========================
  studentName: "Abidemi Enitan",
  class: "SS 2",
  sex: "Female",

  // =========================
  // Attendance
  // =========================
  numOfTimeSchoolOpenned: 62,
  numOfTimeStudentPresent: 58,
  numOfTimeStudentAbsent: 4,

  firstTermStudentAttendancePercentage: 90,
  secondTermStudentAttendancePercentage: 94,
  thirdTermStudentAttendancePercentage: 0,

  // =========================
  // Subjects Offered
  // =========================
  // subjects: [
  //   {
  //     subjectName: "Mathematics",
  //     scores: [
  //       { name: "CA", value: 27, maxValue: 30 },
  //       { name: "Test", value: 18, maxValue: 20 },
  //       { name: "Exam", value: 41, maxValue: 50 },
  //     ],
  //     totalScore: 86,
  //     grade: "A1",
  //     remark: "Excellent",
  //   },
  //   {
  //     subjectName: "English Language",
  //     scores: [
  //       { name: "CA", value: 25, maxValue: 30 },
  //       { name: "Test", value: 17, maxValue: 20 },
  //       { name: "Exam", value: 38, maxValue: 50 },
  //     ],
  //     totalScore: 80,
  //     grade: "B2",
  //     remark: "Very Good",
  //   },
  //   {
  //     subjectName: "Biology",
  //     scores: [
  //       { name: "CA", value: 24, maxValue: 30 },
  //       { name: "Test", value: 15, maxValue: 20 },
  //       { name: "Exam", value: 36, maxValue: 50 },
  //     ],
  //     totalScore: 75,
  //     grade: "B3",
  //     remark: "Good",
  //   },
  //   {
  //     subjectName: "Chemistry",
  //     scores: [
  //       { name: "CA", value: 22, maxValue: 30 },
  //       { name: "Test", value: 14, maxValue: 20 },
  //       { name: "Exam", value: 34, maxValue: 50 },
  //     ],
  //     totalScore: 70,
  //     grade: "C4",
  //     remark: "Credit",
  //   },
  //   {
  //     subjectName: "Physics",
  //     scores: [
  //       { name: "CA", value: 23, maxValue: 30 },
  //       { name: "Test", value: 16, maxValue: 20 },
  //       { name: "Exam", value: 37, maxValue: 50 },
  //     ],
  //     totalScore: 76,
  //     grade: "B3",
  //     remark: "Good",
  //   },
  // ],

  subjects: [
  {
    subjectName: "Mathematics",
    scores: [
      { name: "CA", value: 27, maxValue: 30 },
      { name: "Test", value: 18, maxValue: 20 },
      { name: "Exam", value: 41, maxValue: 50 },
    ],
    totalScore: 86,
    grade: "A1",
    remark: "Excellent",
  },
  {
    subjectName: "English Language",
    scores: [
      { name: "CA", value: 25, maxValue: 30 },
      { name: "Test", value: 17, maxValue: 20 },
      { name: "Exam", value: 38, maxValue: 50 },
    ],
    totalScore: 80,
    grade: "B2",
    remark: "Very Good",
  },
  {
    subjectName: "Further Mathematics",
    scores: [
      { name: "CA", value: 26, maxValue: 30 },
      { name: "Test", value: 18, maxValue: 20 },
      { name: "Exam", value: 40, maxValue: 50 },
    ],
    totalScore: 84,
    grade: "A1",
    remark: "Excellent",
  },
  {
    subjectName: "Physics",
    scores: [
      { name: "CA", value: 23, maxValue: 30 },
      { name: "Test", value: 16, maxValue: 20 },
      { name: "Exam", value: 37, maxValue: 50 },
    ],
    totalScore: 76,
    grade: "B3",
    remark: "Good",
  },
  {
    subjectName: "Chemistry",
    scores: [
      { name: "CA", value: 22, maxValue: 30 },
      { name: "Test", value: 15, maxValue: 20 },
      { name: "Exam", value: 34, maxValue: 50 },
    ],
    totalScore: 71,
    grade: "C4",
    remark: "Credit",
  },
  {
    subjectName: "Biology",
    scores: [
      { name: "CA", value: 24, maxValue: 30 },
      { name: "Test", value: 16, maxValue: 20 },
      { name: "Exam", value: 36, maxValue: 50 },
    ],
    totalScore: 76,
    grade: "B3",
    remark: "Good",
  },
  {
    subjectName: "Economics",
    scores: [
      { name: "CA", value: 21, maxValue: 30 },
      { name: "Test", value: 15, maxValue: 20 },
      { name: "Exam", value: 35, maxValue: 50 },
    ],
    totalScore: 71,
    grade: "C4",
    remark: "Credit",
  },
  {
    subjectName: "Government",
    scores: [
      { name: "CA", value: 22, maxValue: 30 },
      { name: "Test", value: 16, maxValue: 20 },
      { name: "Exam", value: 36, maxValue: 50 },
    ],
    totalScore: 74,
    grade: "B3",
    remark: "Good",
  },
  {
    subjectName: "Civic Education",
    scores: [
      { name: "CA", value: 24, maxValue: 30 },
      { name: "Test", value: 18, maxValue: 20 },
      { name: "Exam", value: 39, maxValue: 50 },
    ],
    totalScore: 81,
    grade: "B2",
    remark: "Very Good",
  },
  {
    subjectName: "Geography",
    scores: [
      { name: "CA", value: 20, maxValue: 30 },
      { name: "Test", value: 14, maxValue: 20 },
      { name: "Exam", value: 32, maxValue: 50 },
    ],
    totalScore: 66,
    grade: "C4",
    remark: "Credit",
  },
  // {
  //   subjectName: "Agricultural Science",
  //   scores: [
  //     { name: "CA", value: 22, maxValue: 30 },
  //     { name: "Test", value: 14, maxValue: 20 },
  //     { name: "Exam", value: 33, maxValue: 50 },
  //   ],
  //   totalScore: 69,
  //   grade: "C5",
  //   remark: "Credit",
  // },
  // {
  //   subjectName: "Computer Studies",
  //   scores: [
  //     { name: "CA", value: 28, maxValue: 30 },
  //     { name: "Test", value: 19, maxValue: 20 },
  //     { name: "Exam", value: 42, maxValue: 50 },
  //   ],
  //   totalScore: 89,
  //   grade: "A1",
  //   remark: "Excellent",
  // },
  // {
  //   subjectName: "Data Processing",
  //   scores: [
  //     { name: "CA", value: 26, maxValue: 30 },
  //     { name: "Test", value: 18, maxValue: 20 },
  //     { name: "Exam", value: 40, maxValue: 50 },
  //   ],
  //   totalScore: 84,
  //   grade: "A1",
  //   remark: "Excellent",
  // },
  // {
  //   subjectName: "Literature in English",
  //   scores: [
  //     { name: "CA", value: 23, maxValue: 30 },
  //     { name: "Test", value: 15, maxValue: 20 },
  //     { name: "Exam", value: 35, maxValue: 50 },
  //   ],
  //   totalScore: 73,
  //   grade: "B3",
  //   remark: "Good",
  // },
  // {
  //   subjectName: "Christian Religious Studies",
  //   scores: [
  //     { name: "CA", value: 25, maxValue: 30 },
  //     { name: "Test", value: 17, maxValue: 20 },
  //     { name: "Exam", value: 38, maxValue: 50 },
  //   ],
  //   totalScore: 80,
  //   grade: "B2",
  //   remark: "Very Good",
  // },
  {
    subjectName: "Yoruba Language",
    scores: [
      { name: "CA", value: 24, maxValue: 30 },
      { name: "Test", value: 16, maxValue: 20 },
      { name: "Exam", value: 36, maxValue: 50 },
    ],
    totalScore: 76,
    grade: "B3",
    remark: "Good",
  },
  {
    subjectName: "Visual Arts",
    scores: [
      { name: "CA", value: 26, maxValue: 30 },
      { name: "Test", value: 17, maxValue: 20 },
      { name: "Exam", value: 37, maxValue: 50 },
    ],
    totalScore: 80,
    grade: "B2",
    remark: "Very Good",
  },
  {
    subjectName: "Technical Drawing",
    scores: [
      { name: "CA", value: 25, maxValue: 30 },
      { name: "Test", value: 16, maxValue: 20 },
      { name: "Exam", value: 36, maxValue: 50 },
    ],
    totalScore: 77,
    grade: "B3",
    remark: "Good",
  },
  {
    subjectName: "Financial Accounting",
    scores: [
      { name: "CA", value: 21, maxValue: 30 },
      { name: "Test", value: 14, maxValue: 20 },
      { name: "Exam", value: 34, maxValue: 50 },
    ],
    totalScore: 69,
    grade: "C5",
    remark: "Credit",
  },
  {
    subjectName: "Commerce",
    scores: [
      { name: "CA", value: 22, maxValue: 30 },
      { name: "Test", value: 15, maxValue: 20 },
      { name: "Exam", value: 35, maxValue: 50 },
    ],
    totalScore: 72,
    grade: "C4",
    remark: "Credit",
  },
],

  // =========================
  // Overall Performance
  // =========================
  totolMarkObtainable: 500,
  totalMarkObtained: 387,
  percentage: 77.4,

  // =========================
  // Affective Domain (1–5 Scale)
  // =========================
  affectiveDomain: {
    items: [
      {
        label: "Punctuality",
        rating: [
          { rate: 5, value: 4 },
          { rate: 4, value: null },
          { rate: 3, value: null },
          { rate: 2, value: null },
          { rate: 1, value: null },
        ],
        remark: "Consistently punctual",
      },
      {
        label: "Behavior",
        rating: [
          { rate: 5, value: null },
          { rate: 4, value: 4 },
          { rate: 3, value: null },
          { rate: 2, value: null },
          { rate: 1, value: null },
        ],
        remark: "Well-behaved and respectful",
      },
      {
        label: "Attentiveness",
        rating: [
          { rate: 5, value: 5 },
          { rate: 4, value: null },
          { rate: 3, value: null },
          { rate: 2, value: null },
          { rate: 1, value: null },
        ],
        remark: "Highly attentive in class",
      },
      {
        label: "Leadership",
        rating: [
          { rate: 5, value: null },
          { rate: 4, value: 3 },
          { rate: 3, value: null },
          { rate: 2, value: null },
          { rate: 1, value: null },
        ],
      },
    ],
  },

  // =========================
  // Psychomotor Skills (1–5 Scale)
  // =========================
  psychomotorSkills: {
    items: [
      {
        label: "Handwriting",
        rating: [
          { rate: 5, value: null },
          { rate: 4, value: 4 },
          { rate: 3, value: null },
          { rate: 2, value: null },
          { rate: 1, value: null },
        ],
        remark: "Neat and legible",
      },
      {
        label: "Sports",
        rating: [
          { rate: 5, value: null },
          { rate: 4, value: null },
          { rate: 3, value: 3 },
          { rate: 2, value: null },
          { rate: 1, value: null },
        ],
      },
      {
        label: "Practical Skills",
        rating: [
          { rate: 5, value: 4 },
          { rate: 4, value: null },
          { rate: 3, value: null },
          { rate: 2, value: null },
          { rate: 1, value: null },
        ],
        remark: "Shows good laboratory skills",
      },
    ],
  },

  // =========================
  // Comments & Signatures
  // =========================
  commentsAndSignatures: {
    teacherComment:
      "Abidemi is diligent and shows strong academic commitment.",
    headTeacherComment:
      "A disciplined student with excellent prospects for higher achievement.",
    parentOrGuardianComment: '',
  },

  // =========================
  // Grade Interpretation
  // =========================
  gradeInterpretation: [
  {
    grade: "A1",
    minPercentage: 75,
    maxPercentage: 100,
    remark: "Excellent",
    gpaPoints: 4.0,
    colorCode: "#2e7d32", // Deep Green
  },
  {
    grade: "B2",
    minPercentage: 70,
    maxPercentage: 74,
    remark: "Very Good",
    gpaPoints: 3.5,
    colorCode: "#689f38", // Olive Green
  },
  {
    grade: "B3",
    minPercentage: 65,
    maxPercentage: 69,
    remark: "Good",
    gpaPoints: 3.0,
    colorCode: "#afb42b", // Lime
  },
  {
    grade: "C4",
    minPercentage: 60,
    maxPercentage: 64,
    remark: "Credit",
    gpaPoints: 2.5,
    colorCode: "#f9a825", // Yellow
  },
  {
    grade: "C5",
    minPercentage: 55,
    maxPercentage: 59,
    remark: "Credit",
    gpaPoints: 2.0,
    colorCode: "#ef6c00", // Orange
  },
  {
    grade: "D6",
    minPercentage: 50,
    maxPercentage: 54,
    remark: "Pass",
    gpaPoints: 1.5,
    colorCode: "#d84315", // Deep Orange
  },
  {
    grade: "E7",
    minPercentage: 45,
    maxPercentage: 49,
    remark: "Weak Pass",
    gpaPoints: 1.0,
    colorCode: "#c62828", // Red
  },
  {
    grade: "F9",
    minPercentage: 0,
    maxPercentage: 44,
    remark: "Fail",
    gpaPoints: 0,
    colorCode: "#7b1fa2", // Purple (Fail emphasis)
  },
]
};

