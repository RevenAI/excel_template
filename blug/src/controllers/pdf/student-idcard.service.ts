// src/services/idcard.service.ts
import { PuppeteerService } from "./puppeteer.service.js";
import { testQR } from "../qr/test.js";
import fs from "node:fs/promises";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { PDFPage } from "pdf-lib";
import pugService from "../templating/pug.service.js";
import helpers from "../../utils/helpers.js";
import { imageService } from "../image/image-service.js";

export interface StudentIdCardData {
  _id: string;
  studentId: string;

  fullName: string;
  email: string;
  passport: string;
  gender: "male" | "female";
  bloodGroup: string

  //className: string;
  classSection: string;

  schoolName: string;
  schoolLogo: string;
  motto: string;
  address: string;

  dateIssue: string | Date;
  dateDue: string | Date;

  guardianPhone?: string;
  issuedBy?: string;
  signature?: string;
}

export interface StudentIdCardOptions {
   //system design options - for system only
  setQrToBack: boolean;
  //add more here
}

export class StudentIDCardService {
  private templateDir: string

  constructor() {
    this.templateDir = "src/controllers/pdf/pug"
  }

  // =========================
  // PUBLIC API
  // =========================
  /**
   * 
   * @param data 
   * @param outputPath 
   * @param options 
   * @returns 
   */
 public async generateIdCard(
  data: StudentIdCardData,
  outputPath?: string,
  options?: StudentIdCardOptions,
): Promise<Buffer> {
  const { qrDataUrl } = await testQR({
    _id: data._id,
    email: data.email,
    fullName: data.fullName,
  });

  const qrDataUrlBack = options?.setQrToBack ? qrDataUrl : undefined;
  const qrDataUrlFront = !options?.setQrToBack ? qrDataUrl : undefined;

  const frontHtml = await this.getFrontHtml(data, qrDataUrlFront);
  const backHtml = await this.getBackHtml(data, qrDataUrlBack);

  const frontPdf = await PuppeteerService.renderPdf({
    html: frontHtml,
    width: '540px',
    height: '340px',
    printBackground: true,
  });

  const pdfs: Buffer[] = [frontPdf];

  if (backHtml) {
    const backPdf = await PuppeteerService.renderPdf({
      html: backHtml,
      width: "380px",
      height: "220px",
      printBackground: true,
    });
    pdfs.push(backPdf);
  }

  const combined = await this.combinePdfPages(...pdfs);

  if (outputPath) {
    await helpers.createDirIfNotExists(path.dirname(outputPath))
    await fs.writeFile(outputPath, combined);
  }

  return combined;
 }

  // =========================
  // TEMPLATE RENDERING
  // =========================

/**
 * Render the front side of the ID card using Pug.
 */
private async getFrontHtml(
  data: StudentIdCardData,
  qrDataUrl?: string
): Promise<string> {
  // Pass everything to the pug template
  await helpers.createDirIfNotExists(this.templateDir);
  return pugService.renderFile(
    path.join(this.templateDir, "front.pug"), // pug template file
    {
      ...data,
      qrDataUrl,
      hasQr: Boolean(qrDataUrl?.trim()),
      expiringSoon: this.isExpiringSoon(data.dateDue),
      dateIssue: this.formatDate(data.dateIssue),
      dateDue: this.formatDate(data.dateDue),
      formatDate: this.formatDate.bind(this),
    }
  );
}

/**
 * Render the back side of the ID card using Pug.
 */
private async getBackHtml(
  data: StudentIdCardData,
  qrDataUrl?: string
): Promise<string | null> {
  const hasQr = Boolean(qrDataUrl?.trim());
  const hasSignatureSection = Boolean(data.signature || data.issuedBy);

  if (!hasQr && !hasSignatureSection) {
    return null; // skip back if nothing to render
  }

  await helpers.createDirIfNotExists(this.templateDir);
  return pugService.renderFile(
    path.join(this.templateDir, "back.pug"),
    {
      ...data,
      qrDataUrl,
      hasQr,
      hasSignatureSection,
      formatDate: this.formatDate.bind(this),
    }
  );
}

