import busboy from "busboy";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import type { IncomingMessage } from "node:http";

export interface UploadedFile {
  fieldname: string;
  originalFilename: string;
  encoding: string;
  mimetype: string;
  filepath: string;
  size: number;
}

interface ParseOptions {
  fileSizeLimit?: number;
  filesLimit?: number;
  fieldsLimit?: number;
}

export function parseMultipartForm(
  req: IncomingMessage,
  options: ParseOptions = {}
): Promise<{
  fields: Record<string, string>;
  files: Record<string, UploadedFile[]>;
}> {
  return new Promise((resolve, reject) => {
    const fields: Record<string, string> = {};
    const files: Record<string, UploadedFile[]> = [];

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
      // ✅ Wait for all files to finish writing
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
