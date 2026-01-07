import ExcelJS from 'exceljs'

export interface IColumnSchema {
  header: string;
  key: keyof IStudentRegistrationRow;
  required?: boolean;
  width?: number;
  hidden?: boolean;
  validation?: ExcelJS.DataValidation;
  locked?: boolean;
}

// ================= ENUM MIRRORS (BACKEND-ALIGNED) =================

export const GENDER_VALUES = [
  "male",
  "female",
] as const;

export const MARITAL_STATUS_VALUES = [
  "single",
  "married",
  "divorced",
  "widowed",
] as const;

// ================= STUDENT REGISTRATION ROW =================
export interface IStudentRegistrationRow {
  // ================= STUDENT (IUser + IStudent) =================
  _id?: string //student id (for already existing students)
  firstName: string;
  surname: string;
  middleName?: string;

  email: string;
  phone: string;
  dateOfBirth: string | Date; // supports ISO or DD/MM/YYYY

  gender: (typeof GENDER_VALUES)[number];
  username?: string;

  // ================= PARENT (IUser + IParent) =================
  parentFirstName: string;
  parentSurname: string;

  parentEmail: string;
  parentPhone: string;

  parentGender: (typeof GENDER_VALUES)[number];
  maritalStatus: (typeof MARITAL_STATUS_VALUES)[number];
  occupation: string;
  relationshipWithChildren: string; // validated via dropdown

  // ================= SYSTEM / HIDDEN =================
  business: string;
  classSection: { //populated section
    _id: string;
    sectionName: string;
  };
}

// ================= STUDENT REGISTRATION ROW =================
/**
 * Result of parsing a single student registration sheet
 */
export interface ParsedStudentRegistration {
  data: IStudentRegistrationRow;
  isCreating: boolean;
}

// ================= COLUMN SCHEMA =================

export interface IStudentRegColumn {
  header: string;
  key: keyof IStudentRegistrationRow;
  width?: number;
  required?: boolean;
  hidden?: boolean;
  locked?: boolean;
  validation?: ExcelJS.DataValidation;
}

export const PARENT_RELATIONSHIP_VALUES = ["Father", "Mother", "Guardian", "Brother", "Sister", "Others"];

export const STUDENT_REG_COLUMNS: IStudentRegColumn[] = [
  // ================= STUDENT =================
  { header: "Student First Name", key: "firstName", required: true },
  { header: "Student Surname", key: "surname", required: true },
  { header: "Student Middle Name", key: "middleName" },

  {
    header: "Student Email",
    key: "email",
    required: true,
    validation: {
      type: "custom",
      formulae: [
        // basic Excel-safe email validation (Joi does deep validation server-side)
        'AND(ISNUMBER(SEARCH("@",INDIRECT("RC",FALSE))),ISNUMBER(SEARCH(".",INDIRECT("RC",FALSE))))',
      ],
      showErrorMessage: true,
      error: "Enter a valid email address",
    },
  },

  {
    header: "Student Phone",
    key: "phone",
    required: true,
    validation: {
      type: "textLength",
      operator: "between",
      formulae: [7, 20],
      showErrorMessage: true,
      error: "Enter a valid phone number",
    },
  },

  {
    header: "Date of Birth (DD/MM/YYYY)",
    key: "dateOfBirth",
    required: true,
    validation: {
      type: "date",
      operator: "lessThanOrEqual",
      formulae: ["TODAY()"],
      showErrorMessage: true,
      error: "Date of birth cannot be in the future",
    },
  },

  {
    header: "Gender",
    key: "gender",
    required: true,
    validation: {
      type: "list",
      formulae: [`"${GENDER_VALUES.join(",")}"`],
      allowBlank: false,
    },
  },

  { header: "Username", key: "username" },

  // ================= PARENT =================
  { header: "Parent First Name", key: "parentFirstName", required: true },
  { header: "Parent Surname", key: "parentSurname", required: true },

  {
    header: "Parent Email",
    key: "parentEmail",
    required: true,
    validation: {
      type: "custom",
      formulae: [
        'AND(ISNUMBER(SEARCH("@",INDIRECT("RC",FALSE))),ISNUMBER(SEARCH(".",INDIRECT("RC",FALSE))))',
      ],
      showErrorMessage: true,
      error: "Enter a valid email address",
    },
  },

  {
    header: "Parent Phone",
    key: "parentPhone",
    required: true,
    validation: {
      type: "textLength",
      operator: "between",
      formulae: [7, 20],
      showErrorMessage: true,
      error: "Enter a valid phone number",
    },
  },

  {
    header: "Parent Gender",
    key: "parentGender",
    required: true,
    validation: {
      type: "list",
      formulae: [`"${GENDER_VALUES.join(",")}"`],
    },
  },

  {
    header: "Marital Status",
    key: "maritalStatus",
    required: true,
    validation: {
      type: "list",
      formulae: [`"${MARITAL_STATUS_VALUES.join(",")}"`],
    },
  },

  {
    header: "Occupation",
    key: "occupation",
    required: true,
  },

  {
    header: "Relationship With Child",
    key: "relationshipWithChildren",
    required: true,
    validation: {
      type: "list",
      formulae: ['"Father,Mother,Guardian,Brother,Sister,Others"'],
    },
  },

  // ================= SYSTEM / HIDDEN =================
  {
    header: "Business ID",
    key: "business",
    hidden: true,
    locked: true,
  },
  {
    header: "Class Section ID",
    key: "classSection",
    hidden: true,
    locked: true,
  },
];