  // =========================
  // PDF UTIL
  // =========================
/**
 * Combines one or more ID card PDFs into a single, print-ready PDF.
 *
 * - Places cards side by side on a single page
 * - Adds breathing space (padding + gap)
 * - Adds bleed for safe cutting
 * - Mirrors the back card for correct physical duplex printing
 * - Draws cut marks for accurate trimming
 *
 * Expected usage:
 *   combinePdfPages(frontPdf)
 *   combinePdfPages(frontPdf, backPdf)
 */ //ORIGINAL VERSION FOR PRODUCTION WITH MORRORING
// private async combinePdfPages(
//   ...buffers: Buffer[]
// ): Promise<Buffer> {
//   // Safety check: at least one PDF (front card) is required
//   if (buffers.length === 0) {
//     throw new Error("At least one PDF buffer is required");
//   }

//   // Create the output PDF document
//   const pdf = await PDFDocument.create();

//   // Load the first page to determine card dimensions
//   // (All cards are assumed to be the same size)
//   const frontDoc = await PDFDocument.load(buffers[0]);
//   const frontPage = frontDoc.getPage(0);

//   const cardWidth = frontPage.getWidth();
//   const cardHeight = frontPage.getHeight();

//   // Print layout configuration
//   const bleed = 12;    // Extra background for safe cutting (~3mm)
//   const padding = 30;  // Outer page margin (breathing space)
//   const gap = 20;      // Space between cards

//   // Calculate final page size to fit all cards horizontally
//   const pageWidth =
//     padding * 2 +
//     cardWidth * buffers.length +
//     gap * (buffers.length - 1) +
//     bleed * 2;

//   const pageHeight =
//     padding * 2 + cardHeight + bleed * 2;

//   // Create the output page
//   const page = pdf.addPage([pageWidth, pageHeight]);

//   // Vertically center the cards for visual balance
//   const centerY = (pageHeight - cardHeight) / 2;

//   // Initial horizontal position
//   let x = padding + bleed;

//   // Render each card
//   for (let i = 0; i < buffers.length; i++) {
//     // Load the current card PDF
//     const doc = await PDFDocument.load(buffers[i]);
//     const pageToEmbed = doc.getPage(0);

//     // Embed the page so it can be drawn onto the output page
//     const [embed] = await pdf.embedPages([pageToEmbed]);

//     page.drawPage(embed, {
//       // Back card is drawn mirrored (negative width)
//       // to ensure correct alignment after physical paper flip
//       x: i === 1 ? x + cardWidth : x,
//       y: centerY,
//       width: i === 1 ? -cardWidth : cardWidth,
//       height: cardHeight,
//     });

//     // Draw crop/cut marks to guide trimming after printing
//     this.drawCutMarks(page, x, centerY, cardWidth, cardHeight);

//     // Move horizontal position for the next card
//     x += cardWidth + gap;
//   }

//   // Serialize the PDF and return it as a Buffer
//   return Buffer.from(await pdf.save());
// }

//TEST VERSION - ONLY MIRROR THE SECOND CARD
// private async combinePdfPages(
//   ...buffers: Buffer[]
// ): Promise<Buffer> {
//   // Safety check: at least one PDF (front card) is required
//   if (buffers.length === 0) {
//     throw new Error("At least one PDF buffer is required");
//   }

//   // Create the output PDF document
//   const pdf = await PDFDocument.create();

//   // Load the first page to determine card dimensions
//   // (All cards are assumed to be the same size)
//   const frontDoc = await PDFDocument.load(buffers[0]);
//   const frontPage = frontDoc.getPage(0);

//   const cardWidth = frontPage.getWidth();
//   const cardHeight = frontPage.getHeight();

//   // Print layout configuration
//   const bleed = 12;    // Extra background for safe cutting (~3mm)
//   const padding = 30;  // Outer page margin (breathing space)
//   const gap = 20;      // Space between cards

//   // Calculate final page size to fit all cards horizontally
//   const pageWidth =
//     padding * 2 +
//     cardWidth * buffers.length +
//     gap * (buffers.length - 1) +
//     bleed * 2;

//   const pageHeight =
//     padding * 2 + cardHeight + bleed * 2;

//   // Create the output page
//   const page = pdf.addPage([pageWidth, pageHeight]);

//   // Vertically center the cards for visual balance
//   const centerY = (pageHeight - cardHeight) / 2;

//   // Initial horizontal position
//   let x = padding + bleed;

//   // Render each card
//   for (let i = 0; i < buffers.length; i++) {
//     // Load the current card PDF
//     const doc = await PDFDocument.load(buffers[i]);
//     const pageToEmbed = doc.getPage(0);

//     // Embed the page so it can be drawn onto the output page
//     const [embed] = await pdf.embedPages([pageToEmbed]);

//     // Always mirror the second card (back card) for duplex printing
//     // This ensures correct orientation when physically flipping the paper
//     const isBackCard = i === 1;
    
//     page.drawPage(embed, {
//       x: isBackCard ? x + cardWidth : x,
//       y: centerY,
//       width: isBackCard ? -cardWidth : cardWidth,
//       height: cardHeight,
//     });

//     // Draw crop/cut marks to guide trimming after printing
//     this.drawCutMarks(page, x, centerY, cardWidth, cardHeight);

//     // Move horizontal position for the next card
//     x += cardWidth + gap;
//   }

//   // Serialize the PDF and return it as a Buffer
//   return Buffer.from(await pdf.save());
// }

//TEST VERSION - NO MIRROR AT ALL - NOT EVEN FOR THE SECOND CARD
/**
 * 
 * @param buffers 
 * @returns 
 */
private async combinePdfPages(
  ...buffers: Buffer[]
): Promise<Buffer> {
  // Safety check: at least one PDF (front card) is required
  if (buffers.length === 0) {
    throw new Error("At least one PDF buffer is required");
  }

  // Create the output PDF document
  const pdf = await PDFDocument.create();

  // Load the first page to determine card dimensions
  // (All cards are assumed to be the same size)
  const frontDoc = await PDFDocument.load(buffers[0]);
  const frontPage = frontDoc.getPage(0);

  const cardWidth = frontPage.getWidth();
  const cardHeight = frontPage.getHeight();

  // Print layout configuration
  const bleed = 12;    // Extra background for safe cutting (~3mm)
  const padding = 30;  // Outer page margin (breathing space)
  const gap = 20;      // Space between cards

  // Calculate final page size to fit all cards horizontally
  const pageWidth =
    padding * 2 +
    cardWidth * buffers.length +
    gap * (buffers.length - 1) +
    bleed * 2;

  const pageHeight =
    padding * 2 + cardHeight + bleed * 2;

  // Create the output page
  const page = pdf.addPage([pageWidth, pageHeight]);

  // Vertically center the cards for visual balance
  const centerY = (pageHeight - cardHeight) / 2;

  // Initial horizontal position
  let x = padding + bleed;

  // Render each card
  for (let i = 0; i < buffers.length; i++) {
    // Load the current card PDF
    const doc = await PDFDocument.load(buffers[i]);
    const pageToEmbed = doc.getPage(0);

    // Embed the page so it can be drawn onto the output page
    const [embed] = await pdf.embedPages([pageToEmbed]);

    // Draw each card normally without any mirroring
    page.drawPage(embed, {
      x: x,
      y: centerY,
      width: cardWidth,
      height: cardHeight,
    });

    // Draw crop/cut marks to guide trimming after printing
    this.drawCutMarks(page, x, centerY, cardWidth, cardHeight);

    // Move horizontal position for the next card
    x += cardWidth + gap;
  }

  // Serialize the PDF and return it as a Buffer
  return Buffer.from(await pdf.save());
}


/**
 * 
 * @param page 
 * @param x 
 * @param y 
 * @param w 
 * @param h 
 */
private drawCutMarks(
  page: PDFPage,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const len = 12;
  const lw = 0.5;

  // top-left
  page.drawLine({ start: { x, y: y + h }, end: { x: x - len, y: y + h }, thickness: lw });
  page.drawLine({ start: { x, y: y + h }, end: { x, y: y + h + len }, thickness: lw });

  // top-right
  page.drawLine({ start: { x: x + w, y: y + h }, end: { x: x + w + len, y: y + h }, thickness: lw });
  page.drawLine({ start: { x: x + w, y: y + h }, end: { x: x + w, y: y + h + len }, thickness: lw });

  // bottom-left
  page.drawLine({ start: { x, y }, end: { x: x - len, y }, thickness: lw });
  page.drawLine({ start: { x, y }, end: { x, y: y - len }, thickness: lw });

  // bottom-right
  page.drawLine({ start: { x: x + w, y }, end: { x: x + w + len, y }, thickness: lw });
  page.drawLine({ start: { x: x + w, y }, end: { x: x + w, y: y - len }, thickness: lw });
}

