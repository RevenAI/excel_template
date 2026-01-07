import busboyFactory from "busboy";
import type { IncomingMessage } from "http";
import fs from "fs";
import path from "path";
import os from "os";

/**
 * Represents a single uploaded file saved to disk
 */
export interface UploadedFile {
  /** Original file name as uploaded by the client */
  filename: string;
  /** File encoding (e.g., '7bit', 'utf8') */
  encoding: string;
  /** MIME type of the file */
  mimetype: string;
  /** Path on disk where the file is stored temporarily */
  filepath: string;
  /** File size in bytes */
  size: number;
}

/**
 * Represents the parsed result of a multipart/form-data request
 */
export interface ParsedFormData {
  /** Key-value pairs of normal form fields */
  fields: Record<string, string>;
  /** Files uploaded via the form, keyed by field name */
  files: Record<string, UploadedFile[]>;
}

/**
 * Parses a multipart/form-data HTTP request using Busboy
 *
 * This function automatically handles:
 * - Streaming uploaded files to a temporary directory
 * - Capturing normal form fields
 * - Enforcing file size, number of files, and number of fields limits
 *
 * @param req The incoming HTTP request (`IncomingMessage`) containing multipart/form-data
 * @param options Optional settings for the parser
 * @param options.fileSizeLimit Maximum size per file in bytes (default 10MB)
 * @param options.filesLimit Maximum number of files allowed (default 10)
 * @param options.fieldsLimit Maximum number of non-file fields allowed (default 50)
 * @param options.tempDir Directory to store temporary uploaded files (default: OS temp dir)
 * @returns Promise that resolves to `ParsedFormData` containing fields and files
 *
 * @example
 * ```ts
 * import { parseMultipartForm } from './busboy-parser';
 * import http from 'http';
 *
 * const server = http.createServer(async (req, res) => {
 *   if (req.method === 'POST') {
 *     try {
 *       const { fields, files } = await parseMultipartForm(req, {
 *         fileSizeLimit: 20 * 1024 * 1024, // 20MB per file
 *       });
 *       console.log('Fields:', fields);
 *       console.log('Files:', files);
 *       res.writeHead(200, { 'Content-Type': 'application/json' });
 *       res.end(JSON.stringify({ fields, files }));
 *     } catch (err) {
 *       res.writeHead(400, { 'Content-Type': 'text/plain' });
 *       res.end('Upload failed: ' + (err as Error).message);
 *     }
 *   } else {
 *     res.writeHead(405, { 'Content-Type': 'text/plain' });
 *     res.end('Method Not Allowed');
 *   }
 * });
 *
 * server.listen(3000, () => console.log('Server running on http://localhost:3000'));
 * ```
 */
export async function parseMultipartForm(
  req: IncomingMessage,
  options?: {
    fileSizeLimit?: number;
    filesLimit?: number;
    fieldsLimit?: number;
    tempDir?: string;
  }
): Promise<ParsedFormData> {
  const tempDir = options?.tempDir || os.tmpdir();

  return new Promise<ParsedFormData>((resolve, reject) => {
    const fields: Record<string, string> = {};
    const files: Record<string, UploadedFile[]> = {};

    // Create a Busboy instance for this request
    const bb = busboyFactory({
      headers: req.headers,
      limits: {
        fileSize: options?.fileSizeLimit ?? 10 * 1024 * 1024, // default 10MB per file
        files: options?.filesLimit ?? 10,                     // default 10 files
        fields: options?.fieldsLimit ?? 50,                  // default 50 fields
      },
    });

    // ---------------- Handle regular form fields ----------------
    bb.on(
      "field",
      (
        fieldname: string,
        val: string,
        info: {
          nameTruncated: boolean;
          valueTruncated: boolean;
          encoding: string;
          mimeType: string;
        }
      ) => {
        // Store field in the result object
        fields[fieldname] = val;
      }
    );

    // ---------------- Handle uploaded files ----------------
bb.on(
  "file",
  (
    fieldname: string,
    file: NodeJS.ReadableStream,
    info: {
      filename: string;
      encoding: string;
      mimeType: string;
    }
  ) => {
    const { filename, encoding, mimeType } = info;

    // Fallback in case the client does not send a filename
    const originalName = filename || "unnamed-file";

    // Sanitize filename to avoid invalid characters and path traversal
    const safeFilename = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");

    // Create a unique temporary filename
    const safeName = `${Date.now()}-${safeFilename}`;
    const filepath = path.join(tempDir, safeName);

    const writeStream = fs.createWriteStream(filepath);
    let fileSize = 0;

    // Track file size as chunks arrive
    file.on("data", (chunk: Buffer) => {
      fileSize += chunk.length;
    });

    // Stream file directly to disk
    file.pipe(writeStream);

    // When finished writing, store metadata
    writeStream.on("finish", () => {
      if (!files[fieldname]) files[fieldname] = [];
      files[fieldname].push({
        filename: originalName,
        encoding,
        mimetype: mimeType,
        filepath,
        size: fileSize,
      });
    });

    // Propagate stream errors
    writeStream.on("error", reject);
    file.on("error", reject);
  }
);

    // ---------------- Finish event ----------------
    bb.on("finish", () => {
      // Resolve promise with all collected fields and files
      resolve({ fields, files });
    });

    // ---------------- Error event ----------------
    bb.on("error", reject);

    // Start parsing by piping request stream into Busboy
    req.pipe(bb);
  });
}
