import ExcelJS from "exceljs";
import {
  IStudentRegistrationRow,
  GENDER_VALUES,
  MARITAL_STATUS_VALUES,
  PARENT_RELATIONSHIP_VALUES,
} from "./type.js";

/**
 * Builds a single student registration sheet.
 * Can be used for existing students or empty template for new students.
 *
 * @param workbook - ExcelJS workbook
 * @param student - student data or empty template
 * @param readOnly - if true, protects locked cells
 * @param templateIndex - optional index for empty sheets
 */
export function buildStudentRegistrationSheet(
  workbook: ExcelJS.Workbook,
  student: IStudentRegistrationRow,
  readOnly = false,
  templateIndex?: number // optional index for empty sheets
): ExcelJS.Worksheet {
   // Base name
  let sheetName = `${student.firstName || "New"} ${student.surname || "Student"}`;

  // If multiple empty templates, append index to avoid duplicate names
  if (templateIndex !== undefined) {
    sheetName += ` ${templateIndex + 1}`;
  }

  // Excel limit: max 31 chars
  sheetName = sheetName.substring(0, 31);
  
  const sheet = workbook.addWorksheet(sheetName, {
    properties: { tabColor: { argb: "FF4472C4" } },
  });

  const addSpacer = (lines = 1) => {
    for (let i = 0; i < lines; i++) sheet.addRow([]);
  };

  const addSectionTitle = (title: string) => {
    addSpacer(1);
    const row = sheet.addRow([title]);
    row.height = 18;
    row.getCell(1).font = { bold: true, size: 12 };
    row.getCell(1).border = { bottom: { style: "thin" } };
    addSpacer(1);
  };

  const addField = (
    label: string,
    value: any,
    options?: {
      required?: boolean;
      validation?: ExcelJS.DataValidation;
      locked?: boolean;
      hidden?: boolean;
    }
  ) => {
    const row = sheet.addRow([label, value ?? ""]);
    row.height = 22;

    row.getCell(1).font = { bold: true, color: { argb: "FF006400" } };

    const cell = row.getCell(2);

    if (options?.required) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFF4CC" }, // soft yellow for required fields
      };
    }

    if (options?.validation) {
      cell.dataValidation = options.validation;
    }

    if (options?.hidden) {
      row.hidden = true;
      cell.protection = { locked: true };
    } else {
      cell.protection = { locked: readOnly || options?.locked === true };
    }
  };

  // ===========================================================
  // SECTION 1: STUDENT INFORMATION
  // ===========================================================
  addSectionTitle("STUDENT INFO");

  addField("First Name", student.firstName, { required: true });
  addField("Surname", student.surname, { required: true });
  addField("Middle Name", student.middleName);
  addField("Email", student.email, {
    required: true,
    validation: {
      type: "custom",
      formulae: ['=AND(ISNUMBER(SEARCH("@",B2)),ISNUMBER(SEARCH(".",B2)))'],
      showErrorMessage: true,
      error: "Enter a valid email address",
    },
  });
  addField("Phone", student.phone, {
    required: true,
    validation: {
      type: "textLength",
      operator: "greaterThanOrEqual",
      formulae: [10],
    },
  });
  addField("Username", student.username);
  addField("Gender", student.gender, {
    required: true,
    validation: {
      type: "list",
      formulae: [`"${GENDER_VALUES.join(",")}"`],
      allowBlank: false,
    },
  });
  addField("Date of Birth", student.dateOfBirth, {
    required: true,
    validation: {
      type: "date",
      operator: "between",
      formulae: [new Date(1990, 0, 1), new Date()],
      showErrorMessage: true,
      error: "Enter a valid date of birth",
    },
  });

  // ===========================================================
  // SECTION 2: PARENT / GUARDIAN INFORMATION
  // ===========================================================
  addSectionTitle("PARENT INFO");

  addField("Parent First Name", student.parentFirstName, { required: true });
  addField("Parent Surname", student.parentSurname, { required: true });
  addField("Parent Email", student.parentEmail, {
    required: true,
    validation: {
      type: "custom",
      formulae: ['=AND(ISNUMBER(SEARCH("@",B2)),ISNUMBER(SEARCH(".",B2)))'],
    },
  });
  addField("Parent Phone", student.parentPhone, {
    required: true,
    validation: {
      type: "textLength",
      operator: "greaterThanOrEqual",
      formulae: [10],
    },
  });
  addField("Parent Gender", student.parentGender, {
    required: true,
    validation: {
      type: "list",
      formulae: [`"${GENDER_VALUES.join(",")}"`],
    },
  });
  addField("Marital Status", student.maritalStatus, {
    required: true,
    validation: {
      type: "list",
      formulae: [`"${MARITAL_STATUS_VALUES.join(",")}"`],
    },
  });
  addField("Occupation", student.occupation, { required: true });
  addField("Relationship With Child", student.relationshipWithChildren, {
    required: true,
    validation: {
      type: "list",
      formulae: [`"${PARENT_RELATIONSHIP_VALUES.join(",")}"`],
    },
  });
  addField("Use Same Parent", false, {
    required: true,
    validation: {
      type: "list",
      formulae: ['"TRUE,FALSE"'],
      allowBlank: false,
    },
  });

  // ===========================================================
  // SECTION 3: SYSTEM / HIDDEN INFORMATION
  // ===========================================================
  // Existing student: store _id, business, classSection._id
  // New student template: only business & classSection._id
  addField("_id", student._id ?? "", { hidden: true, locked: true });
  addField("Business", student.business, { hidden: true, locked: true });
  addField("Class Section", student.classSection?._id ?? "", { hidden: true, locked: true });

  // ===========================================================
  // GLOBAL FORMATTING
  // ===========================================================
  sheet.columns.forEach((c, i) => {
    c.width = i === 0 ? 28 : 36;
  });

  sheet.eachRow((row) => {
    row.alignment = { vertical: "middle", wrapText: true };
  });

  sheet.protect("", {
    selectLockedCells: !readOnly,
    selectUnlockedCells: !readOnly,
  });

  return sheet;
}

/**
 * Generate a full Excel workbook for student registration
 *
 * @param students - prefilled student data for existing students
 * @param businessId - required for new student templates
 * @param classSectionId - required for new student templates
 * @param readOnly - protect locked cells
 * @param PAGE_COUNT - number of empty templates to generate
 */
export async function generateStudentRegistrationTemplate(
  students: IStudentRegistrationRow[] = [],
  businessId?: string,
  classSectionId?: string,
  readOnly = false,
  PAGE_COUNT: number = 5
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();

  // Determine number of empty templates
  let emptyTemplates = 0;
  if (PAGE_COUNT !== undefined) {
    emptyTemplates = PAGE_COUNT;
  } else if (students.length > 0) {
    emptyTemplates = 2;
  } else {
    emptyTemplates = 10;
  }

  // 1 Add existing students first
  students.forEach((student) => {
    buildStudentRegistrationSheet(workbook, student, readOnly);
  });

  // 2 Add empty templates for new students
  for (let i = 0; i < emptyTemplates; i++) {
    const newStudent: IStudentRegistrationRow = {
      business: businessId || "",
      classSection: { _id: classSectionId || "", sectionName: "" },
      firstName: "",
      surname: "",
      middleName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "male",
      username: "",
      parentFirstName: "",
      parentSurname: "",
      parentEmail: "",
      parentPhone: "",
      parentGender: "male",
      maritalStatus: "single",
      occupation: "",
      relationshipWithChildren: "Father",
    };

    buildStudentRegistrationSheet(workbook, newStudent, readOnly, i);
  }

  return workbook.xlsx.writeBuffer();
}
