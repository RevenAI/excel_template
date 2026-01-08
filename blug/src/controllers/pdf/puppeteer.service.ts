// src/services/puppeteer.service.ts
import puppeteer, {
  Browser,
  Page,
  LaunchOptions,
  PDFOptions,
} from "puppeteer";

/**
 * Options for rendering HTML using Puppeteer.
 *
 * This service is intentionally designed for:
 * - PDF generation (ID cards, certificates, reports)
 * - Image generation (PNG/JPEG previews)
 *
 * IMPORTANT:
 * - HTML should be fully self-contained:
 *   inline CSS, inline fonts, and base64 images (QR, logos, photos)
 * - External network requests will slow rendering
 */
export interface PuppeteerRenderOptions {
  /**
   * Full HTML markup to render.
   * Should include <html>, <head>, and <body>.
   */
  html: string;

  /**
   * Custom page width.
   * Used for ID cards or non-standard sizes.
   * Examples: "350px", "85.6mm"
   */
  width?: string;

  /**
   * Custom page height.
   * Examples: "200px", "54mm"
   */
  height?: string;

  /**
   * Standard paper size.
   * Used only when width/height are not provided.
   */
  format?: "A4" | "Letter";

  /**
   * Whether to render CSS backgrounds.
   * Should almost always be true for branded designs.
   */
  printBackground?: boolean;

  /**
   * Scale factor for rendering.
   * Useful for fine-tuning DPI or compact layouts.
   */
  scale?: number;

  /**
   * Page ranges to render.
   * Example: "1-3"
   */
  pageRange?: string;
}

/**
 * PuppeteerService
 * ------------------------------------------------------
 * A high-performance, production-grade Puppeteer wrapper.
 *
 * DESIGN GOALS:
 * - Single shared Chromium instance (singleton)
 * - Fast rendering for high-volume workloads
 * - Safe to use in HTTP servers and background workers
 * - Zero browser relaunch per request
 *
 * PERFORMANCE NOTES:
 * - Browser launch is expensive (~300–600ms)
 * - Page creation is cheap (~5–20ms)
 * - This service keeps Chromium warm and reused
 *
 * USAGE:
 * - Call renderPdf / renderImage directly (static methods)
 * - Call shutdown() on server/process exit
 */
export class PuppeteerService {
  /**
   * Shared Chromium browser instance.
   * This is intentionally static to prevent relaunch per request.
   */
  private static browser: Browser | null = null;

  /**
   * Get or launch a shared Puppeteer browser instance.
   *
   * This method:
   * - Launches Chromium only once
   * - Reuses it across all render operations
   * - Dramatically improves performance under load
   */
  private static async getBrowser(
    options?: LaunchOptions
  ): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        //headless: "new",
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
        ...options,
      });
    }

    return this.browser;
  }

  /**
   * Render HTML into a PDF buffer.
   *
   * Optimized for:
   * - ID cards
   * - Certificates
   * - Reports
   * - Printable documents
   *
   * PERFORMANCE STRATEGY:
   * - Uses `domcontentloaded` instead of `networkidle`
   * - Assumes inline assets
   * - Avoids unnecessary viewport configuration
   */
  static async renderPdf(
    opts: PuppeteerRenderOptions
  ): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page: Page = await browser.newPage();

    try {
      // Load HTML as fast as possible
      await page.setContent(opts.html, {
        waitUntil: "domcontentloaded",
      });

      const pdfOptions: PDFOptions = {
        printBackground: opts.printBackground ?? true,
        scale: opts.scale ?? 1,
        preferCSSPageSize: true,
      };

      // Custom page size (ID cards, badges, etc.)
      if (opts.width && opts.height) {
        pdfOptions.width = opts.width;
        pdfOptions.height = opts.height;
      } else {
        // Standard document format fallback
        pdfOptions.format = opts.format ?? "A4";
      }
      
      // Optional page range support
      if (opts.pageRange) {
        pdfOptions.pageRanges = opts.pageRange;
      }

      return await page.pdf(pdfOptions);
    } finally {
      // Always close the page (browser stays alive)
      await page.close();
    }
  }

  /**
   * Render HTML into an image buffer (PNG or JPEG).
   *
   * Common use cases:
   * - Preview thumbnails
   * - QR card images
   * - Digital ID cards
   * - Email embeds
   */
  static async renderImage(
    opts: PuppeteerRenderOptions,
    type: "png" | "jpeg" = "png"
  ): Promise<Buffer> {
    const browser = await this.getBrowser();
    const page: Page = await browser.newPage();

    try {
      await page.setContent(opts.html, {
        waitUntil: "domcontentloaded",
      });

      return await page.screenshot({
        type,
        fullPage: false,
        omitBackground: false,
      });
    } finally {
      await page.close();
    }
  }

  /**
   * Gracefully shut down the shared browser instance.
   *
   * CALL THIS:
   * - On server shutdown
   * - On worker termination
   * - During graceful process exit
   *
   * Example:
   * process.on("SIGTERM", PuppeteerService.shutdown);
   */
  static async shutdown() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
  
}
