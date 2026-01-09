import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

/**
 * Result returned after successful image processing.
 * This object is safe to store directly in the database.
 */
export interface ProcessedImageResult {
  /** Original filename as received from the client */
  originalName: string;

  /** Public paths to generated image variants */
  variants: {
    /** Small square image for avatars, lists, etc. */
    thumbnail: string;

    /** Medium-sized image for normal UI display */
    medium: string;

    /** High-resolution image intended for PDF / print usage */
    pdf: string;
  };
}

/**
 * Optional configuration for image processing.
 */
export interface ImageProcessOptions {
  /**
   * Absolute directory where processed images will be stored.
   * Defaults to `<project-root>/uploads/images`
   */
  outputDir?: string;

  /**
   * Maximum width (in pixels) for the high-resolution PDF variant.
   * Height is automatically calculated to preserve aspect ratio.
   *
   * Default: 2000px
   */
  maxWidthPdf?: number;
}

export interface SafeFileName {
  tenant: string;
  category: string;
  stableKey: string;
}

/**
 * ImageProcessingService
 *
 * Responsible ONLY for:
 * - converting a validated image buffer into multiple variants
 * - saving those variants to disk
 * - returning public-facing paths
 *
 * This service:
 * ❌ does NOT validate file types
 * ❌ does NOT parse HTTP requests
 * ❌ does NOT touch the database
 *
 * Those concerns belong elsewhere.
 */
class ImageProcessingService {
  /**
   * Default directory where all processed images are stored.
   */
  private readonly DEFAULT_OUTPUT_DIR = path.join(
    process.cwd(),
    "uploads",
    "images"
  );

  /**
   * Default width (in pixels) for PDF/print images.
   */
  private readonly DEFAULT_PDF_WIDTH = 2000;

  /**
   * Process a validated image buffer and generate multiple variants.
   *
   * @param buffer - A validated image buffer (JPEG, PNG, WebP, etc.)
   * @param originalFileName - Original filename provided by the client
   * @param options - Optional processing configuration
   *
   * @returns Metadata containing public paths to generated images
   */
  async process(
    buffer: Buffer,
    namingContext: SafeFileName & { originalName: string },
    options: ImageProcessOptions = {}
  ): Promise<ProcessedImageResult> {
    // Resolve configuration
    const outputDir = options.outputDir ?? this.DEFAULT_OUTPUT_DIR;
    const pdfWidth = options.maxWidthPdf ?? this.DEFAULT_PDF_WIDTH;

    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Generate a safe, collision-resistant base filename
    const baseName = this.generateSafeBaseName({
        tenant: namingContext.tenant,
        category: namingContext.category,
        stableKey: namingContext.stableKey,
    });

    // Define output filenames (relative to outputDir)
    const variants = {
      thumbnail: `${baseName}-thumb.webp`,
      medium: `${baseName}-medium.webp`,
      pdf: `${baseName}-pdf.png`
    };

    /**
     * Create a Sharp instance from the buffer.
     * `failOnError: true` ensures corrupted images throw immediately.
     */
    const image = sharp(buffer, { failOnError: true });

    /**
     * Decode the image ONCE and clone the pipeline for each output.
     * This is the correct and memory-efficient Sharp usage pattern.
     */
    await Promise.all([
      // Thumbnail (square, cropped)
      image
        .clone()
        .resize(150, 150, { fit: "cover" })
        .webp({ quality: 70 })
        .toFile(path.join(outputDir, variants.thumbnail)),

      // Medium UI image
      image
        .clone()
        .resize(800, undefined, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(outputDir, variants.medium)),

      // High-resolution image for PDF / print
      image
        .clone()
        .resize(pdfWidth, undefined, { withoutEnlargement: true })
        .png({ compressionLevel: 9 })
        .toFile(path.join(outputDir, variants.pdf))
    ]);

    // Return DB-safe, public-facing paths
    return {
      originalName: namingContext.originalName,
      variants: {
        thumbnail: this.toPublicPath(outputDir, variants.thumbnail),
        medium: this.toPublicPath(outputDir, variants.medium),
        pdf: this.toPublicPath(outputDir, variants.pdf)
      }
    };
  }

