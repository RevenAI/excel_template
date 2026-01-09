import { fileTypeFromBuffer, FileTypeResult } from "file-type";
import sharp from "sharp";

export type SupportedFileType =
  | "image"
  | "pdf"
  | "csv"
  | "xlsx"
  | "doc";

export interface FileValidationOptions {
  type: SupportedFileType;
  maxSizeBytes?: number;
}

export interface FileValidationResult {
  mime: string;
  size: number;
}

export class FileValidationService {
  private static readonly DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

  /**
   * Entry point
   */
  static async validate(
    buffer: Buffer,
    options: FileValidationOptions
  ): Promise<FileValidationResult> {
    const { type, maxSizeBytes = this.DEFAULT_MAX_SIZE } = options;

    this.validateBasic(buffer, maxSizeBytes);

    const detected = await fileTypeFromBuffer(buffer);

    switch (type) {
      case "image":
        return this.validateImage(buffer, detected);

      case "pdf":
        return this.validatePdf(detected, buffer.length);

      case "csv":
        return this.validateCsv(buffer);

      case "xlsx":
        return this.validateXlsx(detected, buffer.length);

      case "doc":
        return this.validateDoc(detected, buffer.length);

      default:
        throw new Error("Unsupported file type");
    }
  }

  /**
   * -------------------------
   * BASIC VALIDATION
   * -------------------------
   */
  private static validateBasic(buffer: Buffer, maxSizeBytes: number) {
    if (!buffer || buffer.length === 0) {
      throw new Error("File is empty");
    }

    if (buffer.length > maxSizeBytes) {
      throw new Error("File size exceeds allowed limit");
    }
  }

  /**
   * -------------------------
   * IMAGE
   * -------------------------
   */
  private static async validateImage(
    buffer: Buffer,
    detected: FileTypeResult | undefined
  ): Promise<FileValidationResult> {
    if (!detected || !detected.mime.startsWith("image/")) {
      throw new Error("Not a valid image file");
    }

    let metadata;
    try {
      metadata = await sharp(buffer).metadata();
    } catch {
      throw new Error("Corrupted or unsupported image");
    }

    const allowedFormats = ["jpeg", "png", "webp"];
    if (!metadata.format || !allowedFormats.includes(metadata.format)) {
      throw new Error("Unsupported image format");
    }

    if (!metadata.width || !metadata.height) {
      throw new Error("Invalid image dimensions");
    }

    if (metadata.width > 6000 || metadata.height > 6000) {
      throw new Error("Image dimensions too large");
    }

    return {
      mime: detected.mime,
      size: buffer.length
    };
  }

  /**
   * -------------------------
   * PDF
   * -------------------------
   */
  private static validatePdf(
    detected: FileTypeResult | undefined,
    size: number
  ): FileValidationResult {
    if (!detected || detected.mime !== "application/pdf") {
      throw new Error("Not a valid PDF file");
    }

    return {
      mime: detected.mime,
      size
    };
  }

  /**
   * -------------------------
   * CSV
   * -------------------------
   */
  private static validateCsv(buffer: Buffer): FileValidationResult {
    const text = buffer.toString("utf8");

    // Reject binary masquerading as CSV
    if (text.includes("\u0000")) {
      throw new Error("CSV appears to be binary");
    }

    const lines = text.split(/\r?\n/).filter(Boolean);

    if (lines.length === 0) {
      throw new Error("CSV has no content");
    }

    // Basic delimiter sanity check
    if (!lines[0].includes(",") && !lines[0].includes(";")) {
      throw new Error("Invalid CSV structure");
    }

    return {
      mime: "text/csv",
      size: buffer.length
    };
  }

  /**
   * -------------------------
   * XLSX
   * -------------------------
   */
  private static validateXlsx(
    detected: FileTypeResult | undefined,
    size: number
  ): FileValidationResult {
    if (
      !detected ||
      detected.mime !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      throw new Error("Not a valid XLSX file");
    }

    return {
      mime: detected.mime,
      size
    };
  }

  /**
   * -------------------------
   * DOC / DOCX
   * -------------------------
   */
  private static validateDoc(
    detected: FileTypeResult | undefined,
    size: number
  ): FileValidationResult {
    if (!detected) {
      throw new Error("Unknown document format");
    }

    const allowedMimes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedMimes.includes(detected.mime)) {
      throw new Error("Not a valid Word document");
    }

    return {
      mime: detected.mime,
      size
    };
  }
}
