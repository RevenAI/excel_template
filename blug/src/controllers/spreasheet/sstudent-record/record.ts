//import { IStudentRecord, ISubjectRecord, ISubjectScore, IRatingItem, IAffectiveDomain, IPsychomotorSkills } from "./generator.js";


import { IAffectiveDomain, IPsychomotorSkills, IStudentRecord, ISubjectRecord, ISubjectScore } from "./build-student-sheet.js";

/**
 * Dummy fetch function returning 5 students with subjects, affective & psychomotor items
 */
export async function fetchStudentsFromDB(): Promise<IStudentRecord[]> {
  const studentNames = ["John Doe", "Jane Smith", "Alice Brown", "Bob Green", "Charlie White"];
  const subjects = ["Math", "English", "Science", "History", "Geography", "Computer"];
  const affectiveItems = ["Attendance", "Punctuality", "Responsibility", "Neatness", "Teamwork"];
  const psychomotorItems = ["Handwriting", "Drawing", "Laboratory Skills", "Craft Skills", "Physical Fitness"];

  const students: IStudentRecord[] = studentNames.map((name, index) => {
    // --------------------------
    // Subject Records
    // --------------------------
    const subjectRecords: ISubjectRecord[] = subjects.map((sub) => {
      const scores: ISubjectScore[] = [
        { name: "CA1", value: Math.floor(Math.random() * 21), maxValue: 20 },
        { name: "CA2", value: Math.floor(Math.random() * 21), maxValue: 20 },
        { name: "Exam", value: Math.floor(Math.random() * 61), maxValue: 60 },
      ];
      const totalScore = scores.reduce((acc, s) => acc + s.value, 0);
      const grade = totalScore >= 75 ? "A1" : totalScore >= 65 ? "B2" : totalScore >= 55 ? "C4" : "D6";
      return { subjectName: sub, scores, totalScore, grade, remark: "Keep improving" };
    });

    // --------------------------
    // Affective Domain (with items wrapper)
    // --------------------------
    const affectiveDomain: IAffectiveDomain = {
      items: affectiveItems.map((item) => {
        const rating: { rate: number; value: number | null }[] = [1, 2, 3, 4, 5].map((r) => ({
          rate: r,
          value: r === Math.ceil(Math.random() * 5) ? r : null,
        }));
        return { label: item, rating, remark: "Good" };
      }),
    };

    // --------------------------
    // Psychomotor Skills (with items wrapper)
    // --------------------------
    const psychomotorSkills: IPsychomotorSkills = {
      items: psychomotorItems.map((item) => {
        const rating: { rate: number; value: number | null }[] = [1, 2, 3, 4, 5].map((r) => ({
          rate: r,
          value: r === Math.ceil(Math.random() * 5) ? r : null,
        }));
        return { label: item, rating, remark: "Satisfactory" };
      }),
    };

    // --------------------------
    // Student Object
    // --------------------------
    return {
      id: (index + 1).toString(),
      name,
      class: "JSS 2",
      subjectRecords,
      affectiveDomain,
      psychomotorSkills,
      commentsAndSignatures: {
        teacherComment: "Keep up the good work",
        headTeacherComment: "Excellent progress",
      },
    };
  });

  return students;
}
