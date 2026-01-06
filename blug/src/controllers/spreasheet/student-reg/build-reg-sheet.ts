import ExcelJS from "exceljs";
import {
  IStudentRegistrationRow,
  GENDER_VALUES,
  MARITAL_STATUS_VALUES,
} from "./type.js";

const PARENT_RELATIONSHIP_VALUES = ["Father", "Mother", "Guardian", "Brother", "Sister", "Others"];

export function buildStudentRegistrationSheet(
  workbook: ExcelJS.Workbook,
  student: IStudentRegistrationRow,
  readOnly = false
): ExcelJS.Worksheet {
  const sheetName = `${student.firstName} ${student.surname}`.substring(0, 31);

  const sheet = workbook.addWorksheet(sheetName, {
    properties: { tabColor: { argb: "FF4472C4" } },
  });

  const addSpacer = (lines = 1) => {
    for (let i = 0; i < lines; i++) sheet.addRow([]);
  };

  const addSectionTitle = (title: string) => {
    addSpacer(1);
    const row = sheet.addRow([title]);
    row.height = 18; // shorter height
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
        fgColor: { argb: "FFFFF4CC" }, // only required fields get soft yellow
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
 // addSectionTitle("SYSTEM INFO");

  addField("Business", student.business, { locked: true, hidden: true });
  addField("Class Section", student.classSection, { locked: true, hidden: true });
  addField("Department", student.department, { locked: true, hidden: true });

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