  // =========================
  // HELPERS
  // =========================
  /**
   * 
   * @param dateDue 
   * @returns 
   */
  private isExpiringSoon(dateDue: string | Date): boolean {
    const due = new Date(dateDue);
    const today = new Date();
    const days = (due.getTime() - today.getTime()) / 86400000;
    return days <= 30;
  }

  /**
   * 
   * @param date 
   * @returns 
   */
  private formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat("en-GB").format(new Date(date));
  }

  /**
   * 
   */
  public async close() {
    await PuppeteerService.shutdown();
  }


  //for testing
private getDummyPassport = async () => {
  const passport = await imageService.readImageDataUrl('nexalearn', 'passport', 'nexalearn-passport-abidemi_ademola-1767950650188-9296cd34d7df-thumb.webp')
  return passport
}

private getDummyLogo = async () => {
  const logo = await imageService.readImageDataUrl('nexalearn', 'logo', 'nexalearn-logo-abidemi_ademola-1767972388956-ee184b9b904b-thumb.webp')
  return logo
}

public async getDummyStudentIdCardData(): Promise<StudentIdCardData> {
  return {
  _id: "64b7f1c8a2d3e5f1b0a12345",
  studentId: "STU2026001",

  fullName: "Adebayo Tunde",
  email: "adebayo.tunde@example.com",
  passport: await this.getDummyPassport(),
  gender: "male",
  bloodGroup: 'O+',

  //className: "Senior Secondary 2",
  classSection: "SS 1",

  schoolName: "Greenfield International School",
  schoolLogo: await this.getDummyLogo(),
  motto: "Knowledge, Integrity, Excellence",
  address: "123 Elm Street, Lagos, Nigeria",

  dateIssue: new Date("2026-01-08"),
  dateDue: new Date("2027-01-08"),

  guardianPhone: "+234 801 234 5678",
  issuedBy: "Mrs. Folake Adeyemi",
  signature: "https://example.com/assets/signature.png"
};
} 

}