  /**
   * -------------------------
   * INTERNAL HELPERS
   * -------------------------
   */

  /**
   * Generate a filesystem-safe, collision-resistant base filename.
   *
   * - Strips unsafe characters
   * - Normalizes casing
   * - Appends a short random hash
   *
   * @param fileName - Original filename from the client
   */
//   private generateSafeBaseName(fileName: string): string {
//     const name = path
//       .parse(fileName)
//       .name
//       .toLowerCase()
//       .replace(/[^a-z0-9_-]/g, "");

//     const hash = crypto.randomBytes(6).toString("hex");

//     return `${name}-${hash}`;
//   }


/**
 * Generates a system-enforced, collision-resistant filename base
 * for uploaded files.
 *
 * ❗ User-provided filenames are NOT used.
 * 
 * The generated name follows the strict pattern:
 *
 *   tenant-category-stableKey-timestamp-randomness
 *
 * Example:
 *   nexalearn-passport-student_123-1705088123456-a3f91c2d4e1b
 *
 * This ensures:
 * - Multi-tenant safety
 * - Deterministic querying by tenant/category/stableKey
 * - Guaranteed uniqueness
 * - Filesystem and cloud-storage safety
 *
 * @param {Object} params
 * @param {string} params.tenant
 *   Required tenant identifier (e.g. organization or client name).
 *
 * @param {string} params.category
 *   Required image category (e.g. "passport", "avatar").
 *
 * @param {string} params.stableKey
 *   Required business identifier (e.g. userId, studentId).
 *   Used for logical grouping and querying.
 *
 * @returns {string}
 *   A sanitized, unique filename base (without extension).
 *
 * @throws {Error}
 *   If any required parameter is missing or invalid.
 */
private generateSafeBaseName(context: SafeFileName): string {
  /**
   * Enforce required naming inputs.
   * This function must NEVER silently recover.
   */
  if (!context.tenant || !context.category || !context.stableKey) {
    throw new Error(
      "Filename generation requires tenant, category, and stableKey"
    );
  }

  /**
   * Normalize and sanitize all naming components
   * - lowercase for consistency
   * - remove unsafe filesystem / URL characters
   */
  const tenant = context.tenant
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");

  const category = context.category
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");

  const stableKey = context.stableKey
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");

  /**
   * Validate sanitized output
   * Prevents empty or malformed path segments
   */
  if (!tenant || !category || !stableKey) {
    throw new Error("Invalid tenant, category, or stableKey after sanitization");
  }

  /**
   * Timestamp ensures chronological traceability
   * Example: 1705088123456
   */
  const timestamp = Date.now();

  /**
   * Random suffix guarantees uniqueness
   * Prevents collisions across parallel uploads
   */
  const randomness = crypto.randomBytes(6).toString("hex");

  /**
   * FINAL enforced naming pattern:
   * tenant-category-stableKey-timestamp-randomness
   */
  return `${tenant}-${category}-${stableKey}-${timestamp}-${randomness}`;
}

  /**
   * Convert an absolute disk path into a public URL path.
   *
   * Example:
   *   Disk:   /app/uploads/images/photo.webp
   *   Public: /uploads/images/photo.webp
   *
   * @param rootDir - Absolute directory where images are stored
   * @param fileName - Image filename
   */
  private toPublicPath(rootDir: string, fileName: string): string {
    const uploadsRoot = path.join(process.cwd(), "uploads");

    return path
      .join(rootDir.replace(uploadsRoot, ""), fileName)
      .replace(/\\/g, "/");
  }
}

/**
 * Export a singleton instance.
 *
 * This ensures:
 * - shared configuration
 * - no unnecessary instantiation
 * - easy mocking in tests
 */
export const imageProcessor = new ImageProcessingService();
