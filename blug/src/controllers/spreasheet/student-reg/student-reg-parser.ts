import ExcelJS from "exceljs";
import {
  IStudentRegistrationRow,
  GENDER_VALUES,
  MARITAL_STATUS_VALUES,
  PARENT_RELATIONSHIP_VALUES,
  ParsedStudentRegistration,
} from "./type.js";

/**
 * Result of parsing a single student registration sheet
 */
// export interface ParsedStudentRegistration {
//   data: IStudentRegistrationRow;
//   isCreating: boolean;
// }

/**
 * Parse a student registration Excel workbook back into
 * fully structured registration rows.
 *
 * ✔ Mirrors builder layout exactly
 * ✔ Extracts hidden system metadata authoritatively
 * ✔ Differentiates create vs update flows
 * ✔ Strong defaults + normalization
 * ✔ Safe for production upload pipelines
 *
 * @param buffer Raw Excel file buffer
 */
export async function parseStudentRegistrationExcelFile(
  buffer: Buffer
): Promise<ParsedStudentRegistration[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);

  const results: ParsedStudentRegistration[] = [];

  /**
   * Utility: normalize text cell value
   */
  const text = (value: unknown): string =>
    typeof value === "string" ? value.trim() : String(value ?? "").trim();

  /**
   * Utility: normalize enum values safely
   */
  const normalizeEnum = <T extends readonly string[]>(
    value: string,
    allowed: T,
    fallback: T[number]
  ): T[number] => {
    return (allowed as readonly string[]).includes(value)
      ? (value as T[number])
      : fallback;
  };

  workbook.worksheets.forEach((sheet) => {
    /* =========================================================
     * 1. EXTRACT ALL LABEL → VALUE PAIRS
     * ========================================================= */
    const fields = new Map<string, string>();

    sheet.eachRow((row) => {
      const label = text(row.getCell(1).value);
      if (!label) return;

      const value = text(row.getCell(2).value);
      fields.set(label, value);
    });

    /* =========================================================
     * 2. SYSTEM / HIDDEN METADATA (AUTHORITATIVE)
     * ========================================================= */
    const systemId = fields.get("_id") || "";
    const business = fields.get("Business") || "";
    const classSectionId = fields.get("Class Section") || "";

    const isCreating = !systemId;

    /* =========================================================
     * 3. BUILD REGISTRATION OBJECT (STRICT STRUCTURE)
     * ========================================================= */
    const row: IStudentRegistrationRow = {
      // -------------------------------------------------
      // SYSTEM FIELDS
      // -------------------------------------------------
      _id: isCreating ? "" : systemId,
      business,
      classSection: {
        _id: classSectionId,
        sectionName: "",
      },

      // -------------------------------------------------
      // STUDENT INFO
      // -------------------------------------------------
      firstName: fields.get("First Name") || "",
      surname: fields.get("Surname") || "",
      middleName: fields.get("Middle Name") || "",
      email: fields.get("Email") || "",
      phone: fields.get("Phone") || "",
      username: fields.get("Username") || "",
      dateOfBirth: fields.get("Date of Birth") || "",
      gender: normalizeEnum(
        fields.get("Gender") || "",
        GENDER_VALUES,
        "male"
      ),

      // -------------------------------------------------
      // PARENT / GUARDIAN INFO
      // -------------------------------------------------
      parentFirstName: fields.get("Parent First Name") || "",
      parentSurname: fields.get("Parent Surname") || "",
      parentEmail: fields.get("Parent Email") || "",
      parentPhone: fields.get("Parent Phone") || "",
      parentGender: normalizeEnum(
        fields.get("Parent Gender") || "",
        GENDER_VALUES,
        "male"
      ),
      maritalStatus: normalizeEnum(
        fields.get("Marital Status") || "",
        MARITAL_STATUS_VALUES,
        "single"
      ),
      occupation: fields.get("Occupation") || "",
      relationshipWithChildren: normalizeEnum(
        fields.get("Relationship With Child") || "",
        PARENT_RELATIONSHIP_VALUES,
        "Father"
      ),
    };

    /* =========================================================
     * 4. FINAL HARD VALIDATION (MINIMUM VIABLE DATA)
     * ========================================================= */
    // Only enforce strict metadata for existing students
    if (!isCreating) {
        if (!row.business) {
            throw new Error(
            `Invalid sheet "${sheet.name}": missing business metadata`
            );
        }
        if (!row.classSection._id) {
            throw new Error(
            `Invalid sheet "${sheet.name}": missing classSection metadata`
            );
        }
        if (!row.firstName || !row.surname) {
        throw new Error(
            `Invalid sheet "${sheet.name}": student name is required`
        );
        }
        if (!row.parentFirstName || !row.parentSurname) {
        throw new Error(
            `Invalid sheet "${sheet.name}": parent name is required`
        );
        }
    }

    /* =========================================================
     * 5. PUSH RESULT
     * ========================================================= */
    results.push({
      data: row,
      isCreating,
    });
  });

  return results;
}
