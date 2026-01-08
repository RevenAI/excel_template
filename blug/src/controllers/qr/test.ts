
import { QRCodeService } from "./qrcode.service.js"; 
import fs from "node:fs/promises";
import path from "node:path";

export interface StudentQrData {
    _id: string
    email: string
    fullName: string
  }

  const qrImagePath = "src/controllers/qr-image/student_qr.png";
  const qrImageDir = path.dirname(qrImagePath);


export async function testQR(student: StudentQrData) {
 try {
  const qrDataUrl = await QRCodeService.generateDataURL(student);
  console.log(qrDataUrl); // "data:image/png;base64,..."

  // Optional: generate buffer if you want to save
  const qrBuffer = await QRCodeService.generateBuffer(student);

  try {
    await fs.access(qrImageDir, fs.constants.F_OK);
  } catch {
    await fs.mkdir(qrImageDir, { recursive: true })
  }

  await fs.writeFile(qrImagePath, qrBuffer);

  //return both and the caller can chose what to use
  return { qrDataUrl, qrBuffer }
 } catch (error) {
    throw error  
 }
}
