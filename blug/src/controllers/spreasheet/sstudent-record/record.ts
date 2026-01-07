import {
  IAffectiveDomain,
  IPsychomotorSkills,
  IStudentRecord,
  ISubjectRecord,
  ISubjectScore,
} from "./build-student-sheet.js";

/**
 * NOTE:
 * This is a MOCK data provider for local testing only.
 * It mirrors the exact IStudentRecord shape used by the Excel builder/parser.
 */

const BUSINESS_ID = "school_001";
const ACADEMIC_TERM = "2024/2025 - First Term";
const CLASS_SECTION = {
  _id: "class_jss2_a",
  sectionName: "JSS 2A",
};

export async function fetchStudentsFromDB(): Promise<IStudentRecord[]> {
  const studentNames = [
    "John Doe",
    "Jane Smith",
    "Alice Brown",
    "Bob Green",
    "Charlie White",
  ];

  const subjects = [
    "Mathematics",
    "English",
    "Science",
    "History",
    "Geography",
    "Computer Studies",
  ];

  const affectiveItems = [
    "Attendance",
    "Punctuality",
    "Responsibility",
    "Neatness",
    "Teamwork",
  ];

  const psychomotorItems = [
    "Handwriting",
    "Drawing",
    "Laboratory Skills",
    "Craft Skills",
    "Physical Fitness",
  ];

  return studentNames.map((fullName, index): IStudentRecord => {
    const recordId = `record_${index + 1}`;
    const studentRefId = `student_${index + 1}`;

    /* --------------------------------------------------
     * SUBJECT RECORDS
     * -------------------------------------------------- */
    const subjectRecords: ISubjectRecord[] = subjects.map((subjectName) => {
      const scores: ISubjectScore[] = [
        { name: "CA1", value: rand(0, 20), maxValue: 20 },
        { name: "CA2", value: rand(0, 20), maxValue: 20 },
        { name: "Exam", value: rand(0, 60), maxValue: 60 },
      ];

      const totalScore = scores.reduce((sum, s) => sum + s.value, 0);
      const grade = resolveGrade(totalScore);

      return {
        subjectName,
        scores,
        totalScore,
        grade,
        remark: "Keep improving",
      };
    });

    /* --------------------------------------------------
     * AFFECTIVE DOMAIN
     * -------------------------------------------------- */
    const affectiveDomain: IAffectiveDomain = {
      items: affectiveItems.map((label) => ({
        label,
        rating: buildRatingScale(5),
        remark: "Good",
      })),
    };

    /* --------------------------------------------------
     * PSYCHOMOTOR SKILLS
     * -------------------------------------------------- */
    const psychomotorSkills: IPsychomotorSkills = {
      items: psychomotorItems.map((label) => ({
        label,
        rating: buildRatingScale(5),
        remark: "Satisfactory",
      })),
    };

    /* --------------------------------------------------
     * FINAL STUDENT RECORD
     * -------------------------------------------------- */
    return {
      _id: recordId,

      business: BUSINESS_ID,
      academicTerm: ACADEMIC_TERM,

      studentId: {
        _id: studentRefId,
        fullName,
        studentId: `STD-${1000 + index}`,
      },

      classSection: CLASS_SECTION,

      subjectRecords,
      affectiveDomain,
      psychomotorSkills,

      commentsAndSignatures: {
        teacherComment: "Keep up the good work",
        headTeacherComment: "Excellent progress",
      },
    };
  });
}

/* ======================================================
 * IN-MEMORY CACHE
 * ====================================================== */

let STUDENTS_CACHE: IStudentRecord[] = [];

/**
 * Fetch a single student record by record ID
 */
export async function fetchStudentFromDB(
  recordId: string
): Promise<IStudentRecord> {
  if (!STUDENTS_CACHE.length) {
    STUDENTS_CACHE = await fetchStudentsFromDB();
  }

  const student = STUDENTS_CACHE.find((s) => s._id === recordId);
  if (!student) {
    throw new Error(`Student record ${recordId} not found`);
  }

  return student;
}

/**
 * Save student grades (mock persistence)
 */
export async function saveStudentGrades(
  updatedRecord: IStudentRecord
): Promise<void> {
  if (!STUDENTS_CACHE.length) {
    STUDENTS_CACHE = await fetchStudentsFromDB();
  }

  const index = STUDENTS_CACHE.findIndex(
    (s) => s._id === updatedRecord._id
  );

  if (index === -1) {
    throw new Error(`Student record ${updatedRecord._id} not found`);
  }

  STUDENTS_CACHE[index] = updatedRecord;

  console.log(
    `✔ Saved grades for ${updatedRecord.studentId.fullName}`
  );
}

/* ======================================================
 * HELPERS
 * ====================================================== */

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resolveGrade(score: number): string {
  if (score >= 75) return "A1";
  if (score >= 65) return "B2";
  if (score >= 55) return "C4";
  if (score >= 45) return "C5";
  if (score >= 40) return "D6";
  if (score >= 30) return "E7";
  return "F9";
}

function buildRatingScale(size: number) {
  const selected = Math.ceil(Math.random() * size);
  return Array.from({ length: size }, (_, i) => {
    const rate = i + 1;
    return {
      rate,
      value: rate === selected ? rate : null,
    };
  });
}
