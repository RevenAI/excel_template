import busboy from "busboy";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import type { IncomingMessage } from "node:http";



/**
 * Represents a single uploaded file.
 */
export interface UploadedFile {
  /** Field name in the form */
  fieldname: string;
  /** Original filename provided by client */
  originalFilename: string;
  /** Encoding type (utf-8, binary, etc.) */
  encoding: string;
  /** MIME type of the file */
  mimetype: string;
  /** Absolute path to the file on disk */
  filepath: string;
  /** File size in bytes */
  size: number;
}

/**
 * Configuration options for multipart parsing.
 */
interface ParseOptions {
  /** Maximum size per file in bytes */
  fileSizeLimit?: number;
  /** Maximum number of files allowed in request */
  filesLimit?: number;
  /** Maximum number of fields allowed in request */
  fieldsLimit?: number;
}

/**
 * Parses a multipart/form-data request using Busboy.
 *
 * @param req - HTTP IncomingMessage
 * @param options - Optional parsing limits
 *
 * @returns Object containing parsed fields and uploaded files
 */
export function parseMultipartForm(
  req: IncomingMessage,
  options: ParseOptions = {}
): Promise<{
  fields: Record<string, string>;
  files: Record<string, UploadedFile[]>;
}> {
  return new Promise((resolve, reject) => {
    const fields: Record<string, string> = {};
    const files: Record<string, UploadedFile[]> = {};

    const contentType = req.headers["content-type"];
    if (!contentType || !contentType.includes("multipart/form-data")) {
      reject(new Error("Request is not multipart/form-data"));
      return;
    }

    const bb = busboy({
      headers: req.headers,
      limits: {
        fileSize: options.fileSizeLimit,
        files: options.filesLimit,
        fields: options.fieldsLimit,
      },
    });

    const fileWritePromises: Promise<void>[] = [];

    // ------------------ FIELDS ------------------
    bb.on("field", (name, value) => {
      fields[name] = value;
    });

    // ------------------ FILES ------------------
    bb.on("file", (fieldname, file, info) => {
      const { filename, encoding, mimeType } = info;

      if (!filename) {
        file.resume(); // skip empty files
        return;
      }

      const safeName = path.basename(filename).replace(/[^\w.-]/g, "_");
      const filepath = path.join(os.tmpdir(), `${Date.now()}-${safeName}`);
      const writeStream = fs.createWriteStream(filepath);
      let size = 0;

      const promise = new Promise<void>((fileResolve, fileReject) => {
        file.on("data", (chunk: Buffer) => {
          size += chunk.length;
        });

        file.on("error", fileReject);
        writeStream.on("error", fileReject);

        writeStream.on("finish", () => {
          const uploaded: UploadedFile = {
            fieldname,
            originalFilename: filename,
            encoding,
            mimetype: mimeType,
            filepath,
            size,
          };

          if (!files[fieldname]) files[fieldname] = [];
          files[fieldname].push(uploaded);

          fileResolve();
        });
      });

      fileWritePromises.push(promise);

      file.pipe(writeStream);
    });

    bb.on("error", reject);

    bb.on("close", async () => {
      //Wait for all files to finish writing
      try {
        await Promise.all(fileWritePromises);
        resolve({ fields, files });
      } catch (err) {
        reject(err);
      }
    });

    req.pipe(bb);
  });
}

/**
 * Rich wrapper for multipart/form-data parsing.
 *
 * Provides defaults and convenient configuration.
 *
 * @param req - HTTP IncomingMessage
 * @param fileSizeMB - Maximum allowed size per file in MB (default: 5)
 * @param filesLimit - Maximum number of files (default: 5)
 * @param fieldsLimit - Maximum number of fields (default: 20)
 *
 * @example
 * ```ts
 * const { fields, files } = await getMultipartFormData(req);
 * console.log(fields);
 * console.log(files["profilePhoto"]);
 * ```
 *
 * @returns Parsed fields and uploaded files
 */
export async function getMultipartFormData(
  req: IncomingMessage,
  fileSizeMB: number = 5,
  filesLimit: number = 5,
  fieldsLimit: number = 20
) {
  return parseMultipartForm(req, {
    fileSizeLimit: fileSizeMB * 1024 * 1024,
    filesLimit,
    fieldsLimit,
  });
}
