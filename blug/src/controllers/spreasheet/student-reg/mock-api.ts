import { IStudentRegistrationRow } from "./type.js";

/**
 * MOCK DATA SOURCE
 * This is for development/testing. Replace with real DB/API in production.
 */

// --------------------------------------------------
// INTERNAL CONSTANTS
// --------------------------------------------------
const BUSINESS_ID = "64fa12c8b71a9c001234abcd";  // business (e.g., school ID)
const CLASS_SECTION_ID = "64fa12d9a71a9c001234efgh";  // class section (e.g., JSS 2)

// Constants for parent-child relationship values
const PARENT_RELATIONSHIP_VALUES = [
  "Father",
  "Mother",
  "Guardian",
  "Brother",
  "Sister",
  "Others",
];

// --------------------------------------------------
// IN-MEMORY MOCK DB
// --------------------------------------------------
let STUDENT_REG_CACHE: IStudentRegistrationRow[] = [];

// --------------------------------------------------
// MOCK GENERATOR (PRIVATE)
// --------------------------------------------------
function generateMockStudentRegistrations(): IStudentRegistrationRow[] {
  const baseStudents = [
    ["John", "Doe", "Male"],
    ["Jane", "Smith", "Female"],
    ["Michael", "Brown", "Male"],
    ["Sarah", "Johnson", "Female"],
    ["David", "Wilson", "Male"],
    ["Aisha", "Muhammad", "Female"],
    ["Samuel", "Okafor", "Male"],
    ["Grace", "Adeyemi", "Female"],
    ["Daniel", "Olawale", "Male"],
    ["Fatima", "Sadiq", "Female"],
    ["Joshua", "Abdul", "Male"],
    ["Maryam", "Bello", "Female"],
    ["Emeka", "Nwoye", "Male"],
    ["Blessing", "Onyekachi", "Female"],
    ["Ibrahim", "Sule", "Male"],
    ["Hauwa", "Lawal", "Female"],
    ["Joseph", "Peter", "Male"],
    ["Deborah", "Isaac", "Female"],
    ["Ahmed", "Yusuf", "Male"],
    ["Esther", "Samuel", "Female"],
  ] as const;

  return baseStudents.map(([firstName, surname, gender], index) => {
    const dobYear = 2005 + (index % 5); // 2005-2009
    const dobMonth = (index % 12) + 1;
    const dobDay = (index % 28) + 1;

    return {
      // ---------------- STUDENT ----------------
      _id: `student-${index + 1}`,  // Generate _id for existing students
      firstName,
      surname,
      middleName: index % 3 === 0 ? "James" : undefined,
      email: `${firstName.toLowerCase()}.${surname.toLowerCase()}@student.school.com`,
      phone: `+23480${Math.floor(10000000 + index * 321)}`,
      dateOfBirth: `${dobDay.toString().padStart(2, "0")}/${dobMonth
        .toString()
        .padStart(2, "0")}/${dobYear}`,
      gender: gender.toLowerCase() as typeof gender,

      // ---------------- PARENT ----------------
      parentFirstName: index % 2 === 0 ? `Mr ${surname}` : `Mrs ${surname}`,
      parentSurname: surname,
      parentEmail: `${surname.toLowerCase()}.parent${index + 1}@mail.com`,
      parentPhone: `+23481${Math.floor(10000000 + index * 517)}`,
      parentGender: index % 2 === 0 ? "male" : "female",
      maritalStatus: index % 4 === 0 ? "Widowed" : "Married",
      occupation: index % 2 === 0 ? "Civil Servant" : "Business Owner",
      relationshipWithChildren: PARENT_RELATIONSHIP_VALUES[index % PARENT_RELATIONSHIP_VALUES.length],
      useSameParent: false, // default

      // ---------------- SYSTEM ----------------
      business: BUSINESS_ID,  // Store business (school ID)
      classSection: { _id: CLASS_SECTION_ID, sectionName: "JSS 2" },  // Store classSection with _id
    };
  });
}

// --------------------------------------------------
// PUBLIC API (MOCK)
// --------------------------------------------------

/**
 * Fetches the list of student registrations from the mock database.
 * Returns an array of IStudentRegistrationRow.
 */
export async function fetchStudentRegistrationsFromDB(): Promise<IStudentRegistrationRow[]> {
  if (STUDENT_REG_CACHE.length === 0) {
    STUDENT_REG_CACHE = generateMockStudentRegistrations();
  }
  await new Promise((r) => setTimeout(r, 50)); // simulate latency
  return STUDENT_REG_CACHE;
}

/**
 * Fetches a single student registration by their email.
 * @param email - Email of the student to fetch.
 * @returns The student registration.
 */
export async function fetchStudentRegistrationByEmail(
  email: string
): Promise<IStudentRegistrationRow> {
  if (STUDENT_REG_CACHE.length === 0) {
    STUDENT_REG_CACHE = generateMockStudentRegistrations();
  }
  const record = STUDENT_REG_CACHE.find((s) => s.email === email);
  if (!record) throw new Error(`Student with email ${email} not found`);
  return record;
}

/**
 * Saves a student registration to the mock database.
 * If the student already exists, their data will be updated.
 * @param payload - The student registration data to save.
 */
export async function saveStudentRegistration(
  payload: IStudentRegistrationRow
): Promise<void> {
  if (STUDENT_REG_CACHE.length === 0) {
    STUDENT_REG_CACHE = generateMockStudentRegistrations();
  }
  const index = STUDENT_REG_CACHE.findIndex((s) => s.email === payload.email);
  if (index === -1) {
    STUDENT_REG_CACHE.push(payload);  // Add new student if not found
  } else {
    STUDENT_REG_CACHE[index] = { ...STUDENT_REG_CACHE[index], ...payload };  // Update existing student
  }
  console.log(`Saved registration for ${payload.firstName} ${payload.surname}`);
}
