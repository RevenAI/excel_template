import ExcelJS from "exceljs";
import {
  IStudentRegistrationRow,
  GENDER_VALUES,
  MARITAL_STATUS_VALUES,
} from "./type.js";

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
    row.height = 22;
    row.getCell(1).font = { bold: true, size: 13 };
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
    }
  ) => {
    const row = sheet.addRow([label, value ?? ""]);
    row.height = 24;

    row.getCell(1).font = { bold: true, color: { argb: "FF006400" } };

    const cell = row.getCell(2);

    if (options?.required) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFF4CC" },
      };
    }

    if (options?.validation) {
      cell.dataValidation = options.validation;
    }

    cell.protection = {
      locked: readOnly || options?.locked === true,
    };
  };

  // ==============================================================
  // SECTION 1: STUDENT INFORMATION (IUser + IStudent)
  // ==============================================================
  addSectionTitle("SECTION 1: STUDENT INFORMATION");

  addField("First Name", student.firstName, { required: true });
  addField("Surname", student.surname, { required: true });
  addField("Middle Name", student.middleName);

  addField("Email", student.email, {
    required: true,
    validation: {
      type: "custom",
      formulae: ['=AND(ISNUMBER(SEARCH("@",BROW())),ISNUMBER(SEARCH(".",BROW())))'],
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

  addField("Password", student.password, {
    required: true,
  });

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
    formulae: [
      new Date(1990, 0, 1), // min DOB
      new Date(),          // max DOB (today)
    ],
    showErrorMessage: true,
    error: "Enter a valid date of birth",
  },
});

  // ==============================================================
  // SECTION 2: PARENT / GUARDIAN INFORMATION
  // ==============================================================
  addSectionTitle("SECTION 2: PARENT / GUARDIAN INFORMATION");

  addField("Parent First Name", student.parentFirstName, { required: true });
  addField("Parent Surname", student.parentSurname, { required: true });

  addField("Parent Email", student.parentEmail, {
    required: true,
    validation: {
      type: "custom",
      formulae: ['=AND(ISNUMBER(SEARCH("@",BROW())),ISNUMBER(SEARCH(".",BROW())))'],
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

  addField(
    "Relationship With Child",
    student.relationshipWithChildren,
    { required: true }
  );

  // ==============================================================
  // SECTION 3: SYSTEM / HIDDEN (LOCKED)
  // ==============================================================
  addSectionTitle("SECTION 3: SYSTEM INFORMATION");

  addField("Business", student.business, { locked: true });
  addField("Class Section", student.classSection, { locked: true });
  addField("Department", student.department, { locked: true });

  // ==============================================================
  // GLOBAL FORMATTING
  // ==============================================================
  sheet.columns.forEach((c, i) => {
    c.width = i === 0 ? 30 : 38;
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
