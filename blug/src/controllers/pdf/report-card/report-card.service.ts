// src/services/report-card.service.ts
import { PuppeteerService } from "../puppeteer.service.js";
import fs from "node:fs/promises";
import path from "node:path";
import helpers from "../../../utils/helpers.js";
import { dummyFinalReportCard, FinalReportCard } from "../../report/types.js";
import templatingService from "../../templating/templating.service.js";

/* ================================
   REPORT CARD SERVICE
================================ */

class ReportCardService {
  private templateDir: string;

  constructor() {
    this.templateDir = "src/controllers/pdf/report-card/html";
  }

  /* =========================
     PUBLIC API
  ========================= */

  /**
   * Generate a single-page academic report card PDF
   * @param data - FinalReportCard data object
   * @param outputPath - optional file path to save PDF
   * @returns Buffer containing PDF
   */
  public async generateReportCard(
    data: FinalReportCard,
    outputPath?: string
  ): Promise<Buffer> {
    const html = await this.renderReportHtml(data);

    const pdf = await PuppeteerService.renderPdf({
      html,
      format: "A4",
      printBackground: true,
    });

    if (outputPath) {
      await helpers.createDirIfNotExists(path.dirname(outputPath));
      await fs.writeFile(outputPath, pdf);
    }

    return pdf;
  }

  /* =========================
     TEMPLATE RENDERING
  ========================= */

  /**
   * Render the report card HTML using Handlebars
   * @param data - FinalReportCard object
   */
  private async renderReportHtml(data: FinalReportCard): Promise<string> {
    // Ensure template directory exists
    await helpers.createDirIfNotExists(this.templateDir);

    // Load HTML template file
    const templatePath = path.join(this.templateDir, "r1.html"); 
    const templateContent = await fs.readFile(templatePath, "utf-8");

    // Render template with Handlebars
    return templatingService.render(templateContent, {
      ...data,
      formatNumber: this.formatNumber,
    });
  }

  /* =========================
     HELPERS
  ========================= */

  /**
   * Format a number with fixed decimals
   */
  private formatNumber(value: number, decimals = 2): string {
    return value.toFixed(decimals);
  }

  /**
   * Shutdown Puppeteer browser when done
   */
  public async close() {
    await PuppeteerService.shutdown();
  }

  /* =========================
     DUMMY DATA (DEV ONLY)
  ========================= */

  public async getDummyReportCardData(): Promise<FinalReportCard> {
    return dummyFinalReportCard;
  }
}

export default new ReportCardService();
