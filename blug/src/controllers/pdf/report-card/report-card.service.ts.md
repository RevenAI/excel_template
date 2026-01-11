// src/services/report-card.service.ts
import { PuppeteerService } from "../puppeteer.service.js";
import fs from "node:fs/promises";
import path from "node:path";
import pugService from "../../templating/pug.service.js";
import helpers from "../../../utils/helpers.js";
import { dummyFinalReportCard, FinalReportCard } from "../../report/types.js";

/* ================================
   SERVICE
================================ */

class ReportCardService {
  private templateDir: string;

  constructor() {
    this.templateDir = "src/controllers/pdf/report-card/pug";
  }

  /* =========================
     PUBLIC API
  ========================= */

  /**
   * Generate a single-page academic report card PDF
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
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "15mm",
        right: "15mm",
      },
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

  private async renderReportHtml(
    data: FinalReportCard
  ): Promise<string> {
    await helpers.createDirIfNotExists(this.templateDir);

    return pugService.renderFile(
      path.join(this.templateDir, "r1.pug"),
      {
        ...data,
        formatNumber: this.formatNumber,
      }
    );
  }

  /* =========================
     HELPERS
  ========================= */

  private formatNumber(value: number, decimals = 2): string {
    return value.toFixed(decimals);
  }

  public async close() {
    await PuppeteerService.shutdown();
  }

  /* =========================
     DUMMY DATA (DEV ONLY)
  ========================= */
  public async getDummyReportCardData(): Promise<FinalReportCard> {
    return dummyFinalReportCard
  }
}

export default new ReportCardService() 