import Busboy from "busboy";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

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
  req: any,
  options: ParseOptions = {}
): Promise<{ fields: Record<string, string>; files: Record<string, UploadedFile[]> }> {

  return new Promise((resolve, reject) => {
    const fields: Record<string, string> = {};
    const files: Record<string, UploadedFile[]> = {};

    // 🚨 REQUIRED: content-type must exist
    if (!req.headers["content-type"]?.includes("multipart/form-data")) {
      return reject(new Error("Request is not multipart/form-data"));
    }

    const busboy = Busboy({
      headers: req.headers,
      limits: {
        fileSize: options.fileSizeLimit,
        files: options.filesLimit,
        fields: options.fieldsLimit,
      },
    });

    busboy.on("field", (name, value) => {
      fields[name] = value;
    });

    busboy.on("file", (fieldname, file, info) => {
      const { filename, encoding, mimeType } = info;

      const tempPath = path.join(
        os.tmpdir(),
        `${Date.now()}-${filename}`
      );

      const writeStream = fs.createWriteStream(tempPath);
      let size = 0;

      file.on("data", (chunk) => {
        size += chunk.length;
      });

      file.pipe(writeStream);

      writeStream.on("close", () => {
        const uploaded: UploadedFile = {
          fieldname,
          originalFilename: filename,
          encoding,
          mimetype: mimeType,
          filepath: tempPath,
          size,
        };

        if (!files[fieldname]) files[fieldname] = [];
        files[fieldname].push(uploaded);
      });
    });

    busboy.on("error", reject);

    busboy.on("finish", () => {
      resolve({ fields, files });
    });

     console.log('busboy data after processed', busboy)


    // 🔥🔥🔥 THIS IS THE MISSING LINE 🔥🔥🔥
    req.pipe(busboy);
  });
}
