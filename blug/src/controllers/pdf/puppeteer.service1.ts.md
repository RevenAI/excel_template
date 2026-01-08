// src/services/puppeteer.service.ts
import puppeteer, { Browser, Page, LaunchOptions } from "puppeteer";

export interface PuppeteerRenderOptions {
  html: string;                  // Full HTML content
  width?: string;                // e.g., "350px" for ID card
  height?: string;               // e.g., "200px" for ID card
  format?: "A4" | "Letter";      // Optional page format
  printBackground?: boolean;     // Include CSS backgrounds
  scale?: number;                // Scale factor
}

export class PuppeteerService {
  private browser: Browser | null = null;

  // Launch Puppeteer browser if not already launched
  private async launchBrowser(options?: LaunchOptions) {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        ...options,
      });
    }
    return this.browser;
  }

  // Close browser (optional cleanup)
  public async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  /**
   * Render HTML to PDF buffer
   * @param opts PuppeteerRenderOptions
   * @returns PDF as Buffer
   */
  public async renderPdf(opts: PuppeteerRenderOptions): Promise<Buffer> {
    const browser = await this.launchBrowser();
    const page: Page = await browser.newPage();

    try {
      // Set content
      await page.setContent(opts.html, { waitUntil: "networkidle0" });

      // Optional viewport for small designs (like ID cards)
      if (opts.width && opts.height) {
        await page.setViewport({
          width: parseInt(opts.width, 10),
          height: parseInt(opts.height, 10),
        });
      }

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: opts.format || "A4",
        printBackground: opts.printBackground ?? true,
        width: opts.width,
        height: opts.height,
        scale: opts.scale ?? 1,
      });

      return pdfBuffer;
    } catch (err) {
      console.error("Puppeteer renderPdf error:", err);
      throw err;
    } finally {
      await page.close();
    }
  }

  /**
   * Render HTML to image buffer (png or jpeg)
   * @param opts PuppeteerRenderOptions
   * @param type "png" | "jpeg"
   */
  public async renderImage(
    opts: PuppeteerRenderOptions,
    type: "png" | "jpeg" = "png"
  ): Promise<Buffer> {
    const browser = await this.launchBrowser();
    const page: Page = await browser.newPage();

    try {
      await page.setContent(opts.html, { waitUntil: "networkidle0" });

      if (opts.width && opts.height) {
        await page.setViewport({
          width: parseInt(opts.width, 10),
          height: parseInt(opts.height, 10),
        });
      }

      const imageBuffer = await page.screenshot({
        type,
        fullPage: false,
      });

      return imageBuffer;
    } catch (err) {
      console.error("Puppeteer renderImage error:", err);
      throw err;
    } finally {
      await page.close();
    }
  }
}
