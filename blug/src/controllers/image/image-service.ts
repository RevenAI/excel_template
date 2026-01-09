import fs from "fs/promises";
import path from "path";
import { IncomingMessage } from "http";
import { imageProcessor, ProcessedImageResult, ImageProcessOptions, SafeFileName } from "../../utils/image-processor.js"
import { getMultipartFormData, UploadedFile } from "../../utils/form-data-parser.js"
import cryto from 'node:crypto';

/**
 * Options for uploading images
 */
export interface UploadImageOptions extends ImageProcessOptions {
  /** Tenant name to segregate storage */
  tenant: string;
  /** Image category/folder (e.g., "passport", "profile") */
  category: string;

  /** Image key and uniqeu name - could be userId, productId etc */
  stableKey: string;
}

/**
 * Multi-tenant ImageService
 *
 * Responsibilities:
 * - Upload & process images
 * - Read images for FE / PDF / reports
 * - Rename or move images
 * - Delete images
 * - Organize files by tenant and category
 */
export class ImageService {
  /** Root uploads folder */
  private readonly rootDir = path.join(process.cwd(), "uploads");

    /**
 * Uploads and processes images from a multipart/form-data request.
 *
 * - Reads files and fields from the request using `getMultipartFormData`.
 * - Processes each file with `ImageProcessingService` (generates thumbnail, medium, PDF variants).
 * - Organizes images into tenant/category folders.
 * - Cleans up temporary uploaded files.
 * - Returns both form fields and processed image metadata.
 *
 * @param req - Incoming HTTP request
 * @param options - Upload configuration including default tenant/category and image processing options
 *
 * @returns Object containing:
 *   - `fields`: all non-file form fields sent with the request
 *   - `images`: array of processed image results (thumbnails, medium, PDF)
 *
 * @example
 * ```ts
 * const { fields, images } = await imageService.uploadFromRequest(req, {
 *   tenant: "schoolA",
 *   category: "passport",
 *   maxWidthPdf: 2500
 * });
 *
 * console.log(fields); // { userId: "123", description: "profile photo" }
 * console.log(images[0].variants.thumbnail); // "/uploads/schoolA/passport/photo-abc123-thumb.webp"
 * ```
 */
async uploadFromRequest(
  req: IncomingMessage,
  options: UploadImageOptions
): Promise<{ fields: Record<string, string>; images: ProcessedImageResult[] }> {
    try {
                // Parse multipart/form-data using the custom wrapper
        // `fields` contains all text inputs, `files` contains all uploaded files
        if (!options.category && !options.tenant) {
            throw new Error('Missing tenant and/or category path option(s)');
        }

        const { fields, files } = await getMultipartFormData(req);

        // Flatten files object into a single array (supports multiple files per field)
        const allFiles: UploadedFile[] = Object.values(files).flat();

        // Array to store results of processed images
        const results: ProcessedImageResult[] = [];

        // Determine tenant and category folder
        // - Prefer values from form fields if provided, else fallback to default options
        const tenant = fields?.tenant || options.tenant;
        const category = fields?.category || options.category;
        const stableKey = options.stableKey || String(cryto.randomBytes(8));

        for (const file of allFiles) {
            // Construct full output directory for this tenant and category
            const outputDir = path.join(this.rootDir, tenant, category);

            // Read uploaded file from temp storage into a Buffer
            const buffer = await fs.readFile(file.filepath);

            // Process image using ImageProcessingService
            // - Generates thumbnail, medium, and PDF variants
            // - Saves them into the outputDir
            const namingContext: SafeFileName  & { originalName: string } = {
                originalName: file.originalFilename,
                tenant,
                category,
                stableKey
            }
            const processed = await imageProcessor.process(buffer, namingContext, { ...options, outputDir });

            // Add processed image info to results
            results.push(processed);

            // Delete temporary uploaded file to free disk space
            await fs.unlink(file.filepath);
        }

        // Return both form fields and processed images for further use (e.g., saving to DB)
        return { fields, images: results };

    } catch(error) {
        throw error
    }
}

  /**
   * Get public URLs for all images in a tenant/category
   *
   * @param tenant - Tenant name
   * @param category - Image category/folder
   *
   * @returns Array of image paths
   */
  async listImages(tenant: string, category: string): Promise<string[]> {
    const dir = path.join(this.rootDir, tenant, category);

    try {
      const files = await fs.readdir(dir);
      return files.map(file => path.join("/uploads", tenant, category, file).replace(/\\/g, "/"));
    } catch {
      return [];
    }
  }

  /**
   * Delete a specific image
   *
   * @param tenant - Tenant name
   * @param category - Category/folder
   * @param fileName - Filename to delete
   *
   * @returns True if file existed and was deleted
   */
  async deleteImage(tenant: string, category: string, fileName: string): Promise<boolean> {
    const filePath = path.join(this.rootDir, tenant, category, fileName);

    try {
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Rename/move an image within the same tenant/category
   *
   * @param tenant - Tenant name
   * @param category - Category/folder
   * @param oldName - Existing filename
   * @param newName - New filename
   *
   * @returns True if rename succeeded
   */
  async renameImage(tenant: string, category: string, oldName: string, newName: string): Promise<boolean> {
    const oldPath = path.join(this.rootDir, tenant, category, oldName);
    const newPath = path.join(this.rootDir, tenant, category, newName);

    try {
      await fs.rename(oldPath, newPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Read an image buffer (for FE, PDF, etc.)
   *
   * @param tenant - Tenant name
   * @param category - Category/folder
   * @param fileName - Filename to read
   *
   * @returns Buffer of the file
   */
  async readImage(tenant: string, category: string, fileName: string): Promise<Buffer | null> {
    const filePath = path.join(this.rootDir, tenant, category, fileName);

    try {
      return await fs.readFile(filePath);
    } catch {
      return null;
    }
  }

  /**
   * Get absolute path for an image
   *
   * @param tenant - Tenant name
   * @param category - Image category
   * @param fileName - Image filename
   */
  getAbsolutePath(tenant: string, category: string, fileName: string): string {
    return path.join(this.rootDir, tenant, category, fileName);
  }
}

/**
 * Singleton instance
 */
export const imageService = new ImageService();
